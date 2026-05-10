// events.js - Handles event form, API requests and weekly event rendering

import { API_URL, getAuthHeaders } from "./api.js";

// Keeps track of which week the user is currently viewing
let currentWeekDate = new Date();

// Stores all events fetched from the API
let savedEvents = [];

// Initializes event functionality on the dashboard page
export function initEvents() {
    const eventForm = document.querySelector("#eventForm");
    const previousWeekButton = document.querySelector("#previousWeekButton");
    const nextWeekButton = document.querySelector("#nextWeekButton");

    eventForm?.addEventListener("submit", createEvent);
    previousWeekButton?.addEventListener("click", showPreviousWeek);
    nextWeekButton?.addEventListener("click", showNextWeek);

    getEvents();
}

// Creates a new event and saves it through the API
async function createEvent(event) {
    event.preventDefault();

    const title = document.querySelector("#eventTitle").value;
    const date = document.querySelector("#eventDate").value;
    const time = document.querySelector("#eventTime").value;
    const endTime = document.querySelector("#eventEndTime").value;
    const category = document.querySelector("#eventCategory").value;
    const description = document.querySelector("#eventDescription").value;

    const newEvent = {
        title,
        date,
        time,
        endTime,
        category,
        description
    };

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

        // Fetch events again so the new event appears in the current week view
        getEvents();
    } catch (error) {
        console.error("Error creating event:", error);
    }
}

// Fetches all events for the logged-in user
async function getEvents() {
    try {
        const response = await fetch(`${API_URL}/events`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            alert("Could not fetch events");
            return;
        }

        savedEvents = await response.json();

        renderWeek();
    } catch (error) {
        console.error("Error fetching events:", error);
    }
}

// Moves the calendar view one week back
function showPreviousWeek() {
    currentWeekDate.setDate(currentWeekDate.getDate() - 7);
    renderWeek();
}

// Moves the calendar view one week forward
function showNextWeek() {
    currentWeekDate.setDate(currentWeekDate.getDate() + 7);
    renderWeek();
}

// Renders the full week view
function renderWeek() {
    const weekPlanner = document.querySelector("#weekPlanner");
    const currentWeekLabel = document.querySelector("#currentWeekLabel");

    const weekDays = getWeekDays(currentWeekDate);

    weekPlanner.innerHTML = "";

    currentWeekLabel.textContent = `${formatDate(weekDays[0])} - ${formatDate(weekDays[6])}`;

    weekDays.forEach((day) => {
        const dayCard = createDayCard(day);
        weekPlanner.append(dayCard);
    });
}

// Returns all dates in the selected week, starting on Monday
function getWeekDays(date) {
    const selectedDate = new Date(date);

    const dayNumber = selectedDate.getDay();
    const daysFromMonday = dayNumber === 0 ? 6 : dayNumber - 1;

    const monday = new Date(selectedDate);
    monday.setDate(selectedDate.getDate() - daysFromMonday);

    const weekDays = [];

    for (let i = 0; i < 7; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        weekDays.push(day);
    }

    return weekDays;
}

// Creates one day card for the week planner
function createDayCard(day) {
    const dayCard = document.createElement("article");
    dayCard.classList.add("day-card");

    const heading = document.createElement("h3");
    heading.textContent = getDayHeading(day);

    const eventsContainer = document.createElement("div");
    eventsContainer.classList.add("day-events");

    const eventsForDay = getEventsForDay(day);

    if (eventsForDay.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No events yet";
        eventsContainer.append(emptyMessage);
    } else {
        eventsForDay.forEach((eventItem) => {
            const eventElement = createEventElement(eventItem);
            eventsContainer.append(eventElement);
        });
    }

    dayCard.append(heading, eventsContainer);

    return dayCard;
}

// Finds events that match a specific day
function getEventsForDay(day) {
    const dayDateString = getDateString(day);

    return savedEvents.filter((eventItem) => {
        const eventDate = eventItem.date || eventItem.datetime;
        return eventDate?.startsWith(dayDateString);
    });
}

// Creates one visual event item inside a day card
function createEventElement(eventItem) {
    const eventElement = document.createElement("article");
    eventElement.classList.add("event-item");

    const title = document.createElement("h4");
    title.textContent = eventItem.title;

    const time = document.createElement("p");
    
    if (eventItem.time && eventItem.endTime) {
        time.textContent = `🕒 ${eventItem.time} - ${eventItem.endTime}`;
    } else if (eventItem.time) {
        time.textContent = `🕒 ${eventItem.time}`;
    } else {
        time.textContent = "🕒 No time set";
    }

    const category = document.createElement("p");
    category.textContent = eventItem.category ? `🏷️ ${eventItem.category}` : "";

    const description = document.createElement("p");
    description.textContent = eventItem.description || "";

    eventElement.append(title, time, category, description);

    return eventElement;
}

// Formats the day card heading, for example "Monday 10 Jun"
function getDayHeading(day) {
    const weekday = day.toLocaleDateString("en-GB", {
        weekday: "long"
    });

    const date = day.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short"
    });

    return `${weekday} ${date}`;
}

// Formats the week label dates
function formatDate(date) {
    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short"
    });
}

// Converts a Date object into YYYY-MM-DD format
function getDateString(date) {
    return date.toISOString().split("T")[0];
}