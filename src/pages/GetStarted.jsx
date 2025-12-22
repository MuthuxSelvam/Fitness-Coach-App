/**
 * GetStarted Page Component
 * 
 * This page displays the multi-step input form where users
 * provide their personal information, fitness goals, and preferences.
 * The data collected here is used to generate personalized plans.
 * 
 * Author: Muthu Selvam
 */

import React from 'react';
import InputForm from '../components/features/InputForm';

function GetStarted() {
    return (
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">

            {/* Page Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Let's Build Your Plan
                </h1>
                <p className="text-muted-foreground">
                    Tell us about yourself to get a personalized AI fitness roadmap.
                </p>
            </div>

            {/* Input Form Component */}
            <div className="w-full">
                <InputForm />
            </div>
        </div>
    );
}

export default GetStarted;
