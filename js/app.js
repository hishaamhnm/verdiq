
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

// initialize FIRST
firebase.initializeApp(firebaseConfig);

// THEN create db + auth
const auth = firebase.auth();
const db = firebase.firestore();


// =======================
// SIGNUP FUNCTION
// =======================
function signup() {

  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {

      // create wallet
      const user = userCredential.user;

      firebase.firestore().collection("wallets").doc(user.uid).set({
        credits: 0,
        co2: 0
      });

      // ✅ SUCCESS POPUP
      alert("Successfully signed up!");

      // redirect
      window.location.href = "dashboard.html";

    })
    .catch((error) => {
      alert(error.message);
    });

}

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {

      const user = userCredential.user;

      // CREATE WALLET
      db.collection("wallets").doc(user.uid).set({
        credits: 0,
        co2: 0
      });

      window.location.href = "dashboard.html";

    })
    .catch(err => alert(err.message));
}


// =======================
// LOGIN FUNCTION
// =======================
function login() {

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(err => alert(err.message));
}


// =======================
// LOGOUT FUNCTION
// =======================
function logout() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}


// =======================
// DASHBOARD LOAD (FIXED)
// =======================
auth.onAuthStateChanged(async user => {

  if (!user) {
    if (window.location.pathname.includes("dashboard")) {
      window.location.href = "login.html";
    }
    return;
  }

  // SHOW EMAIL
  const emailEl = document.getElementById("user-email");
  if (emailEl) emailEl.innerText = user.email;

  const walletRef = db.collection("wallets").doc(user.uid);

  // CREATE WALLET IF NOT EXISTS
  const doc = await walletRef.get();

  if (!doc.exists) {
    await walletRef.set({
      credits: 0,
      co2: 0
    });
  }

  // LIVE WALLET LISTENER
  walletRef.onSnapshot(snapshot => {

    const data = snapshot.data();
    if (!data) return;

    const credits = data.credits || 0;
    const co2 = data.co2 || 0;

    
// 💱 NEW RULE: 100 CC = 1QAR
const valueInQAR = (credits / 100) 

// update UI
const valueEl = document.getElementById("wallet-value");
if (valueEl) {
  valueEl.innerText = valueInQAR.toFixed(2) + " QAR";
}

    const creditsEl = document.getElementById("credits");
    const co2El = document.getElementById("co2");
    const mainCreditsEl = document.getElementById("main-credits");
    const mainCo2El = document.getElementById("main-co2");

    if (creditsEl) creditsEl.innerText = "Credits: " + credits;
    if (co2El) co2El.innerText = co2 + " kg";

    if (mainCreditsEl) mainCreditsEl.innerText = credits + " CC";
    if (mainCo2El) mainCo2El.innerText = co2 + " kg";

  });

});


// =======================
// ADD CREDITS (WORKING FIXED VERSION)
// =======================
function addCredits(amount) {

  const user = auth.currentUser;

  if (!user) {
    alert("Not logged in");
    return;
  }

  const ref = db.collection("wallets").doc(user.uid);

  ref.get().then(doc => {

    if (!doc.exists) {

      return ref.set({
        credits: amount,
        co2: amount * 0.4
      });

    }

    return ref.update({
      credits: firebase.firestore.FieldValue.increment(amount),
      co2: firebase.firestore.FieldValue.increment(amount * 0.4)
    });

  }).catch(err => {
    console.error(err);
    alert("Error updating credits");
  });

}
