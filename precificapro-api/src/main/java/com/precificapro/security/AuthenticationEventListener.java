package com.precificapro.security;

import com.precificapro.domain.model.User;
import com.precificapro.domain.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class AuthenticationEventListener {

    @Autowired
    private UserRepository userRepository;

    @EventListener
    public void onAuthenticationSuccess(AuthenticationSuccessEvent event) {
        String username = event.getAuthentication().getName();
        
        userRepository.findByEmail(username).ifPresent(user -> {
            if (user.getFailedLoginAttempts() != null && user.getFailedLoginAttempts() > 0) {
                user.resetFailedLoginAttempts();
                userRepository.save(user);
                log.info("Login bem-sucedido para o usuário: {}. Tentativas falhadas resetadas.", username);
            }
        });
    }

    @EventListener
    public void onAuthenticationFailure(AuthenticationFailureBadCredentialsEvent event) {
        String username = event.getAuthentication().getName();
        
        userRepository.findByEmail(username).ifPresent(user -> {
            user.incrementFailedLoginAttempts();
            userRepository.save(user);
            
            if (!user.isAccountNonLocked()) {
                log.warn("Conta bloqueada após {} tentativas falhadas: {}", 
                    user.getFailedLoginAttempts(), username);
            } else {
                log.warn("Tentativa de login falhada para o usuário: {}. Total de tentativas: {}", 
                    username, user.getFailedLoginAttempts());
            }
        });
    }
}
