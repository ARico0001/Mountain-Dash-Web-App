import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://hxrhnemlxptlcvpvmpwu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_U24SEjua7BNgn5cJID6QLQ_ZuR1Q1Vt";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true
    }
});

// Centralized UI updater based on session state
function updateAuthUI(session) {
    const dashboardContent = document.getElementById("dashboard-content");
    if (dashboardContent) {
        dashboardContent.classList.remove("d-none");
    }

    const userNameEl = document.getElementById("user-name");
    const authElements = document.querySelectorAll(".requires-auth");

    if (session && session.user) {
        if (userNameEl) {
            userNameEl.textContent = session.user.email || "Authenticated User";
        }
        authElements.forEach((el) => el.classList.remove("d-none"));
    } else {
        if (userNameEl) {
            userNameEl.textContent = "Guest";
        }
        authElements.forEach((el) => el.classList.add("d-none"));
    }
}

// Initialize Dashboard & Live Auth Listener
async function initDashboard() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        updateAuthUI(session);

        // Listen for live sign-in/sign-out events
        supabase.auth.onAuthStateChange((event, currentSession) => {
            updateAuthUI(currentSession);
        });
    } catch (err) {
        console.error("Error initializing auth session:", err?.message ?? err);
        updateAuthUI(null);
    }
}

// Handle Logout
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            window.location.href = "index.html";
        } catch (err) {
            console.error("Error signing out:", err?.message ?? err);
        }
    });
}

// Safe execution regardless of load timing
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDashboard);
} else {
    initDashboard();
}
