package com.backend.ecommerce.service;


import com.backend.ecommerce.dto.Request.AuthenticationRequest;
import com.backend.ecommerce.dto.Request.RegisterRequest;
import com.backend.ecommerce.dto.Response.AuthenticationResponse;
import com.backend.ecommerce.model.Role;
import com.backend.ecommerce.model.User;
import com.backend.ecommerce.repository.TokenRepository;
import com.backend.ecommerce.repository.UserRepository;
import com.backend.ecommerce.token.Token;
import com.backend.ecommerce.token.TokenType;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.validation.Valid;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final TokenRepository tokenRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired

    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired

    private EmailService emailService;
    @Autowired
    private CartService cartService;


    public String registerUser(RegisterRequest request) throws MessagingException {
        boolean userExists = userRepository.existsByEmail(request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with this email already exists.");
        }
        String verificationToken = UUID.randomUUID().toString();

        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .status(false)
                .link(verificationToken)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        var savedUser = userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), verificationToken);
        return "Verify you email";
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        if (user.getStatus() == false) {
            throw new RuntimeException("User Didn't verify");
        }
        cartService.getCart(user.getId());
        var jwtToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();

    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }


}
