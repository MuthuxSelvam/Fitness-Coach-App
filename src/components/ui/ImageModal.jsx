/**
 * ImageModal Component
 * 
 * A beautiful modal for displaying AI-generated images of exercises and meals.
 * Features loading states, smooth animations, and click-outside-to-close.
 * 
 * Author: Muthu Selvam
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ImageIcon, Loader2 } from 'lucide-react';
import { generateImageUrl } from '../../services/imageService';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Callback when modal should close
 * @param {string} props.itemName - Name of the exercise or meal
 * @param {string} props.type - 'exercise' or 'meal'
 * @param {string} [props.userGender] - Optional gender for personalized exercise imagery
 */
function ImageModal({ isOpen, onClose, itemName, type, userGender }) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    // Generate new image URL when item changes
    useEffect(() => {
        if (isOpen && itemName) {
            setIsLoading(true);
            setHasError(false);
            setImageUrl(generateImageUrl(itemName, type, userGender));
        }
    }, [isOpen, itemName, type, userGender]);

    // Handle escape key to close modal
    useEffect(() => {
        function handleEscape(e) {
            if (e.key === 'Escape') onClose();
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = ''; };
        }
    }, [isOpen]);

    function handleImageLoad() {
        setIsLoading(false);
    }

    function handleImageError() {
        setIsLoading(false);
        setHasError(true);
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative z-10 w-full max-w-lg bg-surface rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div className="flex items-center space-x-2">
                                <ImageIcon className={`w-5 h-5 ${type === 'exercise' ? 'text-primary' : 'text-secondary'}`} />
                                <h3 className="font-semibold text-lg truncate max-w-[280px]">
                                    {itemName}
                                </h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Image Container */}
                        <div className="relative aspect-square bg-background">
                            {/* Loading State */}
                            {isLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                    <p className="text-sm text-muted-foreground">
                                        Generating AI image...
                                    </p>
                                </div>
                            )}

                            {/* Error State */}
                            {hasError && !isLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        Failed to generate image
                                    </p>
                                </div>
                            )}

                            {/* Actual Image */}
                            <img
                                src={imageUrl}
                                alt={itemName}
                                className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading || hasError ? 'opacity-0' : 'opacity-100'
                                    }`}
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                            />
                        </div>

                        {/* Footer */}
                        <div className="p-3 text-center text-xs text-muted-foreground border-t border-white/10">
                            <span className="flex items-center justify-center space-x-1">
                                <span>✨</span>
                                <span>AI-generated visualization powered by Pollinations</span>
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ImageModal;
