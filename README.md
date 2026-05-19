# 🌱 Verdiq – Carbon Credit Wallet System

Verdiq is a sustainability-focused web application that gamifies eco-friendly living. By rewarding users with **Carbon Credits (CC)** for positive environmental actions—such as utilizing public transport, recycling, walking, and energy conservation—Verdiq empowers individuals to track their personal impact and manage their rewards in a secure, real-time digital wallet.

---

## 🚀 Key Features

- **Secure Authentication:** User management powered by **Firebase Authentication**.
- **Real-time Wallet:** Track carbon credit balances instantly using **Firebase Firestore**.
- **Robust Data Architecture:** Utilizes **Supabase (PostgreSQL)** for historical action logging, analytics, and complex data management.
- **Currency Conversion:** Integrated conversion system: `100 CC = 1 QAR`.
- **Premium UI:** Dark-mode aesthetic featuring glassmorphism and dynamic page-specific backgrounds.

---

## 🛠 Tech Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

---

## 🧠 Workflow

1. **Onboarding:** Users authenticate via Firebase.
2. **Wallet:** A wallet is initialized for every user in Firestore.
3. **Engagement:** Users log actions (Walking, Recycling, etc.) which triggers updates in both Firestore (for live UI) and Supabase (for history/analytics).
4. **Analytics:** The dashboard calculates total impact and QAR value in real-time.

---

## 📁 Project Structure

```text
/
├── index.html           # Login/Landing Page
├── dashboard.html       # User Dashboard & Balance
├── rewards.html         # Redemption Store
├── js/
│   ├── app.js           # Firestore integration & UI logic
│   ├── supabase.js      # Supabase client & DB interactions
│   └── auth.js          # Authentication handlers
├── css/
│   └── style.css        # Global branding & dynamic background classes
└── images/              # Background assets
