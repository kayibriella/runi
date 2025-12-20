import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../../components/ui/Button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Upload as UploadIcon, CheckCircle, X, Loader2, FileText } from "lucide-react";

interface UploadProps {
  folderId: any;
  onUploadComplete?: () => void;
}

export function Upload({ folderId, onUploadComplete }: UploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createFile = useMutation(api.files.create);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    if (!folderId) {
      setError("No destination folder specified");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const postUrl = await generateUploadUrl();
      const uploadResponse = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      if (!uploadResponse.ok) throw new Error(`Upload failed: ${uploadResponse.statusText}`);

      const { storageId } = await uploadResponse.json();
      await createFile({
        storageId,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        folderId: folderId,
      });

      toast.success(`Successfully uploaded ${selectedFile.name}`);
      setSelectedFile(null);
      if (onUploadComplete) onUploadComplete();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-[2.5rem] border border-white/40 dark:border-white/10 p-8 shadow-xl overflow-hidden relative">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 font-display">
              <UploadIcon size={16} className="text-blue-500" />
              Select File to Upload
            </label>

            <motion.div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              animate={{
                borderColor: isDragging || isUploading ? "rgb(37, 99, 235)" : selectedFile ? "rgb(16, 185, 129)" : "rgba(229, 231, 235, 1)",
                backgroundColor: isDragging ? "rgba(37, 99, 235, 0.05)" : "transparent"
              }}
              className={`
                relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer text-center
                ${selectedFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-gray-200 dark:border-white/10 hover:border-blue-500/50 bg-white/50 dark:bg-black/20'}
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />

              {selectedFile ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-left">
                    <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-600">
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900 dark:text-white truncate max-w-[250px] font-display">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-emerald-600 font-medium font-sans">
                        {formatFileSize(selectedFile.size)} • Ready to upload
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="p-2 hover:bg-red-500/10 rounded-xl text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="space-y-3 py-4">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-2 text-blue-600 dark:text-blue-400">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-gray-900 dark:text-dark-text">Click or drag file here</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">PDF, Images, or Documents (Max 50MB)</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 text-sm font-medium"
            >
              <X size={18} />
              {error}
            </motion.div>
          )}

          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/20 group transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 size={24} className="animate-spin" />
                <span>Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <UploadIcon size={20} />
                <span>Upload to Cloud</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
