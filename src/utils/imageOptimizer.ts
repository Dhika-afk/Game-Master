/**
 * Image Optimizer Utility for Rental PS
 * Automatically compresses, resizes (max 1200px), and converts images to WebP/JPEG
 * with target file size < 300KB before uploading to Supabase Storage.
 */

export interface OptimizedImageResult {
  file: File;
  previewUrl: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number; // percentage saved, e.g. 75 (%)
  originalWidth: number;
  originalHeight: number;
  width: number;
  height: number;
  format: string;
}

export interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  targetMaxSizeBytes?: number; // default 300 KB
  initialQuality?: number; // 0.80 default
  preferredFormat?: 'image/webp' | 'image/jpeg';
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export async function optimizeProductImage(
  inputFile: File,
  options: OptimizationOptions = {}
): Promise<OptimizedImageResult> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    targetMaxSizeBytes = 300 * 1024, // 300 KB
    initialQuality = 0.80,
    preferredFormat = 'image/webp'
  } = options;

  return new Promise((resolve, reject) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(inputFile.type.toLowerCase())) {
      return reject(new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('File bukan gambar yang valid.'));
      img.onload = async () => {
        try {
          const originalWidth = img.naturalWidth || img.width;
          const originalHeight = img.naturalHeight || img.height;

          // Calculate scaled dimensions (max width 1200, max height 1200, preserve aspect ratio)
          let targetWidth = originalWidth;
          let targetHeight = originalHeight;

          if (targetWidth > maxWidth || targetHeight > maxHeight) {
            const widthRatio = maxWidth / targetWidth;
            const heightRatio = maxHeight / targetHeight;
            const bestRatio = Math.min(widthRatio, heightRatio);

            targetWidth = Math.round(targetWidth * bestRatio);
            targetHeight = Math.round(targetHeight * bestRatio);
          }

          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            return reject(new Error('Canvas 2D context tidak tersedia.'));
          }

          // Enable smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw image
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Test support for WebP
          let format = preferredFormat;
          if (format === 'image/webp') {
            const testCanvas = document.createElement('canvas');
            testCanvas.width = 1;
            testCanvas.height = 1;
            if (testCanvas.toDataURL('image/webp').indexOf('data:image/webp') !== 0) {
              format = 'image/jpeg';
            }
          }

          // Progressive quality loop to ensure < targetMaxSizeBytes (300KB)
          let quality = initialQuality;
          let blob: Blob | null = null;
          let attempts = 0;

          while (attempts < 4) {
            blob = await new Promise<Blob | null>((res) => {
              canvas.toBlob(res, format, quality);
            });

            if (!blob) break;

            if (blob.size <= targetMaxSizeBytes || quality <= 0.5) {
              break;
            }

            // Reduce quality if still larger than target
            quality = Math.max(0.5, quality - 0.1);
            attempts++;
          }

          if (!blob) {
            return reject(new Error('Gagal mengompres gambar.'));
          }

          const originalSize = inputFile.size;
          const compressedSize = blob.size;
          const compressionRatio = Math.max(
            0,
            Math.round(((originalSize - compressedSize) / originalSize) * 100)
          );

          // Generate clean filename
          const ext = format === 'image/webp' ? 'webp' : 'jpg';
          const baseName = inputFile.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .toLowerCase();
          const cleanFileName = `prod_${Date.now()}_${baseName}.${ext}`;

          const optimizedFile = new File([blob], cleanFileName, {
            type: format,
            lastModified: Date.now()
          });

          const previewUrl = URL.createObjectURL(blob);

          resolve({
            file: optimizedFile,
            previewUrl,
            originalSize,
            compressedSize,
            compressionRatio,
            originalWidth,
            originalHeight,
            width: targetWidth,
            height: targetHeight,
            format: ext.toUpperCase()
          });
        } catch (err: any) {
          reject(new Error(`Gagal optimasi gambar: ${err?.message || err}`));
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(inputFile);
  });
}
