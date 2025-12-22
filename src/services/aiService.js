/**
 * AI Service Module
 * 
 * This module handles all communication with the OpenRouter API
 * to generate personalized fitness and nutrition plans.
 * 
 * Author: Muthu Selvam
 * Version: 1.0.0
 */

import OpenAI from "openai";

// Initialize the OpenAI client with OpenRouter configuration
// We use OpenRouter as a proxy to access various AI models including Gemini
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
    dangerouslyAllowBrowser: true, // Note: In production, API calls should go through a backend
    defaultHeaders: {
        "HTTP-Referer": import.meta.env.VITE_SITE_URL,
        "X-Title": import.meta.env.VITE_SITE_NAME,
    },
});

/**
 * Generates a personalized 7-day fitness and diet plan based on user data.
 * 
 * This function takes the user's profile information and sends it to the AI
 * model to create a customized workout routine and meal plan.
 * 
 * @param {Object} userData - The user's profile information
 * @param {string} userData.name - User's name
 * @param {number} userData.age - User's age in years
 * @param {string} userData.gender - User's gender
 * @param {number} userData.weight - User's weight in kg
 * @param {number} userData.height - User's height in cm
 * @param {string} userData.goal - Primary fitness goal (e.g., "Weight Loss", "Muscle Gain")
 * @param {string} userData.fitnessLevel - Current fitness level
 * @param {string} userData.location - Preferred workout location
 * @param {string} userData.dietPreference - Dietary restrictions/preferences
 * 
 * @returns {Promise<Object>} The generated fitness plan containing workout_plan, diet_plan, and summary
 * @throws {Error} If the API call fails or returns invalid data
 */
export async function generateFitnessPlan(userData) {
    // Destructure user data for easier access
    const {
        name,
        age,
        gender,
        weight,
        height,
        goal,
        fitnessLevel,
        location,
        dietPreference
    } = userData;

    // Build the prompt that tells the AI exactly what we need
    // We're being very specific about the output format to ensure consistent results
    const systemPrompt = `
    You are an expert fitness coach and nutritionist. 
    Generate a 7-day Workout and Diet plan for ${name}:
    - Profile: ${age} years old, ${gender}, ${weight}kg, ${height}cm.
    - Fitness Level: ${fitnessLevel}
    - Goal: ${goal}
    - Workout Location: ${location}
    - Dietary Preference: ${dietPreference}

    IMPORTANT: Return ONLY valid JSON. Do not add markdown or text outside the JSON.
    The response must follow this exact structure:
    {
      "workout_plan": [
        { 
          "day": "Monday", 
          "focus": "Muscle Group", 
          "exercises": [
            { "name": "Exercise", "sets": "3", "reps": "12", "tips": "Tip" }
          ] 
        },
        ... (repeat for 7 days)
      ],
      "diet_plan": [
        { 
          "meal": "Breakfast", 
          "food": "Description", 
          "calories": 400, 
          "protein": "30g", 
          "carbs": "40g", 
          "fats": "10g" 
        },
        ... (include Breakfast, Lunch, Snack, Dinner)
      ],
      "summary": {
        "daily_calories": 2500,
        "macros": { "protein": "150g", "carbs": "300g", "fats": "70g" }
      }
    }
  `;

    try {
        // Make the API request to generate the plan
        const response = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-exp:free",
            messages: [{ role: "user", content: systemPrompt }],
            response_format: { type: "json_object" },
        });

        // Extract the content from the response
        const content = response.choices[0].message.content;

        // Validate that we got a response
        if (!content) {
            throw new Error("The AI returned an empty response. Please try again.");
        }

        // Parse and return the JSON response
        return JSON.parse(content);

    } catch (error) {
        // Log the error for debugging purposes
        console.error("Failed to generate fitness plan:", error);

        // Re-throw with a more user-friendly message
        throw new Error("Unable to generate your fitness plan. Please check your connection and try again.");
    }
}
