
<div align="Left">
  
  <h1>MockMate - AI-Powered Interview Preparation Platform</h1>
  
  <p><strong></strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#system-architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
</div>
  <img src="Assets/Intro.gif" alt="MockMate Demo" width="100%" />


## 🚀 Overview

**MockMate** is a comprehensive interview preparation platform engineered to help candidates master their technical interviews. By leveraging advanced AI and real-time video processing, MockMate provides an immersive simulation of real-world interview scenarios.

From generating tailored questions based on your resume and role to analyzing your speech and answers in real-time, MockMate offers end-to-end coaching.

## ✨ Features

| Feature | Description | Preview |
|:---:|---|:---:|
| **Live AI Interview** | Real-time video interview simulation with AI-generated questions and immediate feedback. Uses media cleanup to ensure privacy. | <img src="Assets/LiveInterview.png" width="1200" /> |
| **Interactive Dashboard** | Track your progress, view past session scores, and manage your interview schedule. | <img src="Assets/Dashboard.png" width="1200" /> |
| **Resume Analysis** | Upload your resume to get custom-tailored questions that match your experience level. | <img src="Assets/Resume.png" width="1200" /> |
| **Concept Drill** | Deep dive into specific topics with AI-driven explanations and code examples. | <img src="Assets/InterviewPrep.png" width="1200" /> |

<div align="center">
  <img src="Assets/LandingPage.png" alt="Landing Page"/>
</div>

## 🛠 Tech Stack
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Gemini API](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

## 🏗 System Architecture

The application follows a modern microservices-inspired monolithic architecture with real-time capabilities.

```mermaid
graph TB
    subgraph Client
        UI[React UI]
        Stream[MediaStream API]
        RTC_C[WebRTC Client]
    end

    subgraph Server
        API[Express REST API]
        Socket[Socket.io Server]
        Auth[Auth Middleware]
    end

    subgraph Services
        DB[(MongoDB Atlas)]
        AI[Gemini AI]
        Cloud[Cloudinary]
    end

    UI -->|HTTP| API
    UI -->|WS| Socket
    Stream --> RTC_C
    RTC_C <-->|P2P Video| RTC_C
    
    API -->|Auth| Auth
    API -->|Data| DB
    API -->|Generate| AI
    API -->|Store Media| Cloud
    
    Socket -->|Signaling| API
```

## 🔄 User Flow

```mermaid
journey
    title User Interview Journey
    section Onboarding
      Sign Up/Login: 5: User
      Complete Profile: 4: User
    section Preparation
      Upload Resume: 5: User
      Select Role & Skills: 5: User
    section Interview
      Enter Lobby: 4: User
      Connect Audio/Video: 3: User, System
      Answer AI Questions: 5: User, AI
      Receive Real-time Feedback: 5: AI
    section Review
      View Analysis Score: 5: User
      Check Transcript: 4: User
      Download Report: 5: User
```

## ⚡ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **MongoDB**: Local URI or Atlas Connection String

### 📥 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/akhilthirunalveli/MockMate.git
   cd MockMate
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### 🔑 Environment Variables

You need to create a `.env` file in **both** the `frontend` and `backend` directories.

#### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (e.g., 5000) |
| `MONGO_URI` | MongoDB Connection String |
| `JWT_SECRET` | Secret key for JWT signing |
| `GEMINI_API_KEY` | Google Gemini AI API Key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Name |
| `CLOUDINARY_API_KEY` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret |

#### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_BASE_URL` | Backend API URL (e.g., http://localhost:5000) |
| `VITE_FIREBASE_API_KEY` | Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_METERED_USERNAME` | Metered Turn Server Username (Optional) |
| `VITE_METERED_CREDENTIAL` | Metered Turn Server Credential (Optional) |

### 🚀 Running the App

 **Run both Servers Concurrently (Recommended if configured)**
   ```bash
   # From root if concurrently is set up, otherwise run separate terminals:
   ```

**Terminal 1 (Backend)**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend)**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` to view the application.


Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <p>Made with ❤️ by the Akhil </p>
</div>
