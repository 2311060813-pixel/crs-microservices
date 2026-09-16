package vn.edu.crs.apigateway.filter;

import vn.edu.crs.apigateway.cache.ApiKeyValidationCache;
import vn.edu.crs.apigateway.client.AuthServiceClient;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;

import org.springframework.core.Ordered;

import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;

import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@Component
public class ApiKeyFilter implements GlobalFilter, Ordered {

    private final AuthServiceClient authServiceClient;
    private final ApiKeyValidationCache cache;

    public ApiKeyFilter(
            AuthServiceClient authServiceClient,
            ApiKeyValidationCache cache
    ) {
        this.authServiceClient = authServiceClient;
        this.cache = cache;
    }

    private static final String PARTNER_PATH =
            "/api/public/courses";

    private static final String REQUIRED_SCOPE =
            "courses:read";

    @Override
    public Mono<Void> filter(
            ServerWebExchange exchange,
            GatewayFilterChain chain
    ) {

        ServerHttpRequest request = exchange.getRequest();

        String path = request.getURI().getPath();

        // Chỉ áp dụng API Key cho route đối tác
        if (!path.startsWith(PARTNER_PATH)) {
            return chain.filter(exchange);
        }

        // Lấy API Key từ header
        String apiKey = request.getHeaders()
                .getFirst("X-API-KEY");

        // Không có API Key
        if (apiKey == null || apiKey.isBlank()) {
            return reject(exchange);
        }

        // Cache theo API Key + Scope
        String cacheKey =
                apiKey + ":" + REQUIRED_SCOPE;

        Boolean cached = cache.get(cacheKey);

        // Đã có trong cache
        if (cached != null) {
            if (cached) {
                return chain.filter(exchange);
            }

            return reject(exchange);
        }

        // Chưa có cache -> gọi auth-service
        return authServiceClient
                .isValidForScope(
                        apiKey,
                        REQUIRED_SCOPE
                )
                .flatMap(valid -> {

                    cache.put(cacheKey, valid);

                    if (valid) {
                        return chain.filter(exchange);
                    }

                    return reject(exchange);
                });
    }

    private Mono<Void> reject(
            ServerWebExchange exchange
    ) {

        exchange.getResponse()
                .setStatusCode(HttpStatus.FORBIDDEN);

        return exchange.getResponse().setComplete();
    }

    @Override
    public int getOrder() {
        return -2;
    }
}