// events.js - Handles event form, API requests and weekly event rendering

import { API_URL, getAuthHeaders } from "./api.js";

// Keeps track of which week the user is currently viewing
let currentWeekDate = new Date();

// Stores all events fetched from the API
let savedEvents = [];

// Keeps track of the event currently being edited, null if creating a new event
let editingEventId = null;
let highlightedEventId = null;

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

// Unfoald the event form
const toggleEventFormBtn = document.querySelector("#toggleEventFormBtn");
const eventFormPanel = document.querySelector("#eventFormPanel");

toggleEventFormBtn.addEventListener("click", () => {
    eventFormPanel.classList.toggle("hidden");

    const isHidden = eventFormPanel.classList.contains("hidden");

    toggleEventFormBtn.textContent = isHidden
        ? "+ Add new event"
        : "− Close event form";
});

// Closes the event form and resets it to default state
function closeEventForm() {
    eventFormPanel.classList.add("hidden");
    toggleEventFormBtn.textContent = "+ Add new event";
}

// Creates a new event and saves it through the API
async function createEvent(event) {
    event.preventDefault();
    clearEventErrors();

    const title = document.querySelector("#eventTitle").value;
    const date = document.querySelector("#eventDate").value;
    const endDate = document.querySelector("#eventEndDate").value;
    const time = document.querySelector("#eventTime").value;
    const endTime = document.querySelector("#eventEndTime").value;
    const category = document.querySelector("#eventCategory").value;
    const description = document.querySelector("#eventDescription").value;

    const validationErrors = validateEventInput(
        title,
        date,
        endDate,
        category,
        time,
        endTime,
        description
    );

    if (validationErrors.length > 0) {
        showEventStatus(validationErrors);
        return;
    }

    const newEvent = {
        title: title.trim(),
        date,
        endDate,
        time,
        endTime,
        category,
        description: description.trim()
    };


    const url = editingEventId
        ? `${API_URL}/events/${editingEventId}`
        : `${API_URL}/events`;

    const method = editingEventId ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(newEvent)
        });

        if (!response.ok) {
            showEventStatus("Could not save event.");
            return;
        }

        const savedEvent = await response.json();

        event.target.reset();
        editingEventId = null;

        document.querySelector("#eventForm button[type='submit']").textContent = "Add event";
        
        const eventFormTitle = document.querySelector("#eventFormTitle");

        if (eventFormTitle) {
            eventFormTitle.textContent = "Add new event";
        }

        closeEventForm();
        clearEventStatus();
        getEvents(savedEvent._id);

    } catch (error) {
        console.error("Error saving event:", error);
        showEventStatus("Could not save event.");
    }

}

// Fetches all events for the logged-in user
async function getEvents(highlightEventId = null) {
    try {
        const response = await fetch(`${API_URL}/events`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            alert("Could not fetch events");
            return;
        }

        savedEvents = await response.json();

        highlightedEventId = highlightEventId;
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
            const eventElement = createEventElement(eventItem, day);
            eventsContainer.append(eventElement);
        });
    }

    dayCard.append(heading, eventsContainer);

    return dayCard;
}

// Finds events that should be shown on a specific day
function getEventsForDay(day) {
    const dayDateString = getDateString(day);

    return savedEvents.filter((eventItem) => {
        const startDate = getDateString(new Date(eventItem.date));
        const endDate = eventItem.endDate
            ? getDateString(new Date(eventItem.endDate))
            : startDate;

        return dayDateString >= startDate && dayDateString <= endDate;
    });
}

// Creates one visual event item inside a day card
function createEventElement(eventItem, day) {
    const eventElement = document.createElement("article");
    eventElement.classList.add("event-item");

    eventElement.tabIndex = -1;

    if (eventItem._id === highlightedEventId) {
        eventElement.classList.add("event-item--highlight");

        setTimeout(() => {
            eventElement.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            eventElement.focus();
            highlightedEventId = null;
        }, 100);
    }

    const title = document.createElement("h4");
    title.textContent = eventItem.title;

    const time = document.createElement("p");

    const currentDay = getDateString(day);
    const startDate = getDateString(new Date(eventItem.date));
    const endDate = eventItem.endDate
        ? getDateString(new Date(eventItem.endDate))
        : startDate;

    if (startDate === endDate) {
        if (eventItem.time && eventItem.endTime) {
            time.textContent = `🕒 ${eventItem.time} - ${eventItem.endTime}`;
        } else if (eventItem.time) {
            time.textContent = `🕒 Starts ${eventItem.time}`;
        } else {
            time.textContent = "🕒 All day";
        }
    } else if (currentDay === startDate) {
        time.textContent = eventItem.time
            ? `🕒 Starts ${eventItem.time}`
            : "🕒 Starts today";
    } else if (currentDay === endDate) {
        time.textContent = eventItem.endTime
            ? `🕒 Ends ${eventItem.endTime}`
            : "🕒 Ends today";
    } else {
        time.textContent = "🕒 All day";
    }

    const dateRange = document.createElement("p");

    if (eventItem.endDate) {
        const startDate = formatDate(new Date(eventItem.date));
        const endDate = formatDate(new Date(eventItem.endDate));

        dateRange.textContent = `📅 ${startDate} - ${endDate}`;
    }

    const category = document.createElement("p");
    category.textContent = eventItem.category ? `🏷️ ${eventItem.category}` : "";

    const description = document.createElement("p");
    description.textContent = eventItem.description
        ? `ℹ️ ${eventItem.description}`
        : "ℹ️ No description";


    const editButton = document.createElement("button");
    editButton.classList.add("event-edit");
    editButton.type = "button";
    editButton.textContent = "Edit";

    editButton.addEventListener("click", () => {
        startEditEvent(eventItem);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("event-delete");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
        deleteEvent(eventItem._id);
    });

    eventElement.append(
        title,
        time,
        dateRange,
        category,
        description,
        editButton,
        deleteButton
    );

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

// Validates event form input before sending it to the API
function validateEventInput(title, date, endDate, category, time, endTime, description) {
    const errors = [];

    if (title.trim().length < 1) {
        setInputError("eventTitle");
        errors.push("Title is required.");
    }

    if (!date) {
        setInputError("eventDate");
        errors.push("Please choose a start date.");
    }

    if (endDate && date && endDate < date) {
        setInputError("eventDate");
        setInputError("eventEndDate");
        errors.push("End date must be the same as or later than start date.");
    }

    if (!category) {
        setInputError("eventCategory");
        errors.push("Please choose a category.");
    }

    if (time && endTime && (!endDate || endDate === date) && endTime <= time) {
        setInputError("eventTime");
        setInputError("eventEndTime");
        errors.push("End time must be later than start time when the event starts and ends on the same day.");
    }

    if (description.length > 200) {
        setInputError("eventDescription");
        errors.push("Description can be max 200 characters.");
    }

    return errors;
}

// Displays status messages for the event form
function showEventStatus(messages, type = "error") {
    const statusMessage = document.querySelector("#eventStatusMessage");

    if (!statusMessage) {
        return;
    }

    statusMessage.innerHTML = "";
    statusMessage.className = `status-message status-message--${type}`;

    if (Array.isArray(messages)) {
        const list = document.createElement("ul");

        messages.forEach((message) => {
            const item = document.createElement("li");
            item.textContent = message;
            list.append(item);
        });

        statusMessage.append(list);
    } else {
        statusMessage.textContent = messages;
    }
}

function clearEventStatus() {
    const statusMessage = document.querySelector("#eventStatusMessage");

    if (!statusMessage) {
        return;
    }

    statusMessage.innerHTML = "";
    statusMessage.className = "";
}

// Adds error styling to an input field
function setInputError(inputId) {
    const input = document.querySelector(`#${inputId}`);

    if (!input) {
        return;
    }

    input.classList.add("input-error");
}

// Removes all event form error styles
function clearEventErrors() {
    const eventInputs = document.querySelectorAll(
        "#eventForm input, #eventForm textarea, #eventForm select"
    );

    eventInputs.forEach((input) => {
        input.classList.remove("input-error");
    });
}

// Starts edit mode and fills the form with the selected event
function startEditEvent(eventItem) {
    editingEventId = eventItem._id;

    eventFormPanel.classList.remove("hidden");
    toggleEventFormBtn.textContent = "− Close event form";

    const eventFormTitle = document.querySelector("#eventFormTitle");

    if (eventFormTitle) {
        eventFormTitle.textContent = "Edit event";
    }

    document.querySelector("#eventTitle").value = eventItem.title || "";
    document.querySelector("#eventDate").value = getDateString(new Date(eventItem.date));

    document.querySelector("#eventEndDate").value = eventItem.endDate
        ? getDateString(new Date(eventItem.endDate))
        : "";

    document.querySelector("#eventTime").value = eventItem.time || "";
    document.querySelector("#eventEndTime").value = eventItem.endTime || "";
    document.querySelector("#eventCategory").value = eventItem.category || "";
    document.querySelector("#eventDescription").value = eventItem.description || "";

    document.querySelector("#eventForm button[type='submit']").textContent = "Update event";


    document.querySelector("#eventForm").scrollIntoView({
        behavior: "smooth"
    });
}

// Delete an event
async function deleteEvent(eventId) {
    const confirmed = confirm("Delete this event?");

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/events/${eventId}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            showEventStatus("Could not delete event.");
            return;
        }

        getEvents();
    } catch (error) {
        console.error("Error deleting event:", error);
    }
}