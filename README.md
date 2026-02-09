# <img src="frontend/public/Logo.svg" width="32" height="32" /> MockMate: AI-Powered Interview Excellence

[![Live Demo](https://img.shields.io/badge/Live-Demo-white?style=for-the-badge&logo=vercel&logoColor=black)](https://mockmateapp.vercel.app)

![Mockmate Intro](assets/Mockmate%20-%20Intro.gif)

MockMate is a cutting-edge platform designed to bridge the gap between preparation and performance. By leveraging the power of **Google Gemini**, MockMate provides real-time, personalized interview practice, ATS-compliant resume analysis, and a suite of tools to help you land your dream job with confidence.

---

## The Innovation Stack

```mermaid
graph TD
    subgraph "The Intelligence (AI)"
        GE["Google Gemini "]
        NLP["Natural Language Processing"]
    end

    subgraph "The Engine (Backend)"
        NO["Node.js / Express"]
        DB[("MongoDB Atlas")]
        SK["Socket.io (Realtime)"]
    end

    subgraph "The Experience (Frontend)"
        RE["React 18 / Vite"]
        FM["Framer Motion"]
        TW["Tailwind CSS"]
    end

    GE <--> NO
    NLP <--> NO
    NO <--> DB
    NO <--> SK
    SK <--> RE
    RE <--> FM
    RE <--> TW
```



## The Walkthrough Timeline

Follow the journey of an aspiring candidate using MockMate to master their next interview.

### Phase 1: Preparation (Context is Key)
Before jumping into a seat, you need to define your targets. MockMate allows you to create specialized practice sessions based on specific job roles and company cultures.

![Create Session](assets/Session%20-%20CreateSession.png)
![Interview Prep](assets/Session%20-%20InterviewPrep.png)

### Phase 2: Practice (The Arena)
Practice makes perfect. Choose between HR-style behavioral rounds, session-specific technical drills, or the high-intensity **Live Interview** mode.

![Practice Selection](assets/Interview%20-%20InterviewType.png)
![HR Practice](assets/Interview%20-%20HRInterview.png)
![Live Practice](assets/Interview%20-%20LiveInterview.png)

### Phase 3: Analysis (The Feedback Loop)
Your resume is your gateway. Use our Bento-style resume workspace to manage your source links, get AI-powered improvement tips, and run an ATS analysis against your target roles.

![ATS Analysis](assets/Resume%20-%20ATSUploadPage.png)
![ATS Report](assets/Resume%20-%20ATSReport.png)
![Bento Resume View](assets/Resume%20-%20ViewResume.png)

### Phase 4: Management (Admin Control)
For administrators, the control center provides a bird's-eye view of users, sessions, and system-wide communications via broadcasts and dynamic toasts.

![Admin Console](assets/AdminDashboard.png)
![Toast Management](assets/AdminToast.png)
![Broadcasting](assets/AdminBroadcastMessage.png)
### Phase 5: Coaching (CoachMate)
Your personal AI career companion. CoachMate provides real-time guidance, interview tips, and ATS resume advice in a conversational interface. It's designed to be your supportive placement friend, keeping you motivated and prepared.

<p align="center">
  <img src="assets/Coachmate-%20WelcomeChat.png" width="45%" />
  <img src="assets/Coachmate-%20Chat.png" width="45%" />
</p>



## System Architecture

### User Flow Diagram
```mermaid
graph TD
    Start[Landing Page] --> Auth{Auth Status}
    Auth -- New --> SignUp[Sign Up]
    Auth -- Returning --> Login[Login]
    SignUp --> Dashboard[Dashboard]
    Login --> Dashboard
    
    Dashboard --> Prep[Session Prep]
    Prep --> Practice[Interview Practice]
    Practice --> AIFeedback[AI Feedback & Analysis]
    AIFeedback --> Dashboard
    
    Dashboard --> Resume[Bento Resume Workspace]
    Resume --> ATS[ATS Scoring]
    ATS --> Dashboard
    
    Dashboard -- Admin Only --> Admin[Admin Console]
```

### High-Level Architecture
```mermaid
graph LR
    subgraph "Frontend (Vite)"
        UI[React Components]
        Context[User/Session Context]
        SocketClient[Socket.io Client]
    end

    subgraph "Backend (Node/Express)"
        API[Rest Endpoints]
        SocketServer[Socket.io Server]
        AIController[Gemini AI Controller]
    end

    subgraph "Infrastructure"
        DB[(MongoDB Atlas)]
        Cloud[Cloudinary]
        AI[Google Gemini 1.5]
    end

    UI <--> Context
    UI <--> API
    SocketClient <--> SocketServer
    API <--> AIController
    AIController <--> AI
    API <--> DB
    API <--> Cloud
```



## Want to Clone this project? 

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Google Gemini API Key
- Cloudinary Account (for resume/asset storage)

### Installation

1. **Clone the project**
   ```bash
   git clone https://github.com/akhilthirunalveli/MockMate.git
   cd MockMate
   ```

2. **Backend Configuration**
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

3. **Frontend Configuration**
   ```bash
   cd ../frontend
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

<p align="center">Made by Akhil Thirunalveli</p>
