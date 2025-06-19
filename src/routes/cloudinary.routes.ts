import { Router } from 'express';
import { deleteImage, deleteMultipleImages } from '../controllers/imageClodinary/cloudinary.controller';

const router = Router();

/**
 * @route DELETE /api/cloudinary/image
 * @desc Delete a single image from Cloudinary
 * @access Public (you may want to add authentication middleware)
 * @body { imageUrl: string, publicId?: string }
 * @query ?url=string&publicId=string (alternative to body)
 */
router.delete('/image', deleteImage);

/**
 * @route DELETE /api/cloudinary/images
 * @desc Delete multiple images from Cloudinary
 * @access Public (you may want to add authentication middleware)
 * @body { images: Array<{ imageUrl: string, publicId?: string }> }
 */
router.delete('/images', deleteMultipleImages);

export default router;

