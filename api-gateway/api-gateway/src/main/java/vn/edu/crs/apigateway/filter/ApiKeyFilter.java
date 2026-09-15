package vn.edu.crs.apigateway.filter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class ApiKeyFilter implements GlobalFilter, Ordered {

    @Value("${partner.api-key}")
    private String partnerApiKey;

    @Override
    public Mono<Void> filter(
            ServerWebExchange exchange,
            GatewayFilterChain chain) {

        String path = exchange.getRequest()
                .getURI()
                .getPath();

        // Chỉ kiểm tra API public courses
        if (!path.equals("/api/public/courses")) {
            return chain.filter(exchange);
        }

        String apiKey = exchange.getRequest()
                .getHeaders()
                .getFirst("X-API-KEY");

        // Không có API Key
        if (apiKey == null || apiKey.isBlank()) {
            return forbidden(exchange, "Thieu X-API-KEY");
        }

        // API Key sai
        if (!partnerApiKey.equals(apiKey)) {
            return forbidden(exchange, "X-API-KEY khong hop le");
        }

        return chain.filter(exchange);
    }

    private Mono<Void> forbidden(
            ServerWebExchange exchange,
            String message) {

        exchange.getResponse()
                .setStatusCode(HttpStatus.FORBIDDEN);

        exchange.getResponse()
                .getHeaders()
                .add("Content-Type", "application/json");

        String body = "{\"message\":\"" + message + "\"}";

        byte[] bytes = body.getBytes();

        return exchange.getResponse()
                .writeWith(
                        Mono.just(
                                exchange.getResponse()
                                        .bufferFactory()
                                        .wrap(bytes)
                        )
                );
    }

    @Override
    public int getOrder() {
        return -90;
    }
}