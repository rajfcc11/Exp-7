package com.scamguard.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Public routes
        if (path.startsWith("/api/public") ||
            path.startsWith("/api/signup") ||
            path.startsWith("/api/login") ||
            path.startsWith("/api/detect-scam") ||
            path.startsWith("/api/detect-url") ||
            path.startsWith("/api/save-scan") ||
            path.startsWith("/api/history") ||
            path.startsWith("/api/report-scam") ||
            path.startsWith("/api/reports") ||
            path.equals("/") ||
            path.startsWith("/h2-console")) {

            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Missing or invalid Authorization header");
            return;
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.isTokenValid(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid or expired token");
            return;
        }

        String email = jwtUtil.extractUsername(token);
String role = jwtUtil.extractRole(token);

if (email != null && role != null && SecurityContextHolder.getContext().getAuthentication() == null) {
    String cleanRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;

    UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(
                    email,
                    null,
                    List.of(new SimpleGrantedAuthority(cleanRole))
            );

    SecurityContextHolder.getContext().setAuthentication(authentication);
}

        filterChain.doFilter(request, response);
    }
}