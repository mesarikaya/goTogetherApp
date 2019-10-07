package com.mes.gotogether.security.jwt;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import com.mes.gotogether.domains.Role;
import com.mes.gotogether.security.service.SecurityUserLibraryUserDetailsService;

import io.jsonwebtoken.Claims;
import reactor.core.publisher.Mono;

@Component
public class JWTReactiveAuthenticationManager implements ReactiveAuthenticationManager {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final SecurityUserLibraryUserDetailsService securityUserDetailsService;
    private final JWTUtil jwtTokenUtil;
    private PasswordEncoder passwordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();

    public JWTReactiveAuthenticationManager(SecurityUserLibraryUserDetailsService securityUserDetailsService,
                                            JWTUtil jwtTokenUtil) {
        Assert.notNull(securityUserDetailsService, "userDetailsService cannot be null");
        Assert.notNull(jwtTokenUtil, "jwtTokenUtil cannot be null");
        System.out.println("***********IN AUTHENTICATION MANAGER*******************");
        this.securityUserDetailsService = securityUserDetailsService;
        this.jwtTokenUtil = jwtTokenUtil;
    }


    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        String authToken = authentication.getCredentials().toString();

        String username;
        try {
            username = jwtTokenUtil.getUsernameFromToken(authToken);
        } catch (Exception e) {
            username = null;
        }
        if (username != null && jwtTokenUtil.validateToken(authToken)) {

            Claims claims = jwtTokenUtil.getAllClaimsFromToken(authToken);
            List<String> rolesMap = claims.get("role", List.class);
            List<Role> roles = new ArrayList<>();
            for (String rolemap : rolesMap) {
                roles.add(Role.valueOf(rolemap));
            }

            System.out.println("HERE IN AUTHENTICATE*****: " + "- Roles: " + roles);
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    username,
                    null,
                    roles.stream().map(authority -> new SimpleGrantedAuthority("ROLE_"+authority.name()))
                            .collect(Collectors.toList())
            );

            System.out.println("Finalized auth: " + auth);
            return Mono.just(auth);
        } else {
            return Mono.empty();
        }
    }

    /*
    @Override
    public Mono<Authentication> authenticate(final Authentication authentication) {
        System.out.println("*************** IN AUTHENTICATE**********");

        if (authentication instanceof JwtPreAuthenticationToken) {

            System.out.println("**** INSIDE PREAUTH CASE ******");
            return Mono.just(authentication)
                    .switchIfEmpty(Mono.defer(this::raiseBadCredentials))
                    .cast(JwtPreAuthenticationToken.class)
                    .flatMap(this::authenticateToken)
                    .publishOn(Schedulers.parallel())
                    .onErrorResume(e -> raiseBadCredentials())
                    .map(u -> new JwtAuthenticationToken(u.getUsername(), u.getAuthorities()));
        }

        return Mono.just(authentication);
    }

    private <T> Mono<T> raiseBadCredentials() {
        return Mono.error(new BadCredentialsException("Invalid Credentials"));
    }

    private Mono<UserDetails> authenticateToken(final JwtPreAuthenticationToken jwtPreAuthenticationToken) {
        try {
            String authToken = jwtPreAuthenticationToken.getAuthToken();
            String username = jwtPreAuthenticationToken.getUsername();
            String bearerRequestHeader = jwtPreAuthenticationToken.getBearerRequestHeader();

            logger.info("checking authentication for user " + username);
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (jwtTokenUtil.validateToken(authToken)) {
                    logger.info("authenticated user " + username + ", setting security context");
                    final String token = authToken;
                    return this.securityUserDetailsService.findByUserId(username);
                }
            }
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid token...");
        }

        return null;
    }

    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        Assert.notNull(passwordEncoder, "passwordEncoder cannot be null");
        this.passwordEncoder = passwordEncoder;
    }*/
}
