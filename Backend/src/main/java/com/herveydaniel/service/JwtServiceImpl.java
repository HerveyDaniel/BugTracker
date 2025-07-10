package com.herveydaniel.service;

import com.herveydaniel.demomodel.DemoUsers;
import com.herveydaniel.demorepository.DemoUsersRepository;
import com.herveydaniel.model.Users;
import com.herveydaniel.repository.UsersRepository;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtServiceImpl {
    @Autowired
    ApplicationContext applicationContext;

    @Autowired
    private UsersRepository userRepo;

    @Autowired
    private DemoUsersRepository demoUsersRepository;

    private String secretKey = "";

    public JwtServiceImpl() {
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance("HmacSHA256");
            SecretKey secret = keyGenerator.generateKey();
            secretKey = Base64.getEncoder().encodeToString(secret.getEncoded());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public String generateToken(String username) {
        Date now = new Date(System.currentTimeMillis());
        Date validity = new Date(now.getTime() + 7200000);

        Optional<Users> user = userRepo.findByUsername(username);

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", user.get().getAuthorities());

        return Jwts.builder()
                .subject(username)
                .claims(claims)
                .issuedAt(now)
                .expiration(validity)
                .signWith(getKey())
                .compact();
    }

    public String generateDemoToken(String username) {
        Date now = new Date(System.currentTimeMillis());
        Date validity = new Date(now.getTime() + 7200000);

        Optional<DemoUsers> demoUsers = demoUsersRepository.findByUsername(username);

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", demoUsers.get().getAuthorities());

        return Jwts.builder()
                .subject(username)
                .claims(claims)
                .issuedAt(now)
                .expiration(validity)
                .signWith(getKey())
                .compact();
    }


    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUserName(String token) {
        // extract the username from jwt token
        return extractClaim(token, Claims::getSubject);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
