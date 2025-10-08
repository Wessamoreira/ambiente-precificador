package com.precificapro.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * Configuração de cache usando Caffeine para melhorar performance
 * Cache em memória com expiração automática
 */
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(
            "dashboardMetrics",    // Cache para métricas do dashboard
            "products",            // Cache para lista de produtos
            "categories",          // Cache para categorias
            "customers",           // Cache para clientes
            "inventoryItems",      // Cache para itens de inventário
            "pricingProfiles"      // Cache para perfis de precificação
        );
        
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .expireAfterWrite(5, TimeUnit.MINUTES)  // Cache expira após 5 minutos
            .maximumSize(1000)                       // Máximo 1000 entradas por cache
            .recordStats());                         // Habilita estatísticas de cache
        
        return cacheManager;
    }
}
