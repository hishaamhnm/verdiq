// =======================
// FIREBASE CONFIG
// =======================
const firebaseConfig = {
  apiKey: "AIzaSyB_uVlAtS3vGHfbYnWTCTh25sMz7AEjfak",
  authDomain: "verdiq-8abd4.firebaseapp.com",
  projectId: "verdiq-8abd4",
  storageBucket: "verdiq-8abd4.firebasestorage.app",
  messagingSenderId: "318588137512",
  appId: "1:318588137512:web:f162d7344f3b741869851d"
};

// INIT FIREBASE
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// =======================
// SUPABASE
// =======================
const supabaseUrl = "https://bxcjsrqmpzvihnzntrss.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Y2pzcnFtcHp2aWhuem50cnNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxOTkxMjAsImV4cCI6MjA5NDc3NTEyMH0.kZFxiTW6Jqsd4yEmSxg8PrvMV_OrLuDvbL3xqh3S90A";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// =======================
// SIGNUP
// =======================
function signup() {
  const name = document.getElementById("signup-name").value;
  const dob = document.getElementById("signup-dob").value;
  const phone = document.getElementById("signup-phone").value;
  const qid = document.getElementById("signup-qid").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!name || !dob || !phone || !qid || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;

      return db.collection("users").doc(user.uid).set({
        name,
        dob,
        phone,
        qid,
        email
      }).then(() => {
        return db.collection("wallets").doc(user.uid).set({
          credits: 0,
          co2: 0
        });
      });
    })
    .then(() => {
      alert("Successfully signed up!");
      window.location.href = "dashboard.html";
    })
    .catch(err => alert(err.message));
}

// =======================
// LOGIN
// =======================
function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => window.location.href = "dashboard.html")
    .catch(err => alert(err.message));
}

// =======================
// LOGOUT
// =======================
function logout() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}

// =======================
// DASHBOARD LOAD
// =======================
auth.onAuthStateChanged(user => {

  if (!user) return;

  // EMAIL
  const emailEl = document.getElementById("user-email");
  if (emailEl) emailEl.innerText = user.email;

  // NAME
  db.collection("users").doc(user.uid).get()
    .then(doc => {
      if (!doc.exists) return;

      const data = doc.data();
      const nameEl = document.getElementById("user-name");

      if (nameEl) nameEl.innerText = data.name || "No name";
    });

  // WALLET LIVE UPDATE
const walletRef = db.collection("wallets").doc(user.uid);

walletRef.onSnapshot(doc => {
  if (!doc.exists) return;

  const data = doc.data();

  const credits = data.credits || 0;
  const co2 = data.co2 || 0;
  const valueInQAR = credits / 100;

  // SIDEBAR
  const creditsEl = document.getElementById("credits");
  if (creditsEl) creditsEl.innerText = "Credits: " + credits;

  // 🟢 FIXED: Force CO2 to round cleanly to a whole number
  const co2El = document.getElementById("co2");
  if (co2El) co2El.innerText = Number(co2).toFixed(0) + " kg";

  // MAIN
  const mainCredits = document.getElementById("main-credits");
  if (mainCredits) mainCredits.innerText = credits + " CC";

  // 🟢 FIXED: Force CO2 to round cleanly to a whole number here too
  const mainCO2 = document.getElementById("main-co2");
  if (mainCO2) mainCO2.innerText = Number(co2).toFixed(0) + " kg";

  const walletValue = document.getElementById("wallet-value");
  if (walletValue) walletValue.innerText = valueInQAR.toFixed(2) + " QAR";


    // =======================
    // CHART (SAFE INSIDE)
    // =======================
    const ctx = document.getElementById("ecoChart");

    if (ctx) {
      if (window.ecoChartInstance) {
        window.ecoChartInstance.destroy();
      }

      window.ecoChartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Credits", "CO₂"],
          datasets: [{
            label: "Eco Progress",
            data: [credits, co2],
            borderColor: "#8cffb0",
            backgroundColor: "rgba(140,255,176,0.2)",
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        }
      });
    }

  });
});

// =======================
// ADD CREDITS (ANTI-CHEAT)
// =======================
const lastActionTime = {};

const co2Values = {
  transport: 2.5,
  recycling: 1.2,
  walking: 3.0,
  energy: 2.0,
  purchase: 1.5
};

function addCredits(amount, type) {

  const user = auth.currentUser;
  if (!user) return alert("Not logged in");

  const now = Date.now();

  if (lastActionTime[type] && now - lastActionTime[type] < 10000) {
    return alert("Wait before doing this again");
  }

  lastActionTime[type] = now;

  const co2Saved = co2Values[type] || 1;

  db.collection("wallets").doc(user.uid).update({
    credits: firebase.firestore.FieldValue.increment(amount),
    co2: firebase.firestore.FieldValue.increment(co2Saved)
  });
}

// =======================
// RESET PASSWORD
// =======================
function resetPassword() {
  const email = document.getElementById("reset-email").value;

  if (!email) return alert("Enter email");

  auth.sendPasswordResetEmail(email)
    .then(() => {
      alert("Reset link sent");
      window.location.href = "login.html";
    })
    .catch(err => alert(err.message));
}

// =======================
// REDEEM SYSTEM
// =======================
function redeem(type, cost) {

  const user = auth.currentUser;
  if (!user) return;

  const ref = db.collection("wallets").doc(user.uid);

  ref.get().then(doc => {
    const data = doc.data();
    const credits = data.credits || 0;

    if (credits < cost) {
      showRedeem("error", "Not enough credits");
      return;
    }

    ref.update({
      credits: firebase.firestore.FieldValue.increment(-cost)
    });

    showRedeem("success", "Redeemed: " + type);
  });
}

// =======================
// REDEEM SYSTEM UI MODAL
// =======================
function showRedeem(type, message) {
  const modal = document.getElementById("redeem-modal");
  const box = document.querySelector(".redeem-box");
  const icon = document.getElementById("redeem-icon");
  const title = document.getElementById("redeem-title");
  const text = document.getElementById("redeem-text");

  if (!modal) return;

  box.classList.remove("error");

  if (type === "error") {
    box.classList.add("error");
    icon.innerText = "✖";
    title.innerText = "Failed";
  } else {
    icon.innerText = "✔";
    title.innerText = "Redeemed!";
  }

  text.innerText = message;
  modal.style.display = "flex";
}

// =======================
// UPLOAD PROOF (SUPABASE)
// =======================
function uploadRecycling() {

  const user = auth.currentUser;
  const file = document.getElementById("recycle-file")?.files[0];

  if (!user || !file) return alert("Missing file or login");

  const fileName = `${user.uid}-${Date.now()}`;

  supabaseClient.storage
    .from("proofs")
    .upload(fileName, file)
    .then(({ data, error }) => {

      if (error) return alert("Upload failed");

      const publicUrl = supabaseClient.storage
        .from("proofs")
        .getPublicUrl(fileName).data.publicUrl;

      return db.collection("proofRequests").add({
        uid: user.uid,
        imageURL: publicUrl,
        status: "pending",
        credits: 20,
        timestamp: Date.now()
      });

    })
    .then(() => {
      alert("Submitted for approval!");
      window.location.href = "dashboard.html";
    })
    .catch(err => console.log(err));
}

// =======================
// ADMIN LOAD REQUESTS
// =======================
function loadAdminRequests() {

  const list = document.getElementById("list");
  if (!list) return;

  db.collection("proofRequests")
    .where("status", "==", "pending")
    .onSnapshot(snapshot => {

      list.innerHTML = "";

      snapshot.forEach(doc => {

        const data = doc.data();

        list.innerHTML += `
          <div class="card">
            <img src="${data.imageURL}" />
            <p>${data.uid}</p>
            <p>${data.credits} credits</p>

            <button onclick="approve('${doc.id}', '${data.uid}', ${data.credits})">Approve</button>
            <button onclick="reject('${doc.id}')">Reject</button>
          </div>
        `;
      });

    });
}

// =======================
// ADMIN ACTIONS (KEEPING STORAGE ENTIRELY INTACT)
// =======================

function approve(id, uid, credits) {
  // 1. Update the request status so it clears off the admin dashboard panel
  db.collection("proofRequests").doc(id).update({
    status: "approved"
  })
  .then(() => {
    // 2. Add the credits and CO2 points safely to the user's wallet
    return db.collection("wallets").doc(uid).update({
      credits: firebase.firestore.FieldValue.increment(Number(credits)),
      co2: firebase.firestore.FieldValue.increment(5) // Adds 5kg of CO2 saved
    });
  })
  .then(() => {
    alert("Proof approved! Credits awarded successfully.");
  })
  .catch(err => {
    console.error("Error during approval:", err);
    alert("Failed to complete approval: " + err.message);
  });
}

function reject(id) {
  // Simply flag the request status as rejected to remove it from the admin layout
  db.collection("proofRequests").doc(id).update({
    status: "rejected"
  })
  .then(() => {
    alert("Proof rejected. No points were awarded, and the image remains safe in storage.");
  })
  .catch(err => {
    console.error("Error during rejection:", err);
    alert("Failed to reject entry: " + err.message);
  });
}

// 1. REAL-TIME CLOCK ROUTINE LOOP
function startDashboardClock() {
  const clockElement = document.getElementById("nav-clock");
  
  setInterval(() => {
    const now = new Date();
    // Formats cleanly as HH:MM:SS AM/PM based on system time location
    clockElement.textContent = now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }, 1000);
}

// 2. TOGGLE POPUP GUI ACTIVE VISIBILITY STATE
function toggleProfileModal() {
  const overlay = document.getElementById("profile-modal-overlay");
  overlay.classList.toggle("modal-open");
}

// 3. RETRIEVE AND POPULATE USER META FROM FIRESTORE
// Call this function right after your Firebase Auth state initializes successfully!
function loadUserProfileData(uid) {
  if (!uid) return;

  // 1. Get the logged-in user's account details from Firebase Authentication
  const currentAuthUser = firebase.auth().currentUser;

  // 2. Try to fetch additional details from your Firestore database
  db.collection("users").doc(uid).get().then(doc => {
    
    // Create a fallback name and email from what the user logged in with
    let finalName = (currentAuthUser && currentAuthUser.displayName) ? currentAuthUser.displayName : "User Account";
    let finalEmail = (currentAuthUser && currentAuthUser.email) ? currentAuthUser.email : "Not Provided";
    let finalQid = "Not Registered";
    let finalPhone = "Not Bound";
    let finalDob = "Not Provided";

    // If the user actually has a custom profile file saved in the database, grab those details instead
    if (doc.exists) {
      const userData = doc.data();
      
      // Check every common way you might have written these fields during registration
      if (userData.name) finalName = userData.name;
      if (userData.fullName) finalName = userData.fullName;
      
      if (userData.email) finalEmail = userData.email;
      
      if (userData.qid) finalQid = userData.qid;
      if (userData.QID) finalQid = userData.QID;
      
      if (userData.mobile) finalPhone = userData.mobile;
      if (userData.phone) finalPhone = userData.phone;
      if (userData.phoneNumber) finalPhone = userData.phoneNumber;
      
      if (userData.dob) finalDob = userData.dob;
      if (userData.birthDate) finalDob = userData.birthDate;
    }

    // 3. Put the text onto your web screen dashboard interface
    document.getElementById("nav-user-name").textContent = finalName;
    document.getElementById("modal-display-name").textContent = finalName;
    document.getElementById("modal-display-email").textContent = finalEmail;
    
    document.getElementById("info-profile-name").textContent = finalName;
    document.getElementById("info-profile-qid").textContent = finalQid;
    document.getElementById("info-profile-phone").textContent = finalPhone;
    document.getElementById("info-profile-dob").textContent = finalDob;

  }).catch(error => {
    console.error("Something went wrong loading the profile:", error);
  });
}

// Start tracking immediately on dashboard load sequence execution loop hooks
document.addEventListener("DOMContentLoaded", () => {
  startDashboardClock();
});

// ==========================================
// THE LOGIN SWITCH: RUNS AS SOON AS THE PAGE LOADS
// ==========================================
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("Success! User is logged in with ID:", user.uid);
    
    // 🚀 THIS FLIPS THE SWITCH AND RUNS YOUR PROFILE POPUP CODE
    loadUserProfileData(user.uid);
    
  } else {
    console.log("No user is logged in. Redirecting to login page...");
    // If they aren't logged in, kick them back to the login page safely
    window.location.href = "login.html";
  }
});

// Example logic snippet for your js/app.js file:
if (userBalance < cost) {
  const modal = document.getElementById("redeem-modal");
  
  // 1. Add the error look class
  modal.classList.add("error-state");
  
  // 2. Change the content elements to show a warning
  document.getElementById("redeem-icon").innerText = "✖"; // Switch checkmark to X
  document.getElementById("redeem-title").innerText = "Insufficient Credits";
  document.getElementById("redeem-text").innerText = "You don't have enough CC to claim this reward yet.";
  
  // 3. Make the modal appear
  modal.style.display = "flex";
}
