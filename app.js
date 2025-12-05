// Initialize Firebase using compat SDK (simpler for static sites)
const firebaseConfig = {
  apiKey: "AIzaSyCJhBArJ0njFc_7onw1_T3_JMxBIFVqq3Q",
  authDomain: "cellular-master-f2d31.firebaseapp.com",
  projectId: "cellular-master-f2d31",
  storageBucket: "cellular-master-f2d31.firebasestorage.app",
  messagingSenderId: "591380527708",
  appId: "1:591380527708:web:aabf17b5d6e7f470fb0499",
  measurementId: "G-5SHXHLRNY3"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();

// --- MODEL SEARCH INDEX (brand/model paths) ---
const modelIndex = {
  "galaxy a51": "samsung/galaxy-a51.html",
  "galaxy a52": "samsung/galaxy-a52.html",
  "galaxy a53": "samsung/galaxy-a53.html",
  "galaxy a54": "samsung/galaxy-a54.html",
  "galaxy a55": "samsung/galaxy-a55.html",
  "galaxy s20": "samsung/galaxy-s20.html",
  "galaxy s20 ultra": "samsung/galaxy-s20-ultra.html",
  "galaxy s20+": "samsung/galaxy-s20.html",
  "galaxy s21": "samsung/galaxy-s21.html",
  "galaxy s21 ultra": "samsung/galaxy-s21-ultra.html",
  "galaxy s21+": "samsung/galaxy-s21.html",
  "galaxy s22": "samsung/galaxy-s22.html",
  "galaxy s22 ultra": "samsung/galaxy-s22-ultra.html",
  "galaxy s22+": "samsung/galaxy-s22.html",
  "galaxy s23": "samsung/galaxy-s23.html",
  "galaxy s23 ultra": "samsung/galaxy-s23-ultra.html",
  "galaxy s23+": "samsung/galaxy-s23.html",
  "galaxy s24": "samsung/galaxy-s24.html",
  "galaxy s24 ultra": "samsung/galaxy-s24-ultra.html",
  "galaxy s24+": "samsung/galaxy-s24.html",
  "galaxy s25": "samsung/galaxy-s25.html",
  "galaxy s25 ultra": "samsung/galaxy-s25-ultra.html",
  "galaxy s25+": "samsung/galaxy-s25.html",
  "iphone 11": "apple/iphone-11.html",
  "iphone 11 pro": "apple/iphone-11-pro.html",
  "iphone 11 pro max": "apple/iphone-11-pro-max.html",
  "iphone 12": "apple/iphone-12.html",
  "iphone 12 mini": "apple/iphone-12-mini.html",
  "iphone 12 pro": "apple/iphone-12-pro.html",
  "iphone 12 pro max": "apple/iphone-12-pro-max.html",
  "iphone 13": "apple/iphone-13.html",
  "iphone 13 mini": "apple/iphone-13-mini.html",
  "iphone 13 pro": "apple/iphone-13-pro.html",
  "iphone 13 pro max": "apple/iphone-13-pro-max.html",
  "iphone 14": "apple/iphone-14.html",
  "iphone 14 plus": "apple/iphone-14-plus.html",
  "iphone 14 pro": "apple/iphone-14-pro.html",
  "iphone 14 pro max": "apple/iphone-14-pro-max.html",
  "iphone 15": "apple/iphone-15.html",
  "iphone 15 plus": "apple/iphone-15-plus.html",
  "iphone 15 pro": "apple/iphone-15-pro.html",
  "iphone 15 pro max": "apple/iphone-15-pro-max.html",
  "iphone 16": "apple/iphone-16.html",
  "iphone 16 plus": "apple/iphone-16-plus.html",
  "iphone 16 pro": "apple/iphone-16-pro.html",
  "iphone 16 pro max": "apple/iphone-16-pro-max.html",
  "iphone 16e gen": "apple/iphone-16e-gen.html",
  "iphone 17": "apple/iphone-17.html",
  "iphone 17 air": "apple/iphone-17-air.html",
  "iphone 17 pro": "apple/iphone-17-pro.html",
  "iphone 17 pro max": "apple/iphone-17-pro-max.html",
  "iphone 8": "apple/iphone-8.html",
  "iphone 8 plus": "apple/iphone-8-plus.html",
  "iphone se 2020": "apple/iphone-se-2020.html",
  "iphone se 2022": "apple/iphone-se-2022.html",
  "iphone x": "apple/iphone-x.html",
  "iphone xr": "apple/iphone-xr.html",
  "iphone xs": "apple/iphone-xs.html",
  "iphone xs max": "apple/iphone-xs-max.html",
  "moto edge": "motorola/moto-edge.html",
  "moto edge+": "motorola/moto-edge.html",
  "moto g play": "motorola/moto-g-play.html",
  "moto g power": "motorola/moto-g-power.html",
  "moto g stylus": "motorola/moto-g-stylus.html",
  "moto g7": "motorola/moto-g7.html",
  "moto g8": "motorola/moto-g8.html",
  "moto one": "motorola/moto-one.html",
  "pixel 4a": "pixel/pixel-4a.html",
  "pixel 5": "pixel/pixel-5.html",
  "pixel 5a": "pixel/pixel-5a.html",
  "pixel 6": "pixel/pixel-6.html",
  "pixel 6 pro": "pixel/pixel-6-pro.html",
  "pixel 7": "pixel/pixel-7.html",
  "pixel 7 pro": "pixel/pixel-7-pro.html",
  "pixel 8": "pixel/pixel-8.html",
  "pixel 8 pro": "pixel/pixel-8-pro.html",
};

// --- Helper: path utilities (for redirects) ---
function getHomePath() {
  // Check if we're in a subdirectory by looking at the current path
  const path = window.location.pathname;
  
  // If path contains a subdirectory (like /apple/ or /samsung/)
  if (path.includes('/apple/') || path.includes('/samsung/') || 
      path.includes('/motorola/') || path.includes('/pixel/')) {
    return "../index.html";
  }
  return "index.html";
}

function getLoginPath() {
  const path = window.location.pathname;
  
  // If we're in a subdirectory
  if (path.includes('/apple/') || path.includes('/samsung/') || 
      path.includes('/motorola/') || path.includes('/pixel/')) {
    return "../login.html";
  }
  return "login.html";
}

// --- Search handling ---
function handleSearch(scopePrefix) {
  const input = document.getElementById("model-search-input");
  if (!input) return;
  const raw = input.value.trim().toLowerCase();
  if (!raw) {
    alert("Please enter a phone model to search.");
    return;
  }

  // Exact match first
  if (modelIndex[raw]) {
    window.location.href = scopePrefix + modelIndex[raw];
    return;
  }

  // Partial match
  const matchKey = Object.keys(modelIndex).find(k => k.includes(raw));
  if (matchKey) {
    window.location.href = scopePrefix + modelIndex[matchKey];
  } else {
    alert("No model found. Try e.g. 'iPhone 14 Pro Max' or 'Galaxy S23'.");
  }
}

// --- Auth state ---
let currentUser = null;

// List of admin emails who can access admin dashboard
const ADMIN_EMAILS = [
  'owner@cellularmaster.ca',  // ← Change to owner's email
  'admin@cellularmaster.ca'   // ← Add more admin emails here
];

auth.onAuthStateChanged((user) => {
  currentUser = user || null;

  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.style.display = user ? "inline-flex" : "none";
  }
  
  const adminLink = document.getElementById("admin-link");
  if (adminLink) {
    // Only show admin link if user is in admin list
    const isAdmin = user && ADMIN_EMAILS.includes(user.email);
    adminLink.style.display = isAdmin ? "inline-flex" : "none";
  }

  const headerUser = document.getElementById("header-user");
  const headerUserPill = headerUser ? headerUser.parentElement : null;
  const headerLoginLabel = document.getElementById("header-login-label");

  if (user && headerUser && headerUserPill && headerLoginLabel) {
    const email = user.email || "";
    const shortEmail = email.length > 22 ? email.slice(0, 22) + "…" : email;
    headerUser.textContent = "Signed in: " + shortEmail;
    headerUserPill.style.display = "inline-flex";
    headerLoginLabel.textContent = "Account";
  } else if (headerUser && headerUserPill && headerLoginLabel) {
    headerUser.textContent = "";
    headerUserPill.style.display = "none";
    headerLoginLabel.textContent = "Login";
  }

  if (document.getElementById("fav-list")) {
    loadList("favourites", "fav-list", "fav-message");
  }
  if (document.getElementById("cart-list")) {
    loadList("cart", "cart-list", "cart-message");
  }
});

// --- Ensure logged in before writing ---
async function ensureAuthed() {
  if (currentUser) return currentUser;
  alert("Please log in first to use favourites and cart.");
  window.location.href = getLoginPath();
  throw new Error("Not logged in");
}

// --- Firestore helpers ---
async function addToCollection(kind, partLabel) {
  const user = await ensureAuthed();
  const modelEl = document.querySelector(".model-name");
  const brandEl = document.querySelector(".model-brand");
  const model = modelEl ? modelEl.textContent.trim() : null;
  const brand = brandEl ? brandEl.textContent.trim() : null;

  await db.collection("users")
    .doc(user.uid)
    .collection(kind)
    .add({
      label: partLabel,
      model: model,
      brand: brand,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}

async function loadList(kind, containerId, messageId) {
  const container = document.getElementById(containerId);
  const msgEl = document.getElementById(messageId);
  if (!container || !msgEl) return;

  if (!currentUser) {
    msgEl.textContent = "Please log in to see your " + kind + ".";
    container.innerHTML = "";
    return;
  }

  msgEl.textContent = "Loading your " + kind + "…";

  const snap = await db.collection("users")
    .doc(currentUser.uid)
    .collection(kind)
    .orderBy("createdAt", "desc")
    .get();

  container.innerHTML = "";

  if (snap.empty) {
    msgEl.textContent = "You have no " + kind + " saved yet.";
    return;
  }

  msgEl.textContent = "";
  snap.forEach(docSnap => {
    const data = docSnap.data();
    const card = document.createElement("div");
    card.className = "brand-model-card";
    card.innerHTML = `
      <span><strong>${data.label || "Part"}</strong></span>
      <span class="list-meta">${data.model || ""}${data.brand ? " • " + data.brand : ""}</span>
      <span class="pill-badge">${kind === "cart" ? "In cart – $80 + fees" : "Favourite part"}</span>
      <div style="margin-top:0.5rem;">
        <button class="btn-outline" data-action="remove-item" data-id="${docSnap.id}" data-kind="${kind}">Remove</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// --- Global click handler for part buttons ---
document.addEventListener("click", async (evt) => {
  const btn = evt.target.closest("[data-action]");
  if (!btn) return;

  const action = btn.getAttribute("data-action");
  const part   = btn.getAttribute("data-part");

  try {
    if (action === "reserve") {
      // Prompt for customer information
      const customerName = prompt("👤 Your name:");
      if (!customerName) return;
      
      const customerContact = prompt("📞 Your phone or email:");
      if (!customerContact) return;
      
      // Save reservation to Firebase
      try {
        await db.collection('reservations').add({
          partName: part,
          customerName: customerName,
          customerContact: customerContact,
          status: 'pending',
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        alert("✅ Reservation saved! We'll contact you at: " + customerContact);
      } catch (error) {
        console.error('Error saving reservation:', error);
        alert("❌ Error saving reservation. Please call us at +1 514 299 3322");
      }
    } else if (action === "add-cart") {
      await addToCollection("cart", part);
      alert("✅ Added to your cart! Visit the cart page to review.");
    } else if (action === "add-fav") {
      await addToCollection("favourites", part);
      alert("⭐ Saved to your favourites!");
    } else if (action === "remove-item") {
      const id   = btn.getAttribute("data-id");
      const kind = btn.getAttribute("data-kind");
      if (!currentUser) return;
      await db.collection("users")
        .doc(currentUser.uid)
        .collection(kind)
        .doc(id)
        .delete();
      const card = btn.closest(".brand-model-card");
      if (card) card.remove();
      alert("✅ Item removed.");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("⚠️ Something went wrong: " + err.message + "\n\nPlease make sure you're logged in and try again.");
  }
});

// --- DOMContentLoaded: wire search + login form ---
document.addEventListener("DOMContentLoaded", () => {
  const rootBtn = document.getElementById("model-search-btn-root");
  if (rootBtn) {
    rootBtn.addEventListener("click", () => handleSearch(""));
  }
  const subBtn = document.getElementById("model-search-btn-sub");
  if (subBtn) {
    subBtn.addEventListener("click", () => handleSearch("../"));
  }

  const emailInput  = document.getElementById("auth-email");
  const passInput   = document.getElementById("auth-password");
  const btnLogin    = document.getElementById("btn-login");
  const btnRegister = document.getElementById("btn-register");
  const btnLogout   = document.getElementById("btn-logout");
  const statusEl    = document.getElementById("auth-status");

  function setStatus(msg, isError) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = isError ? "#b91c1c" : "#047857";
  }

  if (btnRegister) {
    btnRegister.addEventListener("click", async () => {
      const email = emailInput && emailInput.value.trim();
      const pass  = passInput && passInput.value.trim();
      if (!email || !pass) {
        setStatus("Fill in email and password first.", true);
        return;
      }
      try {
        await auth.createUserWithEmailAndPassword(email, pass);
        setStatus("Account created. Redirecting to home…", false);
        setTimeout(() => {
          window.location.href = getHomePath();
        }, 700);
      } catch (err) {
        console.error(err);
        setStatus(err.message, true);
      }
    });
  }

  if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
      const email = emailInput && emailInput.value.trim();
      const pass  = passInput && passInput.value.trim();
      if (!email || !pass) {
        setStatus("Fill in email and password first.", true);
        return;
      }
      try {
        await auth.signInWithEmailAndPassword(email, pass);
        setStatus("Login successful. Redirecting to home…", false);
        setTimeout(() => {
          window.location.href = getHomePath();
        }, 700);
      } catch (err) {
        console.error(err);
        setStatus("Login failed: " + err.message, true);
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
      await auth.signOut();
      setStatus("You have been logged out.", false);
    });
  }
});