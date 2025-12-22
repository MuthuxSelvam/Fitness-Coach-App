/**
 * Loading Component
 * 
 * A visually appealing loading indicator shown while the AI
 * is generating the user's personalized fitness plan.
 * Features an animated brain icon and progress bar.
 * 
 * Author: Muthu Selvam
 */

import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

/**
 * Displays a loading animation with a customizable message.
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - The loading message to display
 */
function Loading({ message = "Analyzing your profile..." }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">

            {/* Animated Brain Icon with Glow Effect */}
            <div className="relative mb-8">
                {/* Background glow */}
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />

                {/* Rotating brain icon */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                    <BrainCircuit className="w-16 h-16 text-primary" />
                </motion.div>
            </div>

            {/* Loading Text */}
            <h2 className="text-2xl font-bold mb-2 text-foreground">
                Generating Your Personalized Plan
            </h2>
            <p className="text-muted-foreground animate-pulse">
                {message}
            </p>

            {/* Animated Progress Bar */}
            <div className="mt-8 w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
        </div>
    );
}

export default Loading;
