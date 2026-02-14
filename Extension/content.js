chrome.runtime.onMessage.addListener((request,sender, sendResponse) => {
  if (request.action === "GET_LINKEDIN_PROFILE") {
    const profile = extractProfile();
    sendResponse(profile);
  }
  return true; 
});

function extractProfile() {
  const name = document.querySelector("h1")?.innerText || "";
  const title = document.querySelector(".text-body-medium")?.innerText || "";
  const location = document.querySelector(".text-body-small.inline")?.innerText || "";

  const profile = {
    name: name.trim(),
    title: title.trim(),
    location: location.trim(),
    linkedinUrl: window.location.href
  };
  console.log("Profile extracted:", profile);
  return profile;
}
