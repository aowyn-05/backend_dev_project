// ============================================================
// Shared frontend helpers: API calls, auth state, navbar.
// EDIT THIS if your backend runs on a different port.
// ============================================================
const API_BASE = "http://localhost:5000/api";

// ---------- Auth state (stored in memory + localStorage; fine for a real deployed page like this one) ----------
function getToken() { return localStorage.getItem("token"); }
function getUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}
function setSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
function isLoggedIn() { return !!getToken(); }

// Redirect helper for pages that require a specific role (or just any login)
function requireAuth(role) {
  const user = getUser();
  if (!isLoggedIn() || !user) {
    window.location.href = "index.html";
    return null;
  }
  if (role && user.role !== role) {
    alert(`This page is for ${role}s only.`);
    window.location.href = "catalog.html";
    return null;
  }
  return user;
}

// ---------- Core fetch wrapper ----------
async function apiFetch(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && getToken()) headers["Authorization"] = `Bearer ${getToken()}`;

  let res, data;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    data = await res.json().catch(() => ({}));
  } catch (err) {
    throw new Error("Could not reach the server. Is the backend running on " + API_BASE + "?");
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

// ---------- Shared navbar ----------
function renderNavbar(containerId, active) {
  const user = getUser();
  const el = document.getElementById(containerId);
  if (!el) return;

  const links = [];
  links.push(["catalog.html", "Catalog", "catalog"]);
  if (user) {
    if (user.role === "customer") {
      links.push(["cart.html", "Cart", "cart"]);
      links.push(["orders.html", "My Orders", "orders"]);
    }
    if (user.role === "seller") links.push(["seller.html", "Seller Dashboard", "seller"]);
    if (user.role === "admin") links.push(["admin.html", "Admin Dashboard", "admin"]);
  }

  const linkHtml = links
    .map(
      ([href, label, key]) =>
        `<a class="nav-link${active === key ? " active" : ""}" href="${href}">${label}</a>`
    )
    .join("");

  const rightHtml = user
    ? `<span class="nav-user">${user.name} · ${user.role}</span>
       <button id="logoutBtn" class="btn-ghost">Log out</button>`
    : `<a class="nav-link" href="index.html">Log in</a>`;

  el.innerHTML = `
    <nav class="navbar">
      <a class="brand" href="catalog.html">Marketplace</a>
      <div class="nav-links">${linkHtml}</div>
      <div class="nav-right">${rightHtml}</div>
    </nav>`;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearSession();
      window.location.href = "index.html";
    });
  }
}

function showError(elId, message) {
  const el = document.getElementById(elId);
  if (el) {
    el.textContent = message;
    el.classList.remove("d-none");
  }
}
function clearError(elId) {
  const el = document.getElementById(elId);
  if (el) el.classList.add("d-none");
}
