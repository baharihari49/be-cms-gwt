import { Request, Response } from 'express';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Schema validasi untuk request body
const deleteImageSchema = z.object({
  imageUrl: z.string().url('Invalid image URL'),
  publicId: z.string().optional(), // Opsional jika ingin langsung kirim public_id
});

// Schema validasi untuk query parameter (alternatif)
const deleteImageQuerySchema = z.object({
  url: z.string().url('Invalid image URL'),
  publicId: z.string().optional(),
});

// Type definitions
type DeleteImageRequest = z.infer<typeof deleteImageSchema>;
type DeleteImageQueryRequest = z.infer<typeof deleteImageQuerySchema>;

interface CloudinaryDeleteResponse {
  result: string;
  public_id?: string;
  invalidated?: boolean; // Tambahan untuk status invalidation
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Ekstrak public_id dari URL Cloudinary
 * @param imageUrl - URL lengkap gambar Cloudinary
 * @returns public_id atau null jika tidak valid
 */
const extractPublicIdFromUrl = (imageUrl: string): string | null => {
  try {
    const url = new URL(imageUrl);
    
    if (!url.hostname.includes('cloudinary.com')) {
      return null;
    }

    const pathParts = url.pathname.split('/');
    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1 || uploadIndex >= pathParts.length - 1) {
      return null;
    }

    // Cari index yang merupakan nomor versi (dimulai dengan 'v' diikuti angka)
    const versionIndex = pathParts.findIndex(part => /^v\d+$/.test(part));

    let startIndex = uploadIndex + 1;
    if (versionIndex !== -1 && versionIndex === uploadIndex + 1) {
      startIndex = versionIndex + 1; // Lewati nomor versi
    }

    let publicIdParts: string[] = [];
    let foundTransformation = false;
    
    for (const part of pathParts.slice(startIndex)) {
      if (part.includes('_') && /^[a-z]_/.test(part) && !foundTransformation) {
        continue;
      }
      foundTransformation = true;
      publicIdParts.push(part);
    }
    
    if (publicIdParts.length === 0) {
      // Fallback jika tidak ada bagian setelah transformasi/versi
      publicIdParts = pathParts.slice(startIndex);
    }

    const publicIdWithExt = publicIdParts.join('/');
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ''); // Hapus ekstensi

    return publicId || null;
  } catch (error) {
    console.error('Error extracting public_id from URL:', error);
    return null;
  }
};

/**
 * Controller untuk menghapus gambar dari Cloudinary
 * Mendukung request body dan query parameters
 */
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    let imageUrl: string;
    let publicId: string | undefined;

    // Coba parse dari request body terlebih dahulu
    if (req.body && Object.keys(req.body).length > 0) {
      const bodyValidation = deleteImageSchema.safeParse(req.body);
      if (!bodyValidation.success) {
        res.status(400).json({
          success: false,
          message: 'Invalid request body',
          error: bodyValidation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        } as ApiResponse);
        return;
      }
      
      imageUrl = bodyValidation.data.imageUrl;
      publicId = bodyValidation.data.publicId;
    } 
    // Jika tidak ada body, coba dari query parameters
    else {
      const queryValidation = deleteImageQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          error: queryValidation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        } as ApiResponse);
        return;
      }
      
      imageUrl = queryValidation.data.url;
      publicId = queryValidation.data.publicId;
    }

    // Jika public_id tidak disediakan, ekstrak dari URL
    if (!publicId) {
      const extractedPublicId = extractPublicIdFromUrl(imageUrl);
      
      if (!extractedPublicId) {
        res.status(400).json({
          success: false,
          message: 'Unable to extract public_id from image URL. Please provide public_id explicitly.',
          error: 'Invalid Cloudinary URL format'
        } as ApiResponse);
        return;
      }
      
      publicId = extractedPublicId;
    }

    // Validasi konfigurasi Cloudinary
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      res.status(500).json({
        success: false,
        message: 'Cloudinary configuration is incomplete',
        error: 'Missing required environment variables'
      } as ApiResponse);
      return;
    }

    // Hapus gambar dari Cloudinary dengan invalidate cache
    const deleteResult: CloudinaryDeleteResponse = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
      invalidate: true,  // Invalidate CDN cache untuk menghapus dari cache
      type: 'upload'     // Specify the delivery type
    });

    // Periksa hasil penghapusan
    if (deleteResult.result === 'ok') {
      res.status(200).json({
        success: true,
        message: `Image deleted successfully from Cloudinary${deleteResult.invalidated ? ' and cache invalidated' : ''}`,
        data: {
          publicId: publicId,
          imageUrl: imageUrl,
          cloudinaryResult: deleteResult,
          cacheInvalidated: deleteResult.invalidated || false
        }
      } as ApiResponse);
    } else if (deleteResult.result === 'not found') {
      res.status(404).json({
        success: false,
        message: 'Image not found in Cloudinary',
        error: `No image found with public_id: ${publicId}`
      } as ApiResponse);
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete image from Cloudinary',
        error: `Cloudinary returned: ${deleteResult.result}`,
        data: { 
          publicId, 
          cloudinaryResult: deleteResult,
          cacheInvalidated: deleteResult.invalidated || false
        }
      } as ApiResponse);
    }

  } catch (error: any) {
    console.error('Error deleting image from Cloudinary:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting image',
      error: error.message || 'Unknown error occurred'
    } as ApiResponse);
  }
};

/**
 * Controller untuk menghapus multiple gambar sekaligus
 */
export const deleteMultipleImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleteMultipleSchema = z.object({
      images: z.array(z.object({
        imageUrl: z.string().url('Invalid image URL'),
        publicId: z.string().optional(),
      })).min(1, 'At least one image is required').max(10, 'Maximum 10 images allowed')
    });

    const validation = deleteMultipleSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid request body',
        error: validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      } as ApiResponse);
      return;
    }

    const { images } = validation.data;
    const results: Array<{
      imageUrl: string;
      publicId: string | null;
      success: boolean;
      result?: string;
      error?: string;
      cacheInvalidated?: boolean;
    }> = [];

    // Proses setiap gambar
    for (const image of images) {
      let publicId = image.publicId;
      
      if (!publicId) {
        const extractedPublicId = extractPublicIdFromUrl(image.imageUrl);
        if (!extractedPublicId) {
          results.push({
            imageUrl: image.imageUrl,
            publicId: null,
            success: false,
            error: 'Unable to extract public_id from URL'
          });
          continue;
        }
        publicId = extractedPublicId;
      }

      try {
        const deleteResult: CloudinaryDeleteResponse = await cloudinary.uploader.destroy(publicId, {
          resource_type: 'image',
          invalidate: true,  // Invalidate CDN cache untuk menghapus dari cache
          type: 'upload'     // Specify the delivery type
        });

        results.push({
          imageUrl: image.imageUrl,
          publicId: publicId,
          success: deleteResult.result === 'ok',
          result: deleteResult.result,
          error: deleteResult.result !== 'ok' ? `Cloudinary returned: ${deleteResult.result}` : undefined,
          cacheInvalidated: deleteResult.invalidated || false
        });
      } catch (error: any) {
        results.push({
          imageUrl: image.imageUrl,
          publicId: publicId,
          success: false,
          error: error.message || 'Unknown error'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    res.status(200).json({
      success: successCount > 0,
      message: `${successCount}/${totalCount} images deleted successfully`,
      data: {
        summary: {
          total: totalCount,
          successful: successCount,
          failed: totalCount - successCount
        },
        results: results
      }
    } as ApiResponse);

  } catch (error: any) {
    console.error('Error deleting multiple images:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting images',
      error: error.message || 'Unknown error occurred'
    } as ApiResponse);
  }
};