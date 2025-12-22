/**
 * Layout Component
 * 
 * This is the main layout wrapper for the entire application.
 * It provides consistent structure across all pages with a 
 * fixed navbar at the top and a footer at the bottom.
 * 
 * Author: Muthu Selvam
 */

import React from 'react';
import Navbar from './Navbar';

/**
 * Main layout component that wraps all page content.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The page content to render
 */
function Layout({ children }) {
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen flex flex-col pt-16">
            {/* Fixed navigation bar at the top */}
            <Navbar />

            {/* Main content area - grows to fill available space */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer with copyright information */}
            <footer className="py-8 text-center text-gray-500 text-sm">
                <p>© {currentYear} AI Fitness Coach Build by Muthu</p>
                <p className="mt-1 text-gray-400">Powered by Gemini 2.0 Flash</p>
            </footer>
        </div>
    );
}

export default Layout;
