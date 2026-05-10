// events.js - Handles event form, API requests and event rendering

// Import the API URL and auth headers function from the api.js module
import { API_URL, getAuthHeaders } from "./api.js";


// Function to initialize event listeners and render the week planner
export function initEvents() {
    const eventForm = document.querySelector("#eventForm");

    eventForm?.addEventListener("submit", createEvent);

    renderWeekDays();
    getEvents();
}


// Function to handle event creation
async function createEvent(event) {
    event.preventDefault();

    const title = document.querySelector("#eventTitle").value;
    const date = document.querySelector("#eventDate").value;
    const time = document.querySelector("#eventTime").value;
    const category = document.querySelector("#eventCategory").value;
    const description = document.querySelector("#eventDescription").value;

    // Create an event object with the form data
    const newEvent = {
        title,
        date,
        time,
        category,
        description
    };

    // Send a POST request to the events endpoint with the new event data
    try {
        const response = await fetch(`${API_URL}/events`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(newEvent)
        });

        if (!response.ok) {
            alert("Could not create event");
            return;
        }

        event.target.reset();
        getEvents();
    } catch (error) {
        console.error(error);
    }
}

// Function to render the week planner with empty day cards
function renderWeekDays() {
    const weekPlanner = document.querySelector("#weekPlanner");

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    weekPlanner.innerHTML = "";

    // Create a card for each day of the week
    days.forEach((day) => {
        const dayCard = document.createElement("article");
        dayCard.classList.add("day-card");

        const heading = document.createElement("h3");
        heading.textContent = day;

        const eventsContainer = document.createElement("div");
        eventsContainer.classList.add("day-events");

        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No events yet";

        eventsContainer.append(emptyMessage);
        dayCard.append(heading, eventsContainer);
        weekPlanner.append(dayCard);
    });
}

// Function to fetch events from the API
async function getEvents() {
    try {
        const response = await fetch(`${API_URL}/events`, {
            headers: getAuthHeaders()
        });

        const events = await response.json();

        renderEvents(events);
    } catch (error) {
        console.error(error);
    }
}

// Function to render events in the week planner
function renderEvents(events) {
    const weekPlanner = document.querySelector("#weekPlanner");

    weekPlanner.innerHTML = "";

    events.forEach((eventItem) => {
        const eventCard = document.createElement("article");
        eventCard.classList.add("day-card");

        const title = document.createElement("h3");
        title.textContent = eventItem.title;

        const date = document.createElement("p");
        date.textContent = eventItem.date || eventItem.datetime;

        const time = document.createElement("p");
        time.textContent = eventItem.time || "";

        const category = document.createElement("p");
        category.textContent = eventItem.category || "";

        const description = document.createElement("p");
        description.textContent = eventItem.description || "";

        eventCard.append(title, date, time, category, description);
        weekPlanner.append(eventCard);
    });
}