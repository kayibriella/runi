import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../../components/ui/Button";
import { toast } from "sonner";

interface FolderType {
  _id: string;
  folder_name: string;
  file_count: number;
  total_size: number;
  updated_at: number;
}

export function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch folders from Convex
  const folders = useQuery(api.folders.list) || [];
  
  // Mutations for file upload process
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createFile = useMutation(api.files.create);
  
  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError("");
    }
  };
  
  const handleFolderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFolderId(e.target.value);
    if (error && e.target.value) {
      setError("");
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }
    
    if (!selectedFolderId) {
      setError("Please select a folder for the file");
      return;
    }
    
    setIsUploading(true);
    setError("");
    
    try {
      // Step 1: Generate upload URL
      const postUrl = await generateUploadUrl();
      
      // Step 2: POST the file to the URL
      const uploadResponse = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }
      
      const { storageId } = await uploadResponse.json();
      
      // Step 3: Save the storage ID to the database
      await createFile({
        storageId,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        folderId: selectedFolderId || undefined,
      });
      
      // Show success message
      toast.success(`Successfully uploaded ${selectedFile.name}`);
      
      // Reset form
      setSelectedFile(null);
      setSelectedFolderId("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      console.error("Upload error:", err);
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
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-6">Upload Documents</h2>
      
      <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-6 max-w-2xl mx-auto">
        <div className="space-y-6">
          {/* File Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
              Select File
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <Button 
              variant="secondary" 
              onClick={handleFileSelectClick}
              className="w-full justify-center"
              disabled={isUploading}
            >
              {selectedFile ? selectedFile.name : "Choose File"}
            </Button>
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Size: {formatFileSize(selectedFile.size)}
              </p>
            )}
          </div>
          
          {/* Folder Selection */}
          {selectedFile && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
                Select Folder
              </label>
              <select
                value={selectedFolderId}
                onChange={handleFolderChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-card dark:text-dark-text transition-colors"
                disabled={isUploading}
              >
                <option value="">Choose a folder</option>
                {folders.map((folder: FolderType) => (
                  <option key={folder._id} value={folder._id}>
                    {folder.folder_name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                </div>
              </div>
            </div>
          )}
          
          {/* Upload Button */}
          {selectedFile && selectedFolderId && (
            <div className="pt-4">
              <Button 
                variant="primary" 
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full justify-center"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : "Upload File"}
              </Button>
            </div>
          )}
          
          {/* Instructions */}
          {!selectedFile && (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">Upload a Document</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Click the button above to select a file for upload</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}