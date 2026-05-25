import React, { useCallback, useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import api from '../api/client'
import type { UploadResponse } from '../api/types'

interface Props {
  onUploaded?: () => void
}

const UploadArea: React.FC<Props> = ({ onUploaded }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const onDrop = useCallback(async (file?: File) => {
    const f = file
    if (!f) return
    const form = new FormData()
    form.append('file', f)
    setProgress(0)
    try {
      const res = await api.post<UploadResponse>('/notas/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (ev) => {
          if (ev.total) setProgress(Math.round((ev.loaded / ev.total) * 100))
        }
      })
      alert(res.data.mensagem)
      setProgress(null)
      onUploaded && onUploaded()
    } catch (err: any) {
      console.error(err)
      alert('Erro ao enviar arquivo')
      setProgress(null)
    }
  }, [onUploaded])

  const handleFiles = (files?: FileList) => {
    if (!files || files.length === 0) return
    onDrop(files[0])
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={`p-6 rounded border-2 ${isDragging ? 'border-blue-400 bg-slate-800' : 'border-dashed border-slate-700 bg-slate-800'} cursor-pointer`}
        onClick={() => fileRef.current?.click()}
      >
        <div className="flex items-center gap-4">
          <UploadCloud />
          <div>
            <div className="text-sm text-slate-300">Arraste e solte arquivos XML aqui</div>
            <div className="text-xs text-slate-500">ou clique para selecionar</div>
          </div>
        </div>
        {progress !== null && (
          <div className="mt-4">
            <div className="h-2 bg-slate-700 rounded overflow-hidden">
              <div className="h-2 bg-blue-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-xs text-slate-400 mt-1">Enviando... {progress}%</div>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept=".xml" className="hidden" onChange={(e) => handleFiles(e.target.files ?? undefined)} />
    </div>
  )
}

export default UploadArea
