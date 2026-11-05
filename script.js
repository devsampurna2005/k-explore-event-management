const eventCards = [...document.querySelectorAll(".event-card")];
const filterButtons = [...document.querySelectorAll(".filter-chip")];
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
let activeCategory = "All";

function filterEvents() {
  const term = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;
  eventCards.forEach(card => {
    const categoryMatch = activeCategory === "All" || card.dataset.category === activeCategory;
    const searchMatch = card.dataset.search.includes(term) || card.textContent.toLowerCase().includes(term);
    const show = categoryMatch && searchMatch;
    card.hidden = !show;
    if (show) visibleCount++;
  });
  emptyState.hidden = visibleCount !== 0;
}
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.category;
    filterEvents();
  });
});
searchInput.addEventListener("input", filterEvents);

const modal = document.getElementById("eventModal");
const eventSelect = document.getElementById("selectedEvent");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const formError = document.getElementById("formError");
const registrationForm = document.getElementById("registrationForm");
const toast = document.getElementById("toast");

function openRegistration(eventName) {
  modalTitle.textContent = `Register for ${eventName}`;
  modalDescription.textContent = "Add your details below to save your spot.";
  eventSelect.innerHTML = '<option value="">Choose an event</option>';
  eventCards.forEach(card => {
    const title = card.querySelector("h3").textContent;
    const option = document.createElement("option");
    option.value = title;
    option.textContent = title;
    eventSelect.appendChild(option);
  });
  eventSelect.value = eventName;
  formError.textContent = "";
  registrationForm.reset();
  eventSelect.value = eventName;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("fullName").focus();
}
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
document.querySelectorAll(".event-register").forEach(button => {
  button.addEventListener("click", () => openRegistration(button.dataset.event));
});
document.getElementById("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && modal.classList.contains("open")) closeModal(); });

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3500);
}
registrationForm.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const chosenEvent = eventSelect.value;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneValid = /^[0-9+() -]{10,16}$/.test(phone) && phone.replace(/\D/g, "").length >= 10;
  if (name.length < 2) { formError.textContent = "Please enter your full name (at least 2 characters)."; return; }
  if (!emailValid) { formError.textContent = "Please enter a valid email address."; return; }
  if (!phoneValid) { formError.textContent = "Please enter a valid phone number with at least 10 digits."; return; }
  if (!chosenEvent) { formError.textContent = "Please select an event."; return; }

  const registrations = JSON.parse(localStorage.getItem("gatherRegistrations") || "[]");
  registrations.push({ name, email, phone, event: chosenEvent, registeredAt: new Date().toISOString() });
  localStorage.setItem("gatherRegistrations", JSON.stringify(registrations));
  closeModal();
  registrationForm.reset();
  showToast(`You're registered for ${chosenEvent}! Check your inbox for details.`);
});

document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  const email = document.getElementById("newsletterEmail");
  if (!email.checkValidity()) { email.reportValidity(); return; }
  showToast("You're on the list. Thanks for joining!");
  email.value = "";
});

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  document.getElementById("themeToggle").textContent = dark ? "☀" : "☾";
  localStorage.setItem("gatherTheme", dark ? "dark" : "light");
});
if (localStorage.getItem("gatherTheme") === "dark") {
  document.body.classList.add("dark");
  document.getElementById("themeToggle").textContent = "☀";
}
document.getElementById("menuToggle").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("show");
});
document.querySelectorAll(".nav-links a").forEach(link => link.addEventListener("click", () => {
  document.querySelector(".nav-links").classList.remove("show");
}));
