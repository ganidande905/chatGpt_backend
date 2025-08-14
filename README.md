# 🖥️ ChatGPT Clone Backend (Node.js)

This is the **backend** for my Flutter-powered ChatGPT clone.  
It handles the AI magic, conversation storage, model switching, and (soon) image uploads.  
Right now it’s running locally — deployment to Azure with Docker is planned.

---

## 📌 Features Implemented
- **OpenAI API Integration** – Uses Chat Completion API for generating contextual responses.
- **Chat History Storage** – Saves and retrieves conversations from **MongoDB**:
  - Conversation ID
  - Timestamp
  - Messages
  - Model used
  - (Image metadata – planned)
- **Model Selection** – Passes the selected model dynamically to OpenAI.
- **Security** – API keys stored in environment variables.
- **Validation** – Prevents empty messages and ensures data integrity.
- **Dockerized** – Ready to run in containers for easy deployment.

---

## 🚧 Not Done Yet (Coming Soon)
- **Image Uploads** – Cloudinary integration scaffolded but disabled (breaking the code earlier).  
  Will finish once I get fully comfortable with Cloudinary’s workflow.
- **HTTPS** – Currently HTTP only; HTTPS will be configured once deployed to Azure.
- **Frontend Error Handling** – Backend is ready, frontend will catch up.
- **Live Deployment** – Docker setup is ready, Azure plan is in place — will be up soon.

---

## 🛠 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Cloud Storage** (planned): Cloudinary
- **API**: OpenAI Chat Completion API
- **Environment Config**: dotenv
- **Containerization**: Docker

---

