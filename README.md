# 🔥 Real-time Chat App

This is a **real-time chat application** built with [Next.js](https://nextjs.org), powered by [Firebase](https://firebase.google.com) for authentication and real-time messaging. The app provides a seamless chatting experience with instant message updates, user authentication, and responsive design.

## ✨ Features

- 🔐 Firebase Authentication (Google, Email/Password, or Anonymous)
- 💬 Real-time messaging using Firebase Firestore
- 🟢 Online status indicators
- 📱 Fully responsive UI
- 🕓 Timestamps and auto-scroll chat view


## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org)
- **Backend/Realtime DB:** [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Auth:** [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Hosting:** [Vercel](https://vercel.com)
- **Styling:** Tailwind CSS / CSS Modules *(adjust if you use one)*

## 🧑‍💻 Getting Started

### 1. Clone the repository:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
yarn install
yarn dev
```

### 2.  Set up Firebase:
- Create a Firebase project at console.firebase.google.com.
- Enable Firestore and Authentication (Google, Email/Password, or Anonymous).
- Go to Project Settings → General → Add a Web App.
- Copy your Firebase config and create a .env.local file
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3.  Run the Project:
```bash
yarn dev
```

## 🚀 Project Structure
```
/
├─ app/chat//                 # App directory (Next.js 13+)
│  ├─ page.tsx          # Main chat page
│  ├─ layout.tsx        # App layout
├─ components/          # Reusable components (ChatBox, MessageInput, etc.)
├─ firebase/            # Firebase initialization config
├─ styles/              # Global styles (if any)
├─ .env.local           # Firebase env vars
├─ next.config.js       # Next.js config
└─ README.md

```

## 📚 Resources
- [Next.js](https://nextjs.org/docs)
- [Firebase](https://firebase.google.com/docs)
- [TailwindCSS](https://tailwindcss.com/docs/installation/using-vite)