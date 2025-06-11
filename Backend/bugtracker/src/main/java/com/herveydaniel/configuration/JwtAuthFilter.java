package com.herveydaniel.configuration;

import com.herveydaniel.model.Users;
import com.herveydaniel.repository.UsersRepository;
import com.herveydaniel.service.CustomUserDetailsService;
import com.herveydaniel.service.JwtServiceImpl;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtServiceImpl jwtServiceImpl;

    @Autowired
    ApplicationContext applicationContext;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //Getting the header from the request object sent from the client
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String userName = null;

        //Checking to see if the authorization header is not null and starts with "Bearer".
        if(authHeader != null && authHeader.startsWith("Bearer ")) {
            //String[] authElements = authHeader.split(" "); SWAP THIS IN LATER AND SEE IF IT WORKS
            token = authHeader.substring(7);
            userName = jwtServiceImpl.extractUserName(token);
        }

        //If the username is present and the authentication object is null (aka user not authenticated yet) then
        //validate token.
        if(userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = applicationContext.getBean(CustomUserDetailsService.class).loadUserByUsername(userName);
//            Claims claims = jwtServiceImpl.extractAllClaims(token);
//            List<SimpleGrantedAuthority> role = (List<SimpleGrantedAuthority>) claims.get("roles");

            //Putting the authToken into the Security Context.
            if(jwtServiceImpl.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
