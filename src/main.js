// Data Structure for the Library
const libraryData = {
  boards: ["CBSE", "ICSE", "Bihar Board", "UP Board", "NIOS", "Competition", "General Books", "Other Boards"],
  classes: {
    "CBSE": ["12th", "11th", "10th", "9th", "8th", "6th-7th", "1st-5th"],
    "ICSE": ["12th", "11th", "10th", "9th", "8th", "1st-7th"],
    "Bihar Board": ["12th", "10th", "9th", "Other"],
    "UP Board": ["12th", "10th", "9th", "Other"],
    "NIOS": ["Secondary (10th)", "Sr. Secondary (12th)", "Vocational"],
    "Competition": ["UPSC", "SSC", "Banking", "Railway", "NEET/JEE", "Police/Defense", "CUET"],
    "General Books": ["Novels", "Self Help", "Religious", "Dictionary", "Stationery"],
    "Other Boards": ["Rajasthan Board", "MP Board", "Haryana Board", "Uttarakhand Board"]
  },
  subjects: {
    "12th": ["Physics", "Chemistry", "Maths", "Biology", "Accounts", "Economics", "History", "Hindi", "English"],
    "11th": ["Physics", "Chemistry", "Maths", "Biology", "Accounts", "Economics", "History", "Hindi", "English"],
    "10th": ["Science", "Maths", "Social Science", "Hindi", "English", "Sanskrit"],
    "9th": ["Science", "Maths", "Social Science", "Hindi", "English"],
    "Secondary (10th)": ["Hindi (201)", "English (202)", "Maths (211)", "Science (212)", "Social Science (213)"],
    "Sr. Secondary (12th)": ["Hindi (301)", "English (302)", "Maths (311)", "Physics (312)", "Chemistry (313)", "Biology (314)"],
    "UPSC": ["General Studies", "History Optional", "Geography Optional", "CSAT", "Current Affairs"],
    "SSC": ["Maths", "Reasoning", "English", "General Awareness"],
    "CUET": ["Section I (Languages)", "Section II (Domain)", "Section III (General Test)"],
    "Novels": ["Hindi Novels", "English Classics", "Best Sellers"],
    "Religious": ["Gita", "Ramayan", "Hanuman Chalisa", "Other"]
  },
  mediums: ["English Medium", "Hindi Medium", "Other"]
};

// Selection State
let currentSelection = {
  board: "",
  class: "",
  subject: "",
  medium: ""
};

// Wizard Logic
const updateWizard = (step) => {
  const container = document.getElementById('wizard-container');
  if (!container) return;

  const steps = ['board', 'class', 'subject', 'medium'];
  const currentIndex = steps.indexOf(step);
  
  // Progress Bar HTML
  const progressHtml = `
    <div class="wizard-progress">
      ${steps.map((s, i) => `
        <div class="progress-step ${i <= currentIndex ? 'active' : ''}">
          <div class="step-dot"></div>
          <span class="step-label">${s.charAt(0).toUpperCase() + s.slice(1)}</span>
        </div>
        ${i < steps.length - 1 ? `<div class="progress-line ${i < currentIndex ? 'active' : ''}"></div>` : ''}
      `).join('')}
    </div>
  `;

  let contentHtml = "";
  
  if (step === 'board') {
    contentHtml = `<h4 class="step-title">Select Board / Category</h4>
            <div class="wizard-grid">
              ${libraryData.boards.map(b => `<button class="wiz-btn" onclick="setBoard('${b}')"><span>${b}</span></button>`).join('')}
            </div>`;
  } else if (step === 'class') {
    const classes = libraryData.classes[currentSelection.board] || ["General"];
    contentHtml = `<h4 class="step-title">Select Class / Level</h4>
            <div class="wizard-grid">
              ${classes.map(c => `<button class="wiz-btn" onclick="setClass('${c}')"><span>${c}</span></button>`).join('')}
              <button class="wiz-btn btn-back" onclick="updateWizard('board')"><span>← Back</span></button>
            </div>`;
  } else if (step === 'subject') {
    const subjects = libraryData.subjects[currentSelection.class] || libraryData.subjects[currentSelection.board] || ["All Subjects"];
    contentHtml = `<h4 class="step-title">Select Subject</h4>
            <div class="wizard-grid">
              ${subjects.map(s => `<button class="wiz-btn" onclick="setSubject('${s}')"><span>${s}</span></button>`).join('')}
              <button class="wiz-btn btn-back" onclick="updateWizard('class')"><span>← Back</span></button>
            </div>`;
  } else if (step === 'medium') {
    contentHtml = `<h4 class="step-title">Select Medium</h4>
            <div class="wizard-grid">
              ${libraryData.mediums.map(m => `<button class="wiz-btn" onclick="setMedium('${m}')"><span>${m}</span></button>`).join('')}
              <button class="wiz-btn btn-back" onclick="updateWizard('subject')"><span>← Back</span></button>
            </div>`;
  }

  container.innerHTML = `
    <div class="wizard-wrapper animate-fade-in">
      ${progressHtml}
      <div class="wizard-content">
        ${contentHtml}
      </div>
    </div>
  `;
};

// Global Selection Functions
window.setBoard = (board) => {
  currentSelection.board = board;
  updateWizard('class');
};

window.setClass = (cls) => {
  currentSelection.class = cls;
  updateWizard('subject');
};

window.setSubject = (sub) => {
  currentSelection.subject = sub;
  updateWizard('medium');
};

window.setMedium = (med) => {
  currentSelection.medium = med;
  const textarea = document.getElementById('books');
  textarea.value = `Order Details:\nBoard: ${currentSelection.board}\nClass/Level: ${currentSelection.class}\nSubject: ${currentSelection.subject}\nMedium: ${currentSelection.medium}`;
  
  document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
  textarea.focus();
  
  // Highlight the form
  const form = document.querySelector('.whatsapp-form');
  form.style.borderColor = "#FF6B00";
  setTimeout(() => form.style.borderColor = "", 2000);
  
  // Reset wizard
  updateWizard('board');
};

// Performance: Lazy load Firebase
let dbPromise = null;
const initFirebase = async () => {
  if (dbPromise) return dbPromise;
  dbPromise = (async () => {
    const { initializeApp } = await import("firebase/app");
    const { getFirestore, collection, addDoc, serverTimestamp } = await import("firebase/firestore");
    const firebaseConfig = {
      apiKey: "AIzaSyCEyYWfOIWH_7Y3lOGE_jM9dYiM3Ctr6Hc",
      authDomain: "gen-lang-client-0444919395.firebaseapp.com",
      projectId: "gen-lang-client-0444919395",
      storageBucket: "gen-lang-client-0444919395.firebasestorage.app",
      messagingSenderId: "298029099413",
      appId: "1:298029099413:web:0c2c4bc75393af8f9cee9c"
    };
    const app = initializeApp(firebaseConfig);
    return { db: getFirestore(app), collection, addDoc, serverTimestamp };
  })();
  return dbPromise;
};

// Navbar Logic
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}, { passive: true });

// Form Submission
const orderForm = document.getElementById('orderForm');
if (orderForm) {
  orderForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const books = document.getElementById('books').value;
    const address = document.getElementById('address').value;
    
    const whatsappNumber = "919350627196";
    const text = `*Jai Maa Pustak Bhandar - New Order*\n\n` +
                 `*Name:* ${name}\n` +
                 `*Phone:* ${phone}\n` +
                 `*Books:* ${books}\n` +
                 `*Address:* ${address}\n\n` +
                 `_Sent via Website_`;
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');

    try {
      const { db, collection, addDoc, serverTimestamp } = await initFirebase();
      addDoc(collection(db, "orders"), { name, phone, books, address, timestamp: serverTimestamp() });
    } catch (e) {}
  });
}

// Map Facade Logic for 100/100 Performance
const setupMapFacade = () => {
  const facade = document.getElementById('map-facade');
  if (facade) {
    facade.addEventListener('click', () => {
      facade.style.background = 'none';
      facade.innerHTML = `
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14008.204558509455!2d77.032081!3d28.631433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM3JzUzLjIiTiA3N8KwMDEnNTUuNSJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
          style="width:100%; height:100%; border:none;"
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade"
          title="Jai Maa Pustak Bhandar Location">
        </iframe>
      `;
    }, { once: true });
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateWizard('board');
  setupMapFacade();
  
  // Throttle scroll events for performance
  let ticking = false;
});

console.log("Jai Maa Pustak Bhandar - Multi-Step Library Active.");
