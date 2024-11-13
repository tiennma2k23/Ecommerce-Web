package com.backend.ecommerce.controller;


import com.backend.ecommerce.service.EmailService;
import com.backend.ecommerce.model.User;
import com.backend.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private EmailService mailService;
    @GetMapping
    public  ResponseEntity<User> getUserDetailsById(@RequestParam Integer id) {
        Optional<User> user= userService.findByUserId(id);
        return ResponseEntity.ok(user.get());
    }





}
