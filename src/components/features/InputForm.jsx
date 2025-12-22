/**
 * InputForm Component
 * 
 * A multi-step form that collects user information for generating
 * personalized fitness plans. The form is divided into three steps:
 * 1. Personal Info (name, age, gender, measurements)
 * 2. Fitness Goals (primary goal, fitness level, stress level)
 * 3. Preferences (workout location, dietary preferences)
 * 
 * Author: Muthu Selvam
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Activity, Target, Utensils } from 'lucide-react';

// Step labels for the progress indicator
const FORM_STEPS = ['Personal', 'Goals', 'Preferences'];

// Available options for various form fields
const GOAL_OPTIONS = ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility'];
const LOCATION_OPTIONS = ['Gym', 'Home', 'Outdoor'];
const DIET_OPTIONS = ['Non-Vegetarian', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Mediterranean'];

function InputForm() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);

    // Form data state with all user inputs
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        height: '',
        weight: '',
        goal: 'Weight Loss',
        fitnessLevel: 'Beginner',
        location: 'Gym',
        dietPreference: '',
        sleepHours: '',
        waterIntake: '',
        stressLevel: ''
    });

    /**
     * Updates a single field in the form data.
     * Includes validation for numeric and text-only fields.
     * 
     * @param {string} fieldName - The name of the field to update
     * @param {string} value - The new value for the field
     */
    function updateField(fieldName, value) {
        // Numeric fields: only allow numbers and decimal points
        const numericFields = ['age', 'height', 'weight', 'sleepHours', 'waterIntake'];
        if (numericFields.includes(fieldName)) {
            const isValidNumber = value === '' || /^\d*\.?\d*$/.test(value);
            if (isValidNumber) {
                setFormData(prev => ({ ...prev, [fieldName]: value }));
            }
            return;
        }

        // Name field: only allow letters and spaces
        if (fieldName === 'name') {
            const isValidName = value === '' || /^[a-zA-Z\s]*$/.test(value);
            if (isValidName) {
                setFormData(prev => ({ ...prev, [fieldName]: value }));
            }
            return;
        }

        // All other fields: update directly
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    }

    /**
     * Validates whether the current step has all required fields filled.
     * 
     * @returns {boolean} True if the current step is valid
     */
    function isCurrentStepValid() {
        if (currentStep === 1) {
            // Step 1: Personal info validation
            const hasName = formData.name.trim().length > 0;
            const hasGender = formData.gender !== '';
            const hasValidAge = formData.age !== '' && parseFloat(formData.age) > 0;
            const hasValidHeight = formData.height !== '' && parseFloat(formData.height) > 0;
            const hasValidWeight = formData.weight !== '' && parseFloat(formData.weight) > 0;
            const hasValidSleep = formData.sleepHours !== '' && parseFloat(formData.sleepHours) > 0;
            const hasValidWater = formData.waterIntake !== '' && parseFloat(formData.waterIntake) > 0;

            return hasName && hasGender && hasValidAge && hasValidHeight &&
                hasValidWeight && hasValidSleep && hasValidWater;
        }

        if (currentStep === 2) {
            // Step 2: Goals validation
            return formData.goal && formData.fitnessLevel && formData.stressLevel;
        }

        if (currentStep === 3) {
            // Step 3: Preferences validation
            return formData.location && formData.dietPreference;
        }

        return true;
    }

    /**
     * Advances to the next step or submits the form on the final step.
     */
    function goToNextStep() {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            // Final step: navigate to dashboard with form data
            navigate('/dashboard', { state: { userData: formData } });
        }
    }

    /**
     * Goes back to the previous step.
     */
    function goToPreviousStep() {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }

    // Animation configuration for step transitions
    const stepAnimation = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    // Shared styles for form inputs
    const inputStyles = "w-full bg-background border border-border rounded-lg p-3 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all";

    return (
        <div className="max-w-2xl mx-auto p-6 card backdrop-blur-lg">

            {/* Progress Indicator */}
            <div className="mb-8 flex justify-between items-center">
                {FORM_STEPS.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = currentStep === stepNumber;

                    return (
                        <div
                            key={label}
                            className={`flex flex-col items-center flex-1 ${isActive ? 'text-primary' : 'text-gray-500'}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 transition-colors ${isActive ? 'border-primary bg-primary/10' : 'border-gray-600'}`}>
                                {stepNumber}
                            </div>
                            <span className="text-xs uppercase tracking-wider">{label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Form Steps */}
            <AnimatePresence mode='wait'>

                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                    <motion.div
                        key="step1"
                        {...stepAnimation}
                        className="space-y-4"
                    >
                        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">
                            <Activity className="mr-2 text-primary" /> About You
                        </h2>

                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                className="input-field"
                                placeholder="Your name"
                            />
                        </div>

                        {/* Age and Gender Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Age</label>
                                <input
                                    type="number"
                                    value={formData.age}
                                    onChange={(e) => updateField('age', e.target.value)}
                                    className="input-field"
                                    placeholder="20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Gender</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => updateField('gender', e.target.value)}
                                    className={inputStyles}
                                >
                                    <option value="" disabled hidden>Select Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Height and Weight Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Height (cm)</label>
                                <input
                                    type="number"
                                    value={formData.height}
                                    onChange={(e) => updateField('height', e.target.value)}
                                    className={inputStyles}
                                    placeholder="175"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Weight (kg)</label>
                                <input
                                    type="number"
                                    value={formData.weight}
                                    onChange={(e) => updateField('weight', e.target.value)}
                                    className={inputStyles}
                                    placeholder="70"
                                />
                            </div>
                        </div>

                        {/* Sleep and Water Intake Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Sleep Hours</label>
                                <input
                                    type="number"
                                    value={formData.sleepHours}
                                    onChange={(e) => updateField('sleepHours', e.target.value)}
                                    className={inputStyles}
                                    placeholder="7"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Water Intake (L/day)</label>
                                <input
                                    type="number"
                                    value={formData.waterIntake}
                                    onChange={(e) => updateField('waterIntake', e.target.value)}
                                    className={inputStyles}
                                    placeholder="3"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Fitness Goals */}
                {currentStep === 2 && (
                    <motion.div
                        key="step2"
                        {...stepAnimation}
                        className="space-y-4"
                    >
                        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">
                            <Target className="mr-2 text-primary" /> Goals
                        </h2>

                        {/* Primary Goal Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground">Primary Goal</label>
                            <div className="grid grid-cols-2 gap-3">
                                {GOAL_OPTIONS.map(goal => (
                                    <button
                                        key={goal}
                                        onClick={() => updateField('goal', goal)}
                                        className={`p-3 rounded-lg border transition-all ${formData.goal === goal
                                                ? 'bg-primary/10 border-primary text-primary font-semibold'
                                                : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                                            }`}
                                    >
                                        {goal}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Fitness Level Dropdown */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground">Fitness Level</label>
                            <select
                                value={formData.fitnessLevel}
                                onChange={(e) => updateField('fitnessLevel', e.target.value)}
                                className={inputStyles}
                            >
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>

                        {/* Stress Level Dropdown */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground">Stress Level</label>
                            <select
                                value={formData.stressLevel}
                                onChange={(e) => updateField('stressLevel', e.target.value)}
                                className={inputStyles}
                            >
                                <option value="" disabled hidden>Select stress level</option>
                                <option>Low</option>
                                <option>Moderate</option>
                                <option>High</option>
                            </select>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Preferences */}
                {currentStep === 3 && (
                    <motion.div
                        key="step3"
                        {...stepAnimation}
                        className="space-y-4"
                    >
                        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">
                            <Utensils className="mr-2 text-primary" /> Preferences
                        </h2>

                        {/* Workout Location Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground">Workout Location</label>
                            <div className="flex space-x-4">
                                {LOCATION_OPTIONS.map(location => (
                                    <button
                                        key={location}
                                        onClick={() => updateField('location', location)}
                                        className={`flex-1 p-3 rounded-lg border transition-all ${formData.location === location
                                                ? 'bg-primary/20 border-primary text-primary font-semibold'
                                                : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                                            }`}
                                    >
                                        {location}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dietary Preference Dropdown */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-muted-foreground">Dietary Preference</label>
                            <select
                                value={formData.dietPreference}
                                onChange={(e) => updateField('dietPreference', e.target.value)}
                                className={inputStyles}
                            >
                                <option value="" disabled hidden>Select your dietary preference</option>
                                {DIET_OPTIONS.map(diet => (
                                    <option key={diet}>{diet}</option>
                                ))}
                            </select>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
                {/* Back Button */}
                <button
                    onClick={goToPreviousStep}
                    disabled={currentStep === 1}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${currentStep === 1
                            ? 'opacity-0 cursor-default'
                            : 'text-gray-400 hover:text-foreground'
                        }`}
                >
                    Back
                </button>

                {/* Next/Submit Button */}
                <button
                    onClick={goToNextStep}
                    disabled={!isCurrentStepValid()}
                    className={`px-8 py-2 rounded-full font-medium transition-all flex items-center shadow-lg ${isCurrentStepValid()
                            ? 'bg-primary hover:bg-primary/90 text-white hover:shadow-primary/25'
                            : 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                        }`}
                >
                    {currentStep === 3 ? 'Generate Plan' : 'Next'}
                    <ChevronRight className="ml-2 w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default InputForm;
