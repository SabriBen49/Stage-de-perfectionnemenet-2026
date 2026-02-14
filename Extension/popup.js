import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wbbzcmbsabkghllsglfn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiYnpjbWJzYWJrZ2hsbHNnbGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NTE5ODcsImV4cCI6MjA4MTEyNzk4N30.PwcDs94AREhxLQAwEW36RUeUM_fbSSRK63DCQqEswNs";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const statusDiv = document.getElementById("status");
console.log("Popup script loaded");

chrome.storage.local.get(["jwt"], (result) => {
  statusDiv.textContent = result.jwt ? "Déjà connecté" : "Pas connecté";
});

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    statusDiv.textContent = "Error: identifiants de connexion invalides";
    return;
  }

  chrome.storage.local.set({ jwt: data.session.access_token }, () => {
    statusDiv.textContent = "Connexion réussie";
  });
});

  logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  chrome.storage.local.remove("jwt", () => {
    statusDiv.textContent = "Déconnexion effectuée";
  });
});
