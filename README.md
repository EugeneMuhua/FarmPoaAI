# FarmPoa AI — Agri Lens

Lightweight frontend-first web app for crop, soil and livestock visual analysis. Agri Lens helps farmers and agronomists inspect plant health, identify common issues (pests, nutrient deficiencies), and get actionable guidance from image uploads and simple ML/heuristic pipelines.

## 🚜 Key Features

### 🧪 **1. AI Plant Disease Diagnosis**

* Upload an image or capture using the device camera

* Fast on-device inference with TensorFlow.js (with optional cloud fallback)

* Intelligent disease classification

* Active learning pipeline for continuous improvement

### 💬 **2. AI Chat Assistant**

* Conversational AI trained for African agriculture

* Provides recommendations with safety warnings

* Supports English + local languages

* Context-aware responses

### 🔐 **3. Authentication**

* Supabase Auth (Google / Email & Password)

### 🗺️ **4. Maps & Agro-Shop Locator**

* Google Maps integration

* Allows farmers to find agro-shops, vets, agronomists, input suppliers

### 🛒 **5. Marketplace & Mobile Payments**

* Product listing experience

* Secure payment integration with **Flutterwave** (supports M-Pesa)

### 🧑‍🌾 **6. Farmer Profile & Settings**

* User preferences

* Language selection

* Activity log

* Saved diagnoses

### 📤 **7. Opt-in Data Sharing for Model Training**

* Farmers can allow their diagnosis images to improve the AI model

* Full privacy control & security

## Project architecture

- src/ — React + TypeScript application code (components, hooks, pages)
- src/lib — shared utilities (e.g., cn/clsx helper)
- public/ — static assets
- vite config — bundler and dev server
  
  

## Prerequisites

- Node.js 16+ (or matching your project's engines)
- npm, yarn or pnpm
- Windows: use PowerShell or CMD as appropriate

## Quick start (development)

1. Clone the repository:
   git clone <YOUR_GIT_URL>
2. Enter the project folder:
   cd agri-lens-ai-71
3. Install dependencies:
   npm install
4. Start dev server:
   npm run dev
5. Build production bundle:
   npm run build
6. Preview production build locally:
   npm run preview



## Screenshots

![s2](C:\Users\HP\Desktop\FarmPoaAI\s2.png)

## 

![s1](C:\Users\HP\Desktop\FarmPoaAI\s1.png)



![s3](C:\Users\HP\Desktop\FarmPoaAI\s3.png)

## ![s4](C:\Users\HP\Desktop\FarmPoaAI\s4.png)

![s5](C:\Users\HP\Desktop\FarmPoaAI\s5.png)

## Project Structure

agri-lens-ai-71/

├─ .gitignore

├─ README.md

├─ package.json

├─ tsconfig.json

├─ tsconfig.app.json

├─ vite.config.ts

├─ postcss.config.cjs

├─ tailwind.config.cjs

├─ public/

│  └─ favicon.ico

├─ src/

│  ├─ main.tsx

│  ├─ index.css

│  ├─ App.tsx

│  ├─ types/                # custom ambient declarations

│  │  └─ global.d.ts

│  ├─ lib/

│  │  ├─ utils.ts

│  │  └─ api.ts

│  ├─ components/

│  │  ├─ ui/                # shadcn-ui-like components

│  │  │  └─ Button.tsx

│  │  └─ ImageUploader.tsx

│  ├─ hooks/

│  │  └─ useImageAnalysis.ts

│  ├─ pages/

│  │  ├─ Home.tsx

│  │  ├─ Analysis.tsx

│  │  └─ SoilGuide.tsx

│  ├─ assets/

│  │  └─ images/

│  └─ styles/

│     └─ variables.css

├─ public/

│  └─ index.html

├─ scripts/

│  └─ analyze-sample.sh

└─ .vscode/

   └─ settings.json



## Security & privacy

At **FarmPoa AI**, your privacy and data security are our top priority.  
We understand that the images, information, and personal details you share are sensitive, and we are fully committed to protecting them.

### **How We Protect Your Data**

* **No personal data is ever sold, shared, or misused.**

* All user accounts and interactions are protected using **Supabase Auth**, ensuring secure login and encrypted data transmission.

* Uploaded images are **fully encrypted** in storage.

* Only **you** control whether your images can be used to improve the AI model.

* When participating in training, all data is **anonymized**—your identity is never linked to shared images.

* We follow strict **Role-Based Access Control (RLS)** and enforce security rules at the database level.

* Cloud AI requests are processed through servers protected by **industry-grade encryption** and monitoring.

### **Your Control**

You always have full control over your data:

* You can delete your account at any time.

* You can opt-in or opt-out of data sharing anytime.

* You decide what information the app can store or use.

## License

This project is property of FarmPoaAI. 

## Contact

For questions or support contact

📧 **eugenemuhua@gmail.com**  
📱 **+254713797350**

📧 **edgeriowilliams@gmail.com**

📱 **+254705810636**


