package com.mes.gotogether.security.config;

import com.mes.gotogether.security.jwt.JWTReactiveAuthenticationManager;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class SecurityContextRepository implements ServerSecurityContextRepository {

    private final JWTReactiveAuthenticationManager JWTReactiveAuthenticationManager;

    public SecurityContextRepository(JWTReactiveAuthenticationManager JWTReactiveAuthenticationManager) {
        this.JWTReactiveAuthenticationManager = JWTReactiveAuthenticationManager;
    }

    @Override
    public Mono<Void> save(ServerWebExchange swe, SecurityContext sc) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public Mono<SecurityContext> load(ServerWebExchange swe) {

        System.out.println("Load security context Server Exchange load");
        ServerHttpRequest request = swe.getRequest();
        System.out.println("Request is:" + request.getHeaders());
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        System.out.println("Auth header: " + authHeader);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String authToken = authHeader.substring(7);
            Authentication auth = new UsernamePasswordAuthenticationToken(authToken, authToken);

            System.out.println("Auth is set: " + auth);
            return this.JWTReactiveAuthenticationManager.authenticate(auth).map((authentication) -> {
                System.out.println("Calling authenticate method");
                SecurityContextImpl scImpl =  new SecurityContextImpl(authentication);
                System.out.println("In auth manager map: " + scImpl);
                return scImpl;
            });
        } else {
            System.out.println("********WRONG SECURITY IS MISSED*********8");
            return Mono.empty();
        }
    }


}