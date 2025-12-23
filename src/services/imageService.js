/**
 * Image Generation Service
 * 
 * Uses Pollinations.ai to generate AI images for exercises and meals.
 * Pollinations is a free, no-signup-required image generation API.
 * 
 * Author: Muthu Selvam
 * Version: 1.0.0
 */

/**
 * Generates an AI image URL for a given prompt.
 * 
 * @param {string} prompt - The item name (exercise or meal)
 * @param {string} type - Either 'exercise' or 'meal'
 * @param {string} gender - Optional gender for personalized exercise images
 * @returns {string} The Pollinations.ai image URL
 * 
 * @example
 * generateImageUrl("Barbell Squat", "exercise", "Female")
 * // Returns: "https://image.pollinations.ai/prompt/Female%20performing%20Barbell%20Squat%2C%20..."
 */
export function generateImageUrl(prompt, type = 'exercise', gender = '') {
    // Base styles for commercial consistency
    const cameraSettings = "shot on 85mm lens, f/1.8, soft studio lighting, sharp focus, 8k ultra-detailed";

    // Enhance the prompt based on type
    let enhancedPrompt = "";

    if (type === 'exercise') {
        const genderTerm = gender ? `${gender} ` : '';
        // Focus: Anatomy, action, gym atmosphere, sweat/texture
        enhancedPrompt = `ultra-realistic cinematic fitness photography of a ${genderTerm}athlete actively performing the ${prompt} exercise with textbook biomechanics and competition-level form, clearly defined joint alignment, neutral spine, engaged core, correct range of motion, mid-rep action phase captured at peak muscle contraction, powerful athletic posture, performance-focused expression (not posing), ${genderTerm}physique: low body fat, visibly muscular, strong and functional build, sweat texture on skin, natural muscle striations, realistic proportions, no exaggerated curves, no beauty posing, modern professional gym environment, premium equipment, shallow depth of field, dramatic directional lighting emphasizing muscle anatomy, high-speed DSLR sports photography, ultra-sharp focus, 8K realism, ${cameraSettings}`;
    } else {
        // Focus: Texture, plating, appetizing colors, lighting
        enhancedPrompt = `professional culinary photography of ${prompt}, gourmet plating, macro shot, vibrant fresh ingredients, steam rising, shallow depth of field, softbox lighting, appetizing textures, ${cameraSettings}`;
    }

    // Pollinations.ai uses a simple URL-based API
    // No API key needed - just encode the prompt in the URL
    const encodedPrompt = encodeURIComponent(enhancedPrompt);

    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true`;
}

/**
 * Preloads an image to check if it's available.
 * Useful for showing loading states.
 * 
 * @param {string} url - The image URL to preload
 * @returns {Promise<boolean>} Resolves to true when loaded, rejects on error
 */
export function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = url;
    });
}
