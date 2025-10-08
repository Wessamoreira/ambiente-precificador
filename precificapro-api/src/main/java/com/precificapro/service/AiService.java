package com.precificapro.service;

import com.precificapro.domain.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class AiService {

    private final RestTemplate restTemplate;
    private final String geminiApiKey;

    @Autowired
    private DashboardService dashboardService;

    public AiService(@Value("${gemini.api.key}") String geminiApiKey) {
        this.restTemplate = new RestTemplate();
        this.geminiApiKey = geminiApiKey;
    }

    public String askGemini(String question, User owner) {
        if (geminiApiKey == null || geminiApiKey.isEmpty()) {
            return "Chatbot não configurado. Por favor, configure a GEMINI_API_KEY.";
        }

        try {
            var metrics = dashboardService.getMetrics(owner);
            
            String context = String.format(
                "Dados do negócio: Faturamento: R$%.2f, Lucro: R$%.2f, Produtos: %d, Clientes: %d.",
                metrics.totalRevenue(), metrics.totalNetProfit(), metrics.productCount(), metrics.customerCount()
            );

            String prompt = "Você é o PrecificaPro, assistente financeiro especializado em pequenos negócios. " +
                           "Seja breve, amigável e prático. " + context + " Pergunta: " + question;

            // Request body no formato correto do Gemini API
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            // Usando gemini-2.5-flash - modelo estável e moderno
            String url = String.format(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=%s",
                geminiApiKey
            );

            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> body = (Map<String, Object>) response.getBody();
                return extractTextFromResponse(body);
            } else {
                log.error("Gemini API retornou status: {}", response.getStatusCode());
                return "Erro ao processar sua pergunta. Tente novamente.";
            }

        } catch (Exception e) {
            log.error("Erro ao comunicar com Gemini API: {}", e.getMessage(), e);
            return "Desculpe, não consegui processar sua pergunta. Verifique se a API Key do Gemini está configurada corretamente.";
        }
    }

    @SuppressWarnings("unchecked")
    private String extractTextFromResponse(Map<String, Object> responseBody) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                return "Não recebi uma resposta válida da IA.";
            }
            
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            
            if (parts == null || parts.isEmpty()) {
                return "Resposta da IA está vazia.";
            }
            
            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            log.error("Erro ao extrair texto da resposta: {}", e.getMessage());
            return "Erro ao processar a resposta da IA.";
        }
    }
}