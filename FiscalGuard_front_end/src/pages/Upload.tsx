import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, FileCheck, X, CheckCircle, AlertCircle } from 'lucide-react';
import { apiClient } from '../api/client';
import { useGlobalContext } from '../context/GlobalContext';

interface UploadedFile {
  id: string;
  name: string;
  timestamp: Date;
  status: 'success' | 'error' | 'pending';
  data?: {
    numero_nota: number;
    empresa_emitente: string;
    valor_total: number;
    total_itens_processados: number;
  };
  error?: string;
}

export const Upload: React.FC = () => {
  const { selectedCompanyId } = useGlobalContext();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles) {
      handleFiles(droppedFiles);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const filesToUpload: UploadedFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.name.endsWith('.xml')) {
        filesToUpload.push({
          id: `${Date.now()}-${i}`,
          name: file.name,
          timestamp: new Date(),
          status: 'pending',
        });
      }
    }

    setFiles((prev) => [...filesToUpload, ...prev]);
    uploadFiles(fileList, filesToUpload);
  };

  const uploadFiles = async (fileList: FileList, uploadedFiles: UploadedFile[]) => {
    setUploading(true);

    let uploadCount = 0;
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!file.name.endsWith('.xml')) continue;

      const uploadedFile = uploadedFiles[uploadCount];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await apiClient.post('/api/v1/notas/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadedFile.id
              ? {
                  ...f,
                  status: 'success',
                  data: response.data.dados,
                }
              : f
          )
        );
      } catch (error) {
        console.error('Erro ao fazer upload:', error);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadedFile.id
              ? {
                  ...f,
                  status: 'error',
                  error: 'Falha ao processar arquivo',
                }
              : f
          )
        );
      }

      uploadCount++;
    }

    setUploading(false);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="pt-24 pb-8 px-6 max-w-7xl mx-auto space-y-8">
      {/* DRAG & DROP ZONE */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
          dragActive
            ? 'border-[#8B5CF6] bg-[#8B5CF6]/10'
            : 'border-[#1E1E2E] hover:border-[#8B5CF6]/50 bg-[#12121A]/50'
        }`}
      >
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer"
        >
          <UploadIcon className="mx-auto mb-4 text-[#8B5CF6]" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">Arraste arquivos XML aqui</h3>
          <p className="text-gray-400 mb-4">ou clique para selecionar múltiplos arquivos</p>
          <button className="px-6 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg font-medium transition-colors">
            Selecionar Arquivos
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".xml"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      </div>

      {/* UPLOAD HISTORY */}
      {files.length > 0 && (
        <div className="bg-[#12121A] border border-[#1E1E2E] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1E1E2E] bg-[#0B0B0F]">
            <h3 className="font-bold text-white flex items-center gap-2">
              <FileCheck size={20} className="text-[#8B5CF6]" />
              Histórico de Ingestões ({files.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1E1E2E] bg-[#0B0B0F]/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Arquivo</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Data/Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Nota Fiscal</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Valor Total</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Itens</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Ação</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id} className="border-b border-[#1E1E2E] hover:bg-[#8B5CF6]/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-300 font-mono">{file.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {file.timestamp.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {file.data?.numero_nota ? `NF ${file.data.numero_nota}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {file.data?.valor_total
                        ? `R$ ${file.data.valor_total.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {file.data?.total_itens_processados || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {file.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-600/30 text-gray-300 rounded-full text-xs font-medium">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-300"></div>
                          Processando
                        </span>
                      )}
                      {file.status === 'success' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#10B981]/30 text-[#10B981] rounded-full text-xs font-medium">
                          <CheckCircle size={14} />
                          Sucesso
                        </span>
                      )}
                      {file.status === 'error' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600/30 text-red-300 rounded-full text-xs font-medium">
                          <AlertCircle size={14} />
                          Erro
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {uploading && (
        <div className="flex items-center justify-center gap-3 p-4 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-lg">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#8B5CF6]"></div>
          <span className="text-[#8B5CF6]">Processando arquivos...</span>
        </div>
      )}
    </div>
  );
};

export default Upload;
