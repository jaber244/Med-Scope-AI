import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
  onImageSelected: (base64: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ onImageSelected, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      setError(null);
      // Pass base64 string to parent (remove data URL prefix if needed by backend, but schema seems to just ask for string)
      onImageSelected(result); 
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled
  });

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelected("");
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer
              flex flex-col items-center justify-center text-center gap-4 group
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
              ${error ? 'border-destructive/50 bg-destructive/5' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-200">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {isDragActive ? "Drop the image here" : "Click or drag image to upload"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports JPG, PNG, WEBP
              </p>
            </div>
            {error && (
              <p className="text-sm text-destructive font-medium mt-2">{error}</p>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-xl overflow-hidden border border-border shadow-md group"
          >
            <img src={preview} alt="Upload preview" className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={clearImage}
                className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
                disabled={disabled}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
