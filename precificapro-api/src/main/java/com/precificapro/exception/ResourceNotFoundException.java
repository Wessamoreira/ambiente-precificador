package com.precificapro.exception;

import java.util.UUID;

public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String resource, UUID id) {
        super(String.format("%s com ID %s não encontrado", resource, id));
    }
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
