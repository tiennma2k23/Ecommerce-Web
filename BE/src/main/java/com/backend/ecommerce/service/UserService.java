package com.backend.ecommerce.service;


import com.backend.ecommerce.model.User;
import com.backend.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService mailService;

    public List<User> getAllUser() {
        return userRepository.findAll();
    }


    public void deleteUserById(Integer id) {
        userRepository.deleteById(id);
    }

    public Optional<User> findByUserId(Integer id) {
        return userRepository.findById(id);
    }
}

