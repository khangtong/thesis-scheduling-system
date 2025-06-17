package com.example.back_end.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.back_end.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public JwtTokenProvider() {}

    public String generateToken(User user) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + jwtExpiration);

        try {
            Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
            String token = JWT.create()
                    .withSubject(user.getEmail())
                    .withIssuedAt(now)
                    .withExpiresAt(expirationDate)
                    .withIssuer("auth0")
                    .sign(algorithm);

            return token;
        } catch (JWTCreationException exception){
            // Invalid Signing configuration / Couldn't convert Claims.
            System.out.println(exception.getMessage());
        };

        return null;
    }

    public String getEmailFromJWT(String token) {
        return JWT.decode(token).getSubject();
    }

    public boolean verifyToken(String token) {
        DecodedJWT decodedJWT;

        try {
            Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
            JWTVerifier verifier = JWT.require(algorithm)
                    // specify any specific claim validations
                    .withIssuer("auth0")
                    // reusable verifier instance
                    .build();

            decodedJWT = verifier.verify(token);

            return true;
        } catch (JWTVerificationException exception){
            // Invalid signature/claims
            System.out.println(exception.getMessage());
        }

        return false;
    }
}
