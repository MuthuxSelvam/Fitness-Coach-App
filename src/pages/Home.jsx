/**
 * Home Page Component
 * 
 * The landing page of the AI Fitness Coach application.
 * Features a hero section with animated elements, gradient backgrounds,
 * and a clear call-to-action to get users started.
 * 
 * Author: Muthu Selvam
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">

            {/* Background Gradient Blobs */}
            {/* These create a subtle, dynamic background effect */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />

            {/* Main Content Container */}
            <div className="container mx-auto px-6 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* AI Badge */}
                    <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">
                            AI-Powered Transformations
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary">
                            Transform Your <br /> Fitness Journey
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl text-muted-foreground opacity-80 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Get personalized workout routines and diet plans generated instantly by AI.
                        Tailored to your goals, lifestyle, and preferences.
                    </p>

                    {/* Call to Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Link
                            to="/get-started"
                            className="group bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center space-x-2"
                        >
                            <span>Build My Plan</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Home;
