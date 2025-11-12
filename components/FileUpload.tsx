
import React, { useState, useCallback, useRef } from 'react';
import DocumentIcon from './icons/DocumentIcon';
import UploadIcon from './icons/UploadIcon';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setFile(selectedFile);
      onFileChange(selectedFile);
    } else if (selectedFile) {
      alert('.docx 形式のファイルを選択してください。');
      setFile(null);
      onFileChange(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } else {
       setFile(null);
       onFileChange(null);
    }
  }, [onFileChange]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ease-in-out ${
        isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:border-slate-400'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".docx"
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        id="file-upload"
      />
      {file ? (
        <div className="flex flex-col items-center">
            <DocumentIcon className="w-12 h-12 text-indigo-500" />
            <p className="mt-2 text-sm font-medium text-slate-700 break-all">{file.name}</p>
            <p className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
            <button
                onClick={handleRemoveFile}
                className="mt-3 text-xs text-red-600 hover:text-red-800 font-semibold"
            >
                ファイルを削除
            </button>
        </div>
      ) : (
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
          <UploadIcon className="w-12 h-12 text-slate-400" />
          <p className="mt-2 text-sm text-slate-600">
            <span className="font-semibold text-indigo-600">クリックしてアップロード</span>
            <br/>またはドラッグ＆ドロップ
          </p>
          <p className="text-xs text-slate-500 mt-1">.docx のみ</p>
        </label>
      )}
    </div>
  );
};

export default FileUpload;
