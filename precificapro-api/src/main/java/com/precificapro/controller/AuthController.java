package com.precificapro.controller;

import com.precificapro.controller.dto.AuthResponseDTO;
import com.precificapro.controller.dto.LoginRequestDTO;
import com.precificapro.controller.dto.RefreshTokenRequestDTO;
import com.precificapro.controller.dto.RegisterRequestDTO;
import com.precificapro.domain.model.RefreshToken;
import com.precificapro.domain.model.User;
import com.precificapro.security.JwtTokenProvider;
import com.precificapro.service.AuthService;
import com.precificapro.service.RefreshTokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.email(),
                        loginRequest.password()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        User user = (User) authentication.getPrincipal();
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        
        return ResponseEntity.ok(new AuthResponseDTO(jwt, refreshToken.getToken()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDTO> refreshToken(@RequestBody RefreshTokenRequestDTO request) {
        String requestRefreshToken = request.refreshToken();
        
        RefreshToken refreshToken = refreshTokenService.findByToken(requestRefreshToken);
        refreshTokenService.verifyExpiration(refreshToken);
        
        User user = refreshToken.getUser();
        String newAccessToken = tokenProvider.generateTokenFromUser(user);
        
        return ResponseEntity.ok(new AuthResponseDTO(newAccessToken, requestRefreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody RefreshTokenRequestDTO request) {
        refreshTokenService.revokeToken(request.refreshToken());
        return ResponseEntity.ok().body("Logout realizado com sucesso");
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        authService.registerUser(registerRequest);
        return new ResponseEntity<>("Usuário registrado com sucesso!", HttpStatus.CREATED);
    }
}