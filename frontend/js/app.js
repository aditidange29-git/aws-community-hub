const API_BASE = "https://4r9ro8x2qb.execute-api.ap-south-1.amazonaws.com";

const eventsContainer = document.getElementById("events-container");
const loadingState = document.getElementById("loading-state");
const emptyState = document.getElementById("empty-state");
const errorState = document.getElementById("error-state");

async function fetchEvents() {
  showLoading();
  try {
    const response = await fetch(`${API_BASE}/events`);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);

    const events = await response.json();
    hideLoading();

    if (!events || events.length === 0) {
      showEmpty();
      return;
    }

    renderEvents(events);
  } catch (err) {
    console.error("Failed to fetch events:", err);
    hideLoading();
    showError();
  }
}

function showLoading() {
  loadingState.hidden = false;
  emptyState.hidden = true;
  errorState.hidden = true;
  eventsContainer.innerHTML = "";
}

function hideLoading() {
  loadingState.hidden = true;
}

function showEmpty() {
  emptyState.hidden = false;
}

function showError() {
  errorState.hidden = false;
}

function renderEvents(events) {
  eventsContainer.innerHTML = "";

  events.forEach(event => {
    const card = document.createElement("div");
    card.className = "event-card";

    const poster = event.posterUrl || "https://placehold.co/400x200/1a1a1f/8b5cf6?text=Event";

    card.innerHTML = `
      <img src="${poster}" alt="${event.title}">
      <div class="card-body">
        <h3>${event.title}</h3>
        <p class="event-date">${formatDate(event.date)} ${event.time ? "· " + event.time : ""}</p>
        <button class="register-btn" data-id="${event.SK}">Register</button>
      </div>
    `;

    eventsContainer.appendChild(card);
  });

  // Register button click handling — wired in Step 5
  document.querySelectorAll(".register-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.href = `event-details.html?id=${btn.dataset.id}`;
    });
  });
}

function formatDate(dateStr) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateStr).toLocaleDateString("en-IN", options);
}