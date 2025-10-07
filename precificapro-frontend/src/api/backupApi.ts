import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface BackupDTO {
  id: number;
  filename: string;
  fileSize: number;
  fileSizeFormatted: string;
  createdAt: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'RESTORED';
  type: 'AUTOMATIC' | 'MANUAL';
  createdByUsername?: string;
  restoredAt?: string;
  errorMessage?: string;
}

export interface BackupResponseDTO {
  success: boolean;
  message: string;
  backup?: BackupDTO;
}

export interface BackupStatusDTO {
  enabled: boolean;
  message: string;
  googleDriveBackups: number;
  backupFiles: string[];
}

// API de Backup
export const backupApi = {
  // Criar backup manual
  createBackup: async (token: string): Promise<BackupResponseDTO> => {
    const response = await axios.post(
      `${API_BASE_URL}/backups/create`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // Listar todos os backups
  listBackups: async (token: string): Promise<BackupDTO[]> => {
    const response = await axios.get(`${API_BASE_URL}/backups`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Restaurar backup
  restoreBackup: async (backupId: number, token: string): Promise<BackupResponseDTO> => {
    const response = await axios.post(
      `${API_BASE_URL}/backups/${backupId}/restore`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // Verificar status do serviço
  getStatus: async (token: string): Promise<BackupStatusDTO> => {
    const response = await axios.get(`${API_BASE_URL}/backups/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Limpar backups antigos
  cleanupOldBackups: async (token: string): Promise<BackupResponseDTO> => {
    const response = await axios.delete(`${API_BASE_URL}/backups/cleanup`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
