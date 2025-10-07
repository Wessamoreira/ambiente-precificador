package com.precificapro.service;

import com.precificapro.controller.dto.RegisterRequestDTO;
import com.precificapro.domain.enums.Role;
import com.precificapro.domain.model.User;
import com.precificapro.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditLogService auditLogService;

    @Transactional
    public User registerUser(RegisterRequestDTO registerRequest) {
        if (userRepository.findByEmail(registerRequest.email()).isPresent()) {
            throw new com.precificapro.exception.ResourceAlreadyExistsException("Email já está em uso!");
        }

        // Validar força da senha
        validatePasswordStrength(registerRequest.password());

        User newUser = User.builder()
                .name(registerRequest.name())
                .email(registerRequest.email())
                .password(passwordEncoder.encode(registerRequest.password()))
                .roles(Set.of(Role.USER))
                .enabled(true)
                .accountNonLocked(true)
                .failedLoginAttempts(0)
                .build();
        
        User savedUser = userRepository.save(newUser);
        
        // Auditoria
        auditLogService.logAction(savedUser, "USER_REGISTERED", "User", savedUser.getId().toString(), 
            "Novo usuário registrado: " + savedUser.getEmail());
        
        return savedUser;
    }

    private void validatePasswordStrength(String password) {
        if (password == null || password.length() < 8) {
            throw new com.precificapro.exception.BusinessException("A senha deve ter no mínimo 8 caracteres");
        }
        
        boolean hasUpperCase = password.chars().anyMatch(Character::isUpperCase);
        boolean hasLowerCase = password.chars().anyMatch(Character::isLowerCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        boolean hasSpecialChar = password.chars().anyMatch(ch -> "!@#$%^&*()_+-=[]{}|;:,.<>?".indexOf(ch) >= 0);

        if (!hasUpperCase || !hasLowerCase || !hasDigit || !hasSpecialChar) {
            throw new com.precificapro.exception.BusinessException(
                "A senha deve conter pelo menos: 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial"
            );
        }
    }
}