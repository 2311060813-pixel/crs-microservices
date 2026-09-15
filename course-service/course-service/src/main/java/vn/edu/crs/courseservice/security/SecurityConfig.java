package vn.edu.crs.courseservice.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                // Không dùng CSRF vì API REST
                .csrf(csrf -> csrf.disable())

                // JWT là stateless
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // API nội bộ cho registration-service
                        .requestMatchers("/internal/**")
                        .permitAll()

                        // GET khóa học: công khai
                        .requestMatchers(
                                HttpMethod.GET,
                                "/courses",
                                "/courses/**"
                        )
                        .permitAll()

                        // Chỉ ADMIN được tạo khóa học
                        .requestMatchers(
                                HttpMethod.POST,
                                "/courses",
                                "/courses/**"
                        )
                        .hasRole("ADMIN")

                        // Chỉ ADMIN được sửa khóa học
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/courses",
                                "/courses/**"
                        )
                        .hasRole("ADMIN")

                        // Chỉ ADMIN được xóa khóa học
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/courses",
                                "/courses/**"
                        )
                        .hasRole("ADMIN")

                        // Các request khác phải đăng nhập
                        .anyRequest()
                        .authenticated()
                )

                // Kiểm tra JWT trước UsernamePasswordAuthenticationFilter
                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}