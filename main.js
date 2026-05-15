import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase configuration - REPLACE WITH YOUR ACTUAL KEYS
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Navbar Scroll Logic
const navbar = document.getElementById('navbar');
window.onscroll = () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};

// Set Hero Image
const heroImg = document.getElementById('hero-img');
if (heroImg) {
    heroImg.src = "/bookstore_hero.png"; 
}

// Function to log an event to Firebase
async function logOrderClick() {
  try {
    const docRef = await addDoc(collection(db, "interactions"), {
      type: "order_button_click",
      timestamp: new Date()
    });
    console.log("Interaction logged with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// Attach event listeners to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (btn.innerText.includes("Place Order")) {
            logOrderClick();
        }
    });
});

console.log("Jai Maa Pustak Bhandar Site Initialized.");
