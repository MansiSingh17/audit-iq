package com.auditiq.controller;

import com.auditiq.model.User;
import com.auditiq.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@Valid @RequestBody User user) {
        log.info("Registering new user: {}", user.getUsername());
        
        User createdUser = userService.createUser(user);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        log.info("Fetching user with ID: {}", id);
        
        User user = userService.getUserById(id);
        
        return ResponseEntity.ok(user);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        log.info("Fetching user with username: {}", username);
        
        User user = userService.getUserByUsername(username);
        
        return ResponseEntity.ok(user);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        log.info("Fetching user with email: {}", email);
        
        User user = userService.getUserByEmail(email);
        
        return ResponseEntity.ok(user);
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        log.info("Fetching all users");
        
        List<User> users = userService.getAllUsers();
        
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        log.info("Updating user with ID: {}", id);
        
        User updatedUser = userService.updateUser(id, user);
        
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        log.info("Deleting user with ID: {}", id);
        
        userService.deleteUser(id);
        
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<User> activateUser(@PathVariable Long id) {
        log.info("Activating user with ID: {}", id);
        
        User user = userService.activateUser(id);
        
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<User> deactivateUser(@PathVariable Long id) {
        log.info("Deactivating user with ID: {}", id);
        
        User user = userService.deactivateUser(id);
        
        return ResponseEntity.ok(user);
    }
}