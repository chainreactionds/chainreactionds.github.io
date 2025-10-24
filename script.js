const GITLAB_USERNAME = "databiker"; // <-- cambia con il tuo username
const projectsList = document.getElementById("projects-list");
const themeToggle = document.getElementById("theme-toggle");

// --- Cambio tema manuale ---
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
}

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

// Applica il tema salvato o predefinito (segue sistema)
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  setTheme(savedTheme);
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  setTheme("dark");
} else {
  setTheme("light");
}

// --- Carica progetti GitLab ---
async function loadGitLabProjects() {
  try {
    const response = await fetch(
      `https://gitlab.com/api/v4/users/${GITLAB_USERNAME}/projects?visibility=public&order_by=last_activity_at`
    );
    if (!response.ok) throw new Error("Errore nel caricamento dei progetti");
    const projects = await response.json();

    if (projects.length === 0) {
      projectsList.innerHTML = "<p>Nessun progetto pubblico trovato.</p>";
      return;
    }

    projectsList.innerHTML = projects
      .map(
        (p) => `
        <div class="project-card">
          <a href="${p.web_url}" target="_blank">${p.name}</a>
          <p>${p.description || "Nessuna descrizione disponibile."}</p>
        </div>`
      )
      .join("");
  } catch (error) {
    projectsList.innerHTML = `<p>Impossibile caricare i progetti 😕</p>`;
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", loadGitLabProjects);
