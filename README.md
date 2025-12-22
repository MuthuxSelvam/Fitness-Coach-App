# 🏋️ AI Fitness Coach

> Your personal AI-powered fitness and nutrition companion, built with React and Gemini 2.0 Flash.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![AI](https://img.shields.io/badge/Gemini-2.0_Flash-4285F4?logo=google)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Plan Generation** | 7-day personalized workout & diet plans via Gemini 2.0 |
| 🏃 **Smart Workouts** | Exercises tailored to your fitness level and goals |
| 🥗 **Nutrition Tracking** | Complete meal plans with macros and calories |
| 🌙 **Dark/Light Mode** | Beautiful UI with theme toggle |
| 🗣️ **Text-to-Speech** | Listen to your plan hands-free |
| 📄 **PDF Export** | Download or print your plan |
| 💾 **Local Caching** | Plans saved for instant access |
| 💪 **Motivation Quotes** | Daily inspiration to keep you going |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-fitness-coach.git

# Navigate to project
cd ai-fitness-coach

# Install dependencies
npm install

# Add your API key (create .env file)
echo "VITE_OPENROUTER_API_KEY=your_key_here" > .env

# Start development server
npm run dev
```

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
VITE_SITE_URL=http://localhost:5173
VITE_SITE_NAME=AI Fitness Coach
```

Get your API key from [OpenRouter](https://openrouter.ai/).

---

## 📁 Project Structure

```
src/
├── components/
│   ├── features/     # InputForm
│   ├── layout/       # Navbar, Layout
│   └── ui/           # Loading spinner
├── pages/
│   ├── Home.jsx      # Landing page
│   ├── GetStarted.jsx # Form page
│   └── Dashboard.jsx  # Results page
├── services/
│   └── aiService.js  # AI API integration
└── lib/
    └── pdfUtils.js   # PDF export utility
```

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite
- **Styling:** Tailwind CSS 4, Framer Motion
- **AI:** Google Gemini 2.0 Flash (via OpenRouter)
- **Icons:** Lucide React
- **Routing:** React Router DOM

---

## 📦 Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host.

---

## 👨‍💻 Author

**Muthu Selvam**

---

## 📄 License

MIT License - feel free to use this project for learning and personal use.
