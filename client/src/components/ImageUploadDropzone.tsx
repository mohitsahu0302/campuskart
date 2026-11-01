'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, X, Image as ImageIcon, Link as LinkIcon, Plus } from 'lucide-react';
import { uploadApi } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

interface ImageUploadDropzoneProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUploadDropzone({
  images,
  onChange,
  maxImages = 5,
}: ImageUploadDropzoneProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      toast(`You can pin at most ${maxImages} photos per notice.`, 'error');
      return;
    }

    const validFiles: File[] = [];
    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];
      // Size check: 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast(`"${file.name}" exceeds 5MB limit. Please compress it.`, 'error');
        continue;
      }
      // Type check
      if (!file.type.startsWith('image/')) {
        toast(`"${file.name}" is not an image file.`, 'error');
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    try {
      setUploading(true);
      const formData = new FormData();
      validFiles.forEach((file) => formData.append('images', file));

      const res = await uploadApi.uploadImages(formData);
      if (res.success && res.data.urls) {
        onChange([...images, ...res.data.urls]);
        toast(`${validFiles.length} photo(s) uploaded successfully!`, 'success');
      }
    } catch (err: any) {
      toast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    if (images.length >= maxImages) {
      toast(`Maximum ${maxImages} images allowed.`, 'error');
      return;
    }

    onChange([...images, urlInput.trim()]);
    setUrlInput('');
    setShowUrlField(false);
    toast('Image link added!', 'success');
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      {/* Upload Previews Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {images.map((imgUrl, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded-md overflow-hidden bg-stone-100 border border-stone-300 group shadow-sm"
          >
            <Image
              src={imgUrl}
              alt={`Preview ${idx + 1}`}
              fill
              sizes="120px"
              className="object-cover"
            />
            {idx === 0 && (
              <span className="absolute bottom-1 left-1 bg-stone-900/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                Cover Photo
              </span>
            )}
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-80 group-hover:opacity-100 hover:bg-red-700 transition-opacity"
              aria-label="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {/* Dropzone Trigger Tile */}
        {images.length < maxImages && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-square rounded-md border-2 border-dashed border-stone-300 bg-white/70 hover:bg-amber-50 hover:border-vermilion/50 flex flex-col items-center justify-center p-2 cursor-pointer transition-colors text-center ${
              uploading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <UploadCloud className="w-6 h-6 text-stone-400 mb-1" />
            <span className="text-[11px] font-semibold text-stone-700 leading-tight">
              {uploading ? 'Uploading...' : 'Add Photo'}
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5">
              {images.length}/{maxImages}
            </span>
          </div>
        )}
      </div>

      {/* Alternative URL button */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>Supported: JPG, PNG, WebP up to 5MB</span>
        <button
          type="button"
          onClick={() => setShowUrlField(!showUrlField)}
          className="text-vermilion hover:underline inline-flex items-center gap-1 font-medium"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlField ? 'Hide URL input' : 'Or paste image URL'}</span>
        </button>
      </div>

      {showUrlField && (
        <div className="flex gap-2 animate-in fade-in-50">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded text-xs text-stone-800 focus:outline-none focus:border-vermilion"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-1.5 bg-stone-900 text-white rounded text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
