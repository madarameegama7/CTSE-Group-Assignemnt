package com.medical.doctorservice.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable());

        http.authorizeHttpRequests(auth -> auth
                // Swagger open
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                // Public or authenticated doctor list (choose one)
                .requestMatchers("GET", "/api/doctors/**").permitAll()

                // ADMIN can add doctor
                .requestMatchers("POST", "/api/doctors").hasRole("ADMIN")

                // DOCTOR can add slots
                .requestMatchers("POST", "/api/doctors/*/slots").hasRole("DOCTOR")

                // Appointment service can reserve/check slot (authenticated)
                .requestMatchers("GET", "/api/doctors/*/slots/*").authenticated()
                .requestMatchers("PUT", "/api/doctors/*/slots/*/reserve").authenticated()

                // Everything else needs auth
                .anyRequest().authenticated()
        );

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}