-- V12: Create backup_metadata table for tracking database backups
CREATE TABLE IF NOT EXISTS backup_metadata (
    id BIGSERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    s3_key VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    error_message VARCHAR(1000),
    created_by_user_id UUID,
    type VARCHAR(50) NOT NULL,
    restored_at TIMESTAMP,
    
    CONSTRAINT fk_backup_created_by FOREIGN KEY (created_by_user_id) 
        REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_backup_status ON backup_metadata(status);
CREATE INDEX idx_backup_created_at ON backup_metadata(created_at DESC);
CREATE INDEX idx_backup_type ON backup_metadata(type);
CREATE INDEX idx_backup_created_by ON backup_metadata(created_by_user_id);

-- Add comments
COMMENT ON TABLE backup_metadata IS 'Metadados dos backups do sistema armazenados no Google Drive';
COMMENT ON COLUMN backup_metadata.filename IS 'Nome do arquivo de backup';
COMMENT ON COLUMN backup_metadata.s3_key IS 'ID do arquivo no Google Drive';
COMMENT ON COLUMN backup_metadata.file_size IS 'Tamanho do arquivo em bytes';
COMMENT ON COLUMN backup_metadata.status IS 'Status: IN_PROGRESS, COMPLETED, FAILED, RESTORED';
COMMENT ON COLUMN backup_metadata.type IS 'Tipo: AUTOMATIC ou MANUAL';
