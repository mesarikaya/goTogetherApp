package com.mes.gotogether.security.config;

import com.mes.gotogether.domains.Role;
import com.mes.gotogether.security.jwt.JWTReactiveAuthenticationManager;
import com.mes.gotogether.services.domain.AddressService;
import com.mes.gotogether.services.domain.UserService;
import java.net.URI;
import java.util.Collections;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.actuate.autoconfigure.security.reactive.EndpointRequest;
import org.springframework.boot.autoconfigure.security.reactive.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.logout.RedirectServerLogoutSuccessHandler;
import org.springframework.security.web.server.authentication.logout.ServerLogoutSuccessHandler;
import org.springframework.security.web.server.csrf.ServerCsrfTokenRepository;
import org.springframework.security.web.server.csrf.WebSessionServerCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import reactor.core.publisher.Mono;

@Slf4j
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class AppSecurityConfig {

    private com.mes.gotogether.security.jwt.JWTReactiveAuthenticationManager JWTReactiveAuthenticationManager;
    private SecurityContextRepository securityContextRepository;
    private UserService userService;
    private AddressService addressService;

    public AppSecurityConfig(JWTReactiveAuthenticationManager JWTReactiveAuthenticationManager, SecurityContextRepository securityContextRepository,
                             UserService userService, AddressService addressService) {
        this.JWTReactiveAuthenticationManager = JWTReactiveAuthenticationManager;
        this.securityContextRepository = securityContextRepository;
        this.userService = userService;
        this.addressService = addressService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {

        http
            .exceptionHandling()
            .authenticationEntryPoint((swe, e) -> {
                    return Mono.fromRunnable(() -> {
                        swe.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                });
            })
            .accessDeniedHandler((swe, e) -> {
            return Mono.fromRunnable(() -> {
                swe.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
            });
            }).and()
            .cors()
            .and()
            .csrf().disable()
                //.csrfTokenRepository(csrfTokenRepository())
                //.and()
            .authorizeExchange()
            .and()
            .httpBasic().disable()
            .formLogin().disable()
            .authenticationManager(JWTReactiveAuthenticationManager)
            .securityContextRepository(securityContextRepository)
            .authorizeExchange()
            .matchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
            .matchers(EndpointRequest.to("health")).permitAll()
            .matchers(EndpointRequest.to("info")).permitAll()
            .matchers(EndpointRequest.toAnyEndpoint()).hasRole(Role.ADMIN.name())
            //.pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .pathMatchers(HttpMethod.POST, "/api/v1/users**").hasRole(Role.ADMIN.name())
            .pathMatchers(HttpMethod.DELETE, "/api/v1/users**").hasRole(Role.ADMIN.name())
            .pathMatchers("/login**").permitAll()
            .pathMatchers("/auth**").permitAll()
            .pathMatchers("/api/auth/login**").permitAll()
            .pathMatchers("/api/auth/register**").permitAll()
            .pathMatchers("/api/auth/verify**").permitAll()
            .pathMatchers("/api/v1/groups**").permitAll()
            .anyExchange().authenticated()
            .and();


        /*
        http
            .csrf()
                .disable()
                //.csrfTokenRepository(csrfTokenRepository())
                //.and()
            .authorizeExchange()
            .matchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
            .matchers(EndpointRequest.to("health")).permitAll()
            .matchers(EndpointRequest.to("info")).permitAll()
            .matchers(EndpointRequest.toAnyEndpoint()).hasRole(Role.ADMIN.name())
            .pathMatchers(HttpMethod.POST, "/api/v1/users**").hasRole(Role.ADMIN.name())
            .pathMatchers(HttpMethod.DELETE, "/api/v1/users**").hasRole(Role.ADMIN.name())
            .pathMatchers("/login**").permitAll()
            .anyExchange().authenticated()
            .and()
            .httpBasic().and()
                .formLogin().loginPage("/login")
                .authenticationSuccessHandler(
                        new RedirectServerAuthenticationSuccessHandler("/user")
                )
                .and()
            .logout()
                .logoutUrl("/logout")
                .logoutSuccessHandler(logoutSuccessHandler("/bye"));
         */

        return http.build();
    }

    @Bean 
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "DELETE", "OPTIONS", "PUT"));
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
 
    public ServerCsrfTokenRepository csrfTokenRepository() {

        WebSessionServerCsrfTokenRepository repository =
                new WebSessionServerCsrfTokenRepository();
        repository.setHeaderName("X-CSRF-TK");

        return repository;
    }


/*
    public WebClient webClient(ReactiveClientRegistrationRepository clientRegistrationRepository,
                        ServerOAuth2AuthorizedClientRepository authorizedClientRepository) {
        ServerOAuth2AuthorizedClientExchangeFilterFunction oauth =
                new ServerOAuth2AuthorizedClientExchangeFilterFunction(clientRegistrationRepository,
                        authorizedClientRepository);
        oauth.setDefaultClientRegistrationId("google");
        return WebClient.builder()
                .filter(oauth)
                .build();
    }*/

    public ServerLogoutSuccessHandler logoutSuccessHandler(String uri) {
        RedirectServerLogoutSuccessHandler successHandler = new RedirectServerLogoutSuccessHandler();
        successHandler.setLogoutSuccessUrl(URI.create(uri));
        return successHandler;
    }
}
