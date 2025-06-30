package com.herveydaniel.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import java.util.Arrays;
import java.util.List;

import static com.herveydaniel.model.Role.ADMIN;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.PUT;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfiguration {

//    @Autowired
//    private UserDetailsServiceImpl userDetailsServiceImpl;

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(Arrays.asList("*"));
        corsConfiguration.setAllowedMethods(Arrays.asList("*"));
        corsConfiguration.setAllowedHeaders(Arrays.asList("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        CorsConfiguration corsConfiguration = new CorsConfiguration();
//        corsConfiguration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
//        corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173/"));
//        corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//        corsConfiguration.setAllowCredentials(true);
//        corsConfiguration.setExposedHeaders(List.of("Authorization"));
        return http
                .cors(c -> c.configurationSource(corsConfigurationSource()))
                .csrf((csrf) -> csrf.disable())
                .authorizeHttpRequests((request) -> request
                                .requestMatchers("/login", "/demoadmin" ).permitAll()
                                .requestMatchers("/api/admin/**").hasRole("ADMIN")//use .hasAnyRole for multiple roles in argument.
//                        request.requestMatchers(GET, "/api/admin/**").hasAnyAuthority(ADMIN_GET.name()) //use .hasAnyAuthority if you want multiple permissions in the parameters.
//                        request.requestMatchers(PUT, "/api/admin/**").hasAnyAuthority(ADMIN_POST.name())
                                .requestMatchers("/api/**").hasAnyRole("ADMIN", "USER")
                                .requestMatchers("/demo/api/admin/**").hasRole("DEMOADMIN")
                                .requestMatchers("/demo/api/**").hasAnyRole("DEMOADMIN", "DEMOUSER")
                    .anyRequest().authenticated()
                )
                .sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .httpBasic(Customizer.withDefaults()) //For use with Postman
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

//    @Bean
//    public AuthenticationProvider authenticationProvider() {
//        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
//        authProvider.setPasswordEncoder(new BCryptPasswordEncoder(10));
//        authProvider.setUserDetailsService(userDetailsServiceImpl);
//        return authProvider;
//    }

//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception{
//        return configuration.getAuthenticationManager();
//    }
}
