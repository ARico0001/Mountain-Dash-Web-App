import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://hxrhnemlxptlcvpvmpwu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_U24SEjua7BNgn5cJID6QLQ_ZuR1Q1Vt";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true
    }
});

// Allow dashboard to load without login
async function initDashboard() {
    const { data: { session } } = await supabase.auth.getSession();

    // Show dashboard content no matter what
    document.getElementById("dashboard-content").classList.remove("d-none");

    if (session) {
        // Logged-in user
        loadUser(session.user);

        // Show logged-in features
        document.querySelectorAll(".requires-auth").forEach(el => {
            el.classList.remove("d-none");
        });

    } else {
        // Guest user
        document.getElementById("user-name").textContent = "Guest";

        // Hide logged-in features
        document.querySelectorAll(".requires-auth").forEach(el => {
            el.classList.add("d-none");
        });
    }
}

initDashboard();

// Logout button (only works if logged in)
document.getElementById("logout-btn")?.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.replace("index.html");
});

// Example: load user data
function loadUser(user) {
    document.getElementById("user-name").textContent = user.email;
}
