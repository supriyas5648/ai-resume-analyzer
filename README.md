# 🚀 AI Resume Analyzer  

An AI-powered Resume Analyzer web application that evaluates resumes using Google Gemini AI and provides ATS score, strengths, weaknesses, and improvement suggestions.

This project is built using the MERN stack and demonstrates full-stack development, secure authentication, file upload handling, and AI integration.

---

## 🔥 Features

- 🔐 JWT Authentication (Login / Register)
- 📄 Resume Upload (PDF / Text)
- 🧠 AI-powered Resume Analysis (Gemini 2.5 Flash)
- 📊 ATS Score Breakdown
- 💪 Strength & Weakness Detection
- 📈 Skill Match Analysis
- 🗂 Resume History for Each User
- 🛡 Secure API Key Handling using Environment Variables

---

## 🛠 Tech Stack

### 🎨 Frontend
- React (Vite + TypeScript)
- Tailwind CSS
- shadcn/ui
- Fetch API

### ⚙ Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (File Upload)
- pdfjs-dist (PDF Text Extraction)
- Google Gemini AI API

---

## 🧠 How It Works

1. User registers or logs in.
2. Uploads resume (PDF or text format).
3. Backend extracts text from the uploaded resume.
4. Extracted text is sent to Gemini AI for analysis.
5. AI returns structured JSON response including:
   - ATS Score
   - Strengths
   - Weaknesses
   - Skill Analysis
   - Suitable Job roles
6. Analysis is stored in MongoDB.
7. User can view resume analysis history anytime.

---

## ⚙ Setup

### Backend
```
cd backend
npm install
node server.js
```

Create a `.env` file inside the backend folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
AI_API_KEY=your_api_key
>>>>>>> 914f8b7e8584b5b4673187306287f5b2b9e76d5e
JWT_SECRET=your_secret_key
```

### Frontend
```
cd client
npm install
npm run dev
```

---

## 👨‍💻 Author
Supriy Rai
>>>>>>> 914f8b7e8584b5b4673187306287f5b2b9e76d5e
