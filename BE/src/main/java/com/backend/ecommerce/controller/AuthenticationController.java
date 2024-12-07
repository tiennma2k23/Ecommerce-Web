package com.backend.ecommerce.controller;


import com.backend.ecommerce.dto.Request.AuthenticationRequest;
import com.backend.ecommerce.dto.Request.RegisterRequest;
import com.backend.ecommerce.dto.Response.AuthenticationResponse;
import com.backend.ecommerce.model.Cart;
import com.backend.ecommerce.model.User;
import com.backend.ecommerce.repository.UserRepository;
import com.backend.ecommerce.service.AuthenticationService;

import com.backend.ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor

public class AuthenticationController {

    @Autowired
    private UserRepository userRepository;
    private final AuthenticationService authenticationService;
    @Autowired
    private CartService cartService;



    @PostMapping("/sign-up")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) throws MessagingException {
        String message = authenticationService.registerUser(request);
        return ResponseEntity.ok(message);
    }



    @PostMapping("/sign-in")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String verificationToken) {
        Optional<User> optionalUser = userRepository.findByLink(verificationToken);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.badRequest().body("Invalid verification token");
        }

        User user = optionalUser.get();
        user.setStatus(true);
        user.setVerificationToken(null);

        // Tạo giỏ hàng mặc định
        Cart defaultCart = cartService.createCart(user.getId());
        user.setCartIdDefault(defaultCart.getId()); // Lưu ID giỏ hàng mặc định

        userRepository.save(user);

        return ResponseEntity.ok("Your email has been verified. A default cart has been created.");
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Invalid token format");
        }

        String token = authorizationHeader.substring(7); // Lấy token sau "Bearer "
        authenticationService.logout(token);
        return ResponseEntity.ok("User has been logged out successfully.");
    }

    @GetMapping("/validate-token")
    public ResponseEntity<Boolean> validateToken(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(false); // Trả về false nếu header không hợp lệ
        }

        String token = authorizationHeader.substring(7); // Lấy token sau "Bearer "
        try {
            boolean isValid = authenticationService.isTokenValid(token);
            return ResponseEntity.ok(isValid);
        }
        catch (Exception ex){
            return ResponseEntity.ok(false);
        }

    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Invalid token format");
        }

        String token = authorizationHeader.substring(7); // Lấy token sau "Bearer "
        authenticationService.logout(token);
        return ResponseEntity.ok("User has been logged out successfully.");
    }



}
