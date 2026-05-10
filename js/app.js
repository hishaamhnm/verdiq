
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


// =======================
// INIT FIREBASE (IMPORTANT ORDER)
// =======================
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();


// =======================
// SIGNUP
// =======================
function signup() {

  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {

      const user = userCredential.user;

      // create wallet
      db.collection("wallets").doc(user.uid).set({
        credits: 0,
        co2: 0
      });

      alert("Successfully signed up!");

      window.location.href = "dashboard.html";

    })
    .catch(error => {
      alert(error.message);
    });
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
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      alert(error.message);
    });
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

  const emailEl = document.getElementById("user-email");
  if (emailEl) emailEl.innerText = user.email;

  const walletRef = db.collection("wallets").doc(user.uid);

  walletRef.onSnapshot(doc => {

    if (!doc.exists) return;

    const data = doc.data();

    const credits = data.credits || 0;
    const co2 = data.co2 || 0;

    const valueInQAR = credits / 100;

    // update UI safely
    if (document.getElementById("credits"))
      document.getElementById("credits").innerText = "Credits: " + credits;

    if (document.getElementById("co2"))
      document.getElementById("co2").innerText = co2 + " kg";

    if (document.getElementById("main-credits"))
      document.getElementById("main-credits").innerText = credits + " CC";

    if (document.getElementById("main-co2"))
      document.getElementById("main-co2").innerText = co2 + " kg";

    if (document.getElementById("wallet-value"))
      document.getElementById("wallet-value").innerText = valueInQAR.toFixed(2) + " QAR";

  });

});


// =======================
// ADD CREDITS
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

  }).catch(error => {
    console.error(error);
    alert("Error updating credits");
  });

}
