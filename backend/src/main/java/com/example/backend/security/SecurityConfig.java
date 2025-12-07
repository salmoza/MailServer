package com.example.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration("mySecurityConfig")
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // disable CSRF for REST API
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/user/signUp", "/user/signIn").permitAll() // public
                        .anyRequest().authenticated() // everything else secured
                );

        return http.build();
    }
}
