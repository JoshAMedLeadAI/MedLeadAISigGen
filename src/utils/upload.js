// Replace these with your actual Cloudinary credentials
const CLOUD_NAME = 'da2gi6rwv';
const UPLOAD_PRESET = 'MedLead Signature Generator';

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload failed');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

/**
 * Renders a headshot image to a canvas with all transformations baked in,
 * then returns it as a PNG Blob ready for upload.
 * 
 * @param {string} imageUrl - The image URL (can be data URL or remote URL)
 * @param {Object} options - Rendering options
 * @param {number} options.containerSize - The size of the output image (width = height)
 * @param {number} options.imageScale - Scale percentage (100 = original size)
 * @param {number} options.positionX - X position percentage (0-100, 50 = centered)
 * @param {number} options.positionY - Y position percentage (0-100, 50 = centered)
 * @param {string} options.shape - 'circle', 'rounded', or 'square'
 * @returns {Promise<Blob>} PNG blob of the rendered image
 */
export const renderHeadshotToCanvas = async (imageUrl, options) => {
    const {
        containerSize = 175,
        imageScale = 100,
        positionX = 50,
        positionY = 50,
        shape = 'circle'
    } = options;

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Allow CORS for remote images
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = containerSize;
            canvas.height = containerSize;
            const ctx = canvas.getContext('2d');

            // Clear canvas with transparency
            ctx.clearRect(0, 0, containerSize, containerSize);

            // Apply clipping mask based on shape
            ctx.save();
            ctx.beginPath();
            
            if (shape === 'circle') {
                ctx.arc(containerSize / 2, containerSize / 2, containerSize / 2, 0, Math.PI * 2);
            } else if (shape === 'rounded') {
                const radius = 10;
                ctx.roundRect(0, 0, containerSize, containerSize, radius);
            } else {
                // Square - no clipping needed, just draw the full rect
                ctx.rect(0, 0, containerSize, containerSize);
            }
            
            ctx.clip();

            // Calculate scaled image dimensions
            // In CSS: width is imageScale% of container, height is auto (maintains aspect ratio)
            const scaleFactor = imageScale / 100;
            const scaledWidth = containerSize * scaleFactor;
            const scaledHeight = (img.height / img.width) * scaledWidth;

            // Calculate position offset (same logic as CSS preview)
            // CSS uses: left: (X - 50) * 5px, top: (Y - 50) * 5px
            const offsetX = (positionX - 50) * 5;
            const offsetY = (positionY - 50) * 5;

            // CSS behavior: image is horizontally centered (text-align: center)
            // but vertically starts at TOP (not centered)
            // Then position: relative offsets from there
            const drawX = (containerSize - scaledWidth) / 2 + offsetX;
            const drawY = 0 + offsetY; // Start at top, not centered

            // Draw the image
            ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight);
            
            ctx.restore();

            // Export as PNG blob
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to create image blob'));
                }
            }, 'image/png');
        };

        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };

        img.src = imageUrl;
    });
};

/**
 * Uploads a Blob to Cloudinary
 * @param {Blob} blob - The blob to upload
 * @returns {Promise<string>} The uploaded image URL
 */
export const uploadBlob = async (blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'headshot.png');
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload failed');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Error uploading blob:', error);
        throw error;
    }
};
