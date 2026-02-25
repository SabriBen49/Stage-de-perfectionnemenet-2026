import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';


chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "add-to-dwexo",
    title: "Ajouter le profil à Dwexo",
    contexts: ["page"],
    documentUrlPatterns: ["https://www.linkedin.com/in/*"],
  });
});


function showTempNotification(title, message) {
  chrome.notifications.create(
    "DWEXO_NOTIFICATION",
    {
      type: "basic",
      iconUrl: "assets/notificationlogo.png",
      title: title,
      message: message,
    },
    (notificationId) => {
      setTimeout(() => {
        chrome.notifications.clear(notificationId);
      }, 7000);
    }
  );
}


chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "add-to-dwexo") return;


  if (!tab.url.startsWith("https://www.linkedin.com/in/")) {
    showTempNotification(
      "Erreur",
      "Veuillez ouvrir un profil LinkedIn valide avant d’utiliser cette option."
    );
    return;
  }

  chrome.storage.local.get(["jwt"], async (result) => {
    if (!result.jwt) {
      showTempNotification(
        "Erreur",
        "Veuillez ouvrir l’extension Dwexo (icône en haut à droite) et vous connecter."
      );
      return;
    }

    const SUPABASE_URL = "https://wbbzcmbsabkghllsglfn.supabase.co";
    const SUPABASE_ANON_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiYnpjbWJzYWJrZ2hsbHNnbGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NTE5ODcsImV4cCI6MjA4MTEyNzk4N30.PwcDs94AREhxLQAwEW36RUeUM_fbSSRK63DCQqEswNs";

    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${result.jwt}`,
        },
      },
    });


    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });
    } catch (err) {
      console.error("Failed to inject content script:", err);
    }

    
    chrome.tabs.sendMessage(tab.id, { action: "GET_LINKEDIN_PROFILE" }, async (profile) => {
      if (chrome.runtime.lastError) {
        console.error("Message error:", chrome.runtime.lastError.message);
        showTempNotification(
          "Erreur",
          "Impossible d’extraire le profil LinkedIn. Assurez-vous d’être sur un profil."
        );
        return;
      }

      if (!profile || !profile.linkedinUrl) {
        console.error("Profile is undefined or missing fields", profile);
        showTempNotification(
          "Erreur",
          "Profile deja exist."
        );
        return;
      }

      console.log("Received profile:", profile);

     
      const { data: existingProfiles, error: fetchError } = await supabaseAuth
        .from("contacts")
        .select("*")
        .eq("linkedinUrl", profile.linkedinUrl);

      if (fetchError) {
        console.error(fetchError);
        showTempNotification(
          "Erreur",
          "Profile deja exist."
        );
        return;
      }

      if (existingProfiles.length > 0) {
        showTempNotification("Erreur", "Ce profil existe déjà dans Dwexo.");
        return;
      }

      const {
        data: { user },
        error: userError
      } = await supabaseAuth.auth.getUser();

      if (userError || !user) {
        console.error("Cannot get authenticated user:", userError);
        showTempNotification(
          "Erreur",
          "Utilisateur non authentifié. Veuillez vous reconnecter."
        );
        return;
      }

    const { error: upsertError } = await supabaseAuth
  .from("contacts")
  .upsert({
    id: user.id,           
    linkedinUrl: profile.linkedinUrl,
    name: profile.name,
    title: profile.title,
    location: profile.location,
  });

if (upsertError) {
  console.error(upsertError);
  showTempNotification(
    "Échec de l’enregistrement",
    "Impossible de sauvegarder le profil."
  );
  return;
}

      showTempNotification("Succès", "Profil ajouté à Dwexo !");
    });
  });
});

