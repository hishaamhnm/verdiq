🌱 Verdiq – Carbon Credit Wallet System
Verdiq is a sustainability-focused web application that gamifies eco-friendly living. By rewarding users with Carbon Credits (CC) for positive environmental actions—such as utilizing public transport, recycling, walking, and energy conservation—Verdiq empowers individuals to track their personal impact and manage their rewards in a secure, real-time digital wallet.

🚀 Key Features
Secure Authentication: User management powered by Firebase Authentication.

Real-time Digital Wallet: Track your carbon credit balance instantly using Firebase Firestore.

Robust Data Architecture: Utilizes Supabase (PostgreSQL) for historical action logging, analytics, and complex data management.

Eco-Action Tracking: Intuitive interface to log sustainable behaviors.

Currency Conversion: Integrated conversion system to visualize environmental impact in monetary terms (QAR).

Responsive UI: A premium, dark-mode aesthetic featuring glassmorphism and page-specific dynamic backgrounds.

💱 Conversion System
Verdiq uses a transparent conversion rate to help users realize the tangible value of their environmental contributions:

100 CC = 1 QAR

⚙️ Tech Stack
Frontend: HTML5, CSS3, JavaScript (ES6+)

Authentication: Firebase Authentication

Backend & Database:

Firebase Firestore: Real-time data sync for the user wallet.

Supabase: Relational data storage, historical activity logging, and structured analytics.

Design: Custom CSS, Glassmorphism, and dynamic background styling.

🧠 Workflow
Onboarding: Users sign up or log in via Firebase Authentication.

Initialization: A wallet document is mapped to the user in Firestore upon first login.

Engagement: Users click predefined "Eco-Action" buttons to earn credits.

Data Synchronization:

Firestore updates the real-time balance on the dashboard.

Supabase records the action in a relational database for long-term tracking and analytics.

Analytics: The UI dynamically calculates the equivalent QAR value based on the current CC balance.

📁 Project Structure
Plaintext
/
├── index.html           # Login/Landing Page
├── dashboard.html       # User Dashboard & Balance
├── rewards.html         # Redemption Store
├── js/
│   ├── app.js           # Main logic & Firestore integration
│   ├── supabase.js      # Supabase client & DB interactions
│   └── auth.js          # Authentication handlers
├── css/
│   └── style.css        # Global branding & page-specific backgrounds
└── images/              # Background assets (login-bg.jpg, dash-bg.jpg, etc.)
🛠 Setup & Configuration
Firebase: Update the firebaseConfig object in js/app.js with your project credentials from the Firebase Console.

Supabase: Configure your supabaseClient in js/supabase.js using your project URL and public API key.

Assets: Ensure all background images are placed in the /images folder to ensure the dynamic background system functions correctly.

Deployment: Deploy using Firebase Hosting to maintain seamless real-time connectivity.

Built with passion for a greener, more sustainable future. 🌍
