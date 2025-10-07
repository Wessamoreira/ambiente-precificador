import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Database
} from 'lucide-react';
import { backupApi, BackupDTO } from '../api/backupApi';

const BackupManager: React.FC = () => {
  const [backups, setBackups] = useState<BackupDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Obter token do localStorage (ajuste conforme sua implementação de auth)
  const getToken = () => localStorage.getItem('token') || '';

  // Carregar backups
  const loadBackups = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await backupApi.listBackups(getToken());
      setBackups(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar backups');
    } finally {
      setLoading(false);
    }
  };

  // Verificar status
  const loadStatus = async () => {
    try {
      const data = await backupApi.getStatus(getToken());
      setStatus(data);
    } catch (err) {
      console.error('Erro ao verificar status:', err);
    }
  };

  // Criar backup manual
  const handleCreateBackup = async () => {
    if (!window.confirm('Deseja criar um backup manual agora?')) return;

    try {
      setCreating(true);
      setError(null);
      const response = await backupApi.createBackup(getToken());
      
      if (response.success) {
        alert('✅ Backup criado com sucesso!');
        loadBackups();
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar backup');
    } finally {
      setCreating(false);
    }
  };

  // Restaurar backup
  const handleRestore = async (backup: BackupDTO) => {
    const confirm = window.confirm(
      `⚠️ ATENÇÃO: Restaurar este backup irá SOBRESCREVER todos os dados atuais do banco!\n\n` +
      `Backup: ${backup.filename}\n` +
      `Data: ${new Date(backup.createdAt).toLocaleString()}\n\n` +
      `Deseja continuar?`
    );

    if (!confirm) return;

    try {
      setLoading(true);
      const response = await backupApi.restoreBackup(backup.id, getToken());
      
      if (response.success) {
        alert('✅ Backup restaurado com sucesso!\n\nPor favor, recarregue a página.');
        window.location.reload();
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao restaurar backup');
    } finally {
      setLoading(false);
    }
  };

  // Limpar backups antigos
  const handleCleanup = async () => {
    if (!window.confirm('Remover backups com mais de 30 dias?')) return;

    try {
      setLoading(true);
      const response = await backupApi.cleanupOldBackups(getToken());
      
      if (response.success) {
        alert('✅ Backups antigos removidos!');
        loadBackups();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao limpar backups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBackups();
    loadStatus();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600';
      case 'IN_PROGRESS': return 'text-blue-600';
      case 'FAILED': return 'text-red-600';
      case 'RESTORED': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-5 h-5" />;
      case 'IN_PROGRESS': return <Clock className="w-5 h-5 animate-spin" />;
      case 'FAILED': return <AlertCircle className="w-5 h-5" />;
      case 'RESTORED': return <Upload className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Database className="w-8 h-8" />
          Gerenciamento de Backups
        </h1>
        <p className="text-gray-600 mt-2">
          Backups automáticos e restauração do banco de dados
        </p>
      </div>

      {/* Status Card */}
      {status && (
        <div className={`mb-6 p-4 rounded-lg ${status.enabled ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Status do Serviço</h3>
              <p className="text-sm text-gray-600">{status.message}</p>
              {status.enabled && (
                <p className="text-sm text-gray-500 mt-1">
                  📁 {status.googleDriveBackups} arquivo(s) no Google Drive
                </p>
              )}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${status.enabled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {status.enabled ? '✅ Ativo' : '⚠️ Não Configurado'}
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Erro</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={handleCreateBackup}
          disabled={creating || !status?.enabled}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-5 h-5" />
          {creating ? 'Criando Backup...' : 'Criar Backup Manual'}
        </button>

        <button
          onClick={loadBackups}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>

        <button
          onClick={handleCleanup}
          disabled={loading || !status?.enabled}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          Limpar Antigos
        </button>
      </div>

      {/* Backups List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Arquivo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tamanho
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data/Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && backups.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                  Carregando backups...
                </td>
              </tr>
            ) : backups.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Nenhum backup encontrado
                </td>
              </tr>
            ) : (
              backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center gap-2 ${getStatusColor(backup.status)}`}>
                      {getStatusIcon(backup.status)}
                      <span className="text-sm font-medium">{backup.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {backup.filename}
                    </div>
                    {backup.createdByUsername && (
                      <div className="text-xs text-gray-500">
                        Por: {backup.createdByUsername}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {backup.fileSizeFormatted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(backup.createdAt).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      backup.type === 'AUTOMATIC' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {backup.type === 'AUTOMATIC' ? '🤖 Automático' : '👤 Manual'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {backup.status === 'COMPLETED' && (
                      <button
                        onClick={() => handleRestore(backup)}
                        disabled={loading}
                        className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Restaurar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info Footer */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Informações</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Backups automáticos ocorrem todo dia às 3:00 AM</li>
          <li>• Backups são armazenados no Google Drive (15GB gratuitos)</li>
          <li>• Backups antigos (30+ dias) são removidos automaticamente</li>
          <li>• Restaurar um backup sobrescreve todos os dados atuais</li>
        </ul>
      </div>
    </div>
  );
};

export default BackupManager;
