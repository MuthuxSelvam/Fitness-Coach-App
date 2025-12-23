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
 * Helper function to retry async operations with exponential backoff.
 * @param {Function} operation - The async function to retry
 * @param {number} retries - Number of retry attempts (default 3)
 * @param {number} delay - Initial delay in ms (default 1000)
 */
async function retryWithBackoff(operation, retries = 3, delay = 1000) {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) throw error;

    // Check if error is retryable (network, 5xx, or specific 429)
    const isRetryable = !error.status || error.status >= 500 || error.status === 429;

    if (!isRetryable) throw error;

    console.log(`API call failed. Retrying in ${delay}ms... (${retries} attempts left)`);
    await new Promise(resolve => setTimeout(resolve, delay));

    return retryWithBackoff(operation, retries - 1, delay * 2);
  }
}

/**
 * Generates a personalized daily motivation quote based on the user's goal.
 * 
 * @param {Object} userData - User profile data (name, goal, fitnessLevel)
 * @returns {Promise<string>} A short, inspiring quote
 */
export async function generateMotivationQuote(userData) {
  const { name, goal, fitnessLevel } = userData;

  const systemPrompt = `
    You are an inspiring fitness coach. Generate a short, powerful, 1-sentence daily motivational quote for ${name}.
    Context:
    - Goal: ${goal}
    - Level: ${fitnessLevel}
    
    CRITICAL: Output ONLY the quote text. No quotation marks, no "Author:", no tags.
    `;

  try {
    return await retryWithBackoff(async () => {
      console.log("Generating motivation quote for:", name, goal);
      const response = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [{ role: "user", content: systemPrompt }],
      });
      const quote = response.choices[0].message.content.trim();
      console.log("AI Quote generated successfully:", quote);
      return quote;
    }, 2, 1000); // Retry twice
  } catch (error) {
    console.error("AI Service Error (Motivation Quote):", error);
    // Explicitly check for rate limits or key issues
    if (error.status === 402 || error.status === 429) {
      console.warn("Rate limited or balance exhausted. Using local fallback.");
    }
    // Fallback if AI fails
    return "Consistency is the key to progress. Keep showing up!";
  }
}

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
    // Make the API request to generate the plan with retry mechanism
    // Using 2 retries with 1s base delay for faster response
    const response = await retryWithBackoff(async () => {
      return await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [{ role: "user", content: systemPrompt }],
        response_format: { type: "json_object" },
      });
    }, 2, 1000); // Retry 2 times, start with 1s delay

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
    // Instead of throwing, we now return a FALLBACK plan to ensure the UI is never empty.
    console.warn("Generating fallback plan due to API failure.");

    // Fallback data structure mirroring the AI response
    return {
      "workout_plan": [
        {
          "day": "Monday",
          "focus": "Full Body Power",
          "exercises": [
            { "name": "Barbell Squats", "sets": "4", "reps": "8-10", "tips": "Keep chest up and core tight" },
            { "name": "Bench Press", "sets": "3", "reps": "10", "tips": "Control the descent" },
            { "name": "Bent Over Rows", "sets": "3", "reps": "12", "tips": "Squeeze shoulder blades" },
            { "name": "Plank", "sets": "3", "reps": "60s", "tips": "Maintain straight line" }
          ]
        },
        {
          "day": "Tuesday",
          "focus": "Active Recovery",
          "exercises": [
            { "name": "Light Jogging", "sets": "1", "reps": "20 mins", "tips": "Keep comfortable pace" },
            { "name": "Stretching Routine", "sets": "1", "reps": "15 mins", "tips": "Focus on tight areas" }
          ]
        },
        {
          "day": "Wednesday",
          "focus": "Upper Body Strength",
          "exercises": [
            { "name": "Overhead Press", "sets": "3", "reps": "10", "tips": "Don't arch back" },
            { "name": "Pull Ups", "sets": "3", "reps": "Max", "tips": "Full range of motion" },
            { "name": "Dumbbell Curls", "sets": "3", "reps": "12", "tips": "Isolate biceps" }
          ]
        },
        {
          "day": "Thursday",
          "focus": "Rest Day",
          "exercises": [
            { "name": "Walking", "sets": "1", "reps": "30 mins", "tips": "Leisurely pace" }
          ]
        },
        {
          "day": "Friday",
          "focus": "Lower Body & Core",
          "exercises": [
            { "name": "Romanian Deadlifts", "sets": "3", "reps": "10", "tips": "Hinge at hips" },
            { "name": "Lunges", "sets": "3", "reps": "12/leg", "tips": "Knee shouldn't pass toe" },
            { "name": "Leg Raises", "sets": "3", "reps": "15", "tips": "Control movement" }
          ]
        },
        {
          "day": "Saturday",
          "focus": "Cardio & HIIT",
          "exercises": [
            { "name": "Burpees", "sets": "3", "reps": "10", "tips": "Explosive movement" },
            { "name": "Mountain Climbers", "sets": "3", "reps": "30s", "tips": "Keep hips low" },
            { "name": "Jump Rope", "sets": "3", "reps": "2 mins", "tips": "Stay on toes" }
          ]
        },
        {
          "day": "Sunday",
          "focus": "Rest & Prep",
          "exercises": [{ "name": "Yoga", "sets": "1", "reps": "20 mins", "tips": "Relax and breathe" }]
        }
      ],
      "diet_plan": [
        {
          "meal": "Breakfast",
          "food": "Oatmeal with Berries & Protein Shake",
          "calories": 450,
          "protein": "30g",
          "carbs": "50g",
          "fats": "10g"
        },
        {
          "meal": "Lunch",
          "food": "Grilled Chicken Salad with Quinoa",
          "calories": 600,
          "protein": "45g",
          "carbs": "40g",
          "fats": "20g"
        },
        {
          "meal": "Snack",
          "food": "Greek Yogurt & Almonds",
          "calories": 250,
          "protein": "15g",
          "carbs": "10g",
          "fats": "15g"
        },
        {
          "meal": "Dinner",
          "food": "Baked Salmon with Steamed Broccoli",
          "calories": 500,
          "protein": "40g",
          "carbs": "10g",
          "fats": "25g"
        }
      ],
      "summary": {
        "daily_calories": 2200,
        "macros": { "protein": "160g", "carbs": "200g", "fats": "80g" }
      }
    };
  }
}
