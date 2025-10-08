package com.precificapro.controller;

import com.precificapro.domain.model.User;
import com.precificapro.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> ask(
            @RequestBody AiRequest request,
            @AuthenticationPrincipal User owner
    ) {
        String response = aiService.askGemini(request.question(), owner);
        return ResponseEntity.ok(Map.of("answer", response));
    }

    record AiRequest(String question) {}
}