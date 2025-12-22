/**
 * Navbar Component
 * 
 * The main navigation bar for the application.
 * Features a responsive design with logo, navigation links,
 * theme toggle (light/dark mode), and a call-to-action button.
 * 
 * Author: Muthu Selvam
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Sun, Moon } from 'lucide-react';

function Navbar() {
    // Get the saved theme from localStorage, default to 'dark' if not set
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const [theme, setTheme] = useState(savedTheme);

    // Apply theme changes whenever the theme state changes
    useEffect(() => {
        // Add or remove the 'dark' class from the document root
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Save the preference to localStorage for persistence
        localStorage.setItem('theme', theme);
    }, [theme]);

    /**
     * Toggles between light and dark themes
     */
    function toggleTheme() {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border transition-all duration-500">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo and Brand Name */}
                <Link to="/" className="flex items-center space-x-2">
                    <Dumbbell className="w-8 h-8 text-primary" />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        AI Coach
                    </span>
                </Link>

                {/* Desktop Navigation Links - Centered */}
                <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
                    <Link to="/" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                        Home
                    </Link>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-6">

                    {/* Theme Toggle Switch */}
                    <div className="flex items-center bg-surface border border-border rounded-full p-1 relative w-20 h-10 shadow-inner">
                        {/* Light Mode Button */}
                        <button
                            onClick={() => setTheme('light')}
                            className={`flex-1 flex justify-center items-center z-10 transition-colors ${theme === 'light' ? 'text-primary' : 'text-muted'}`}
                            aria-label="Switch to light mode"
                        >
                            <Sun className="w-4 h-4" />
                        </button>

                        {/* Dark Mode Button */}
                        <button
                            onClick={() => setTheme('dark')}
                            className={`flex-1 flex justify-center items-center z-10 transition-colors ${theme === 'dark' ? 'text-primary' : 'text-muted'}`}
                            aria-label="Switch to dark mode"
                        >
                            <Moon className="w-4 h-4" />
                        </button>

                        {/* Animated Slider Indicator */}
                        <div
                            className={`absolute top-1 left-1 bottom-1 w-[34px] bg-background border border-border rounded-full shadow-sm transition-transform duration-300 transform ${theme === 'dark' ? 'translate-x-[38px]' : 'translate-x-0'}`}
                        />
                    </div>

                    {/* Call to Action Button */}
                    <Link to="/get-started" className="btn-primary">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
