
import React, { useRef } from 'react';
import { X } from 'lucide-react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  fileDescription: string;
  setFileDescription: (description: string) => void;
  onConfirmUpload: () => void;
  isUploading: boolean;
  language: Language;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  selectedFile,
  setSelectedFile,
  fileDescription,
  setFileDescription,
  onConfirmUpload,
  isUploading,
  language
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'npz', 'nii', 'gz'];
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !allowedExtensions.includes(extension)) {
        // File type validation will be handled by parent component
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedFile(null);
    setFileDescription('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold mb-4">
            {getText(translations.uploadFile, language)}
          </h3>
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".jpg,.jpeg,.png,.webp,.npz,.nii,.gz"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full mb-4 p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
        >
          {selectedFile ? (
            <span className="text-blue-600">{selectedFile.name}</span>
          ) : (
            getText(translations.selectFile, language)
          )}
        </button>

        <input
          type="text"
          placeholder={getText(translations.fileDescription, language)}
          value={fileDescription}
          onChange={(e) => setFileDescription(e.target.value)}
          className="w-full mb-4 p-2 border rounded-lg"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {getText(translations.cancel, language)}
          </button>
          <button
            onClick={onConfirmUpload}
            disabled={isUploading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                {getText(translations.uploading, language)}
              </span>
            ) : (
              getText(translations.confirm, language)
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
