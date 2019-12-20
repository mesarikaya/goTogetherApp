package com.mes.gotogether.security.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.config.WebFluxConfigurer;

@Configuration
@EnableWebFlux
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsGlobalConfiguration implements WebFluxConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET, POST, DELETE, OPTIONS", "PUT")
                .allowedHeaders("X-PINGOTHER","Origin","X-Requested-With","X-HTTP-Method-Override", "Content-Type","Accept","X-Auth-Token")
                .allowCredentials(true)
                .exposedHeaders("Access-Control-Expose-Headers", "Authorization", "Cache-Control", 
                		"Content-Type", "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Origin",
                		"X-Requested-With","X-HTTP-Method-Override", "Content-Type","Accept")
                .maxAge(3600000);
    }

    
    /*@Override
    public void addCorsMappings(CorsRegistry corsRegistry) {
        corsRegistry.addMapping("/**")
                .allowedOrigins("http://localhost")
                .allowedMethods("POST, GET, HEAD, OPTIONS")
                .maxAge(3600);
    }*/
    //@Order(Ordered.HIGHEST_PRECEDENCE)
}
