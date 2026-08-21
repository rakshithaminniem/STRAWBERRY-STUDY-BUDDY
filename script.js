// =====================================
// PAGE NAVIGATION
// =====================================

const pages = document.querySelectorAll(".page");

function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove("active");
    });
    document.getElementById(pageId).classList.add("active");
}

// =====================================
// USER SYSTEM
// =====================================

let currentUser = null;
const loginBtn = document.getElementById("loginBtn");
const welcomeText = document.getElementById("welcomeText");

// =====================================
// LOGIN
// =====================================

loginBtn.addEventListener("click", () => {
    const username = document.getElementById("usernameInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();

    if (!username || !password) {
        alert("Please fill all fields 🌸");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find(user => user.username === username);

    // LOGIN
    if (existingUser) {
        if (existingUser.password !== password) {
            alert("🍓 Username exists! Wrong password.");
            return;
        }
        currentUser = username;
        welcomeText.textContent = `Welcome back, ${username}! 🍓`;
    }
    // CREATE ACCOUNT
    else {
        const newUser = { username, password };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        currentUser = username;
        welcomeText.textContent = `Welcome, ${username}! 🍓`;
    }

    localStorage.setItem("currentUser", currentUser);
    showPage("homePage");
    loadUserData();
});

// =====================================
// AUTO LOGIN
// =====================================

const savedUser = localStorage.getItem("currentUser");

if (savedUser) {
    currentUser = savedUser;
    welcomeText.textContent = `Welcome back, ${savedUser}! 🍓`;
    showPage("homePage");
    loadUserData(); // FIXED: Load user data after auto-login
}

// =====================================
// LOGOUT
// =====================================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    currentUser = null;
    document.getElementById("usernameInput").value = "";
    document.getElementById("passwordInput").value = "";
    showPage("loginPage");
});

// =====================================
// HOME BUTTONS
// =====================================

document.getElementById("openTimer").addEventListener("click", () => {
    showPage("timerPage");
});

document.getElementById("openGoals").addEventListener("click", () => {
    showPage("goalsPage");
});

document.getElementById("openChecklist").addEventListener("click", () => {
    showPage("checklistPage");
});

document.getElementById("openSubjects").addEventListener("click", () => {
    showPage("subjectsPage");
});

// =====================================
// BACK BUTTONS
// =====================================

document.querySelectorAll(".backBtn").forEach(button => {
    button.addEventListener("click", () => {
        showPage("homePage");
    });
});

// =====================================
// USER DATA KEYS
// =====================================

function goalsKey() {
    return `goals_${currentUser}`;
}

function subjectsKey() {
    return `subjects_${currentUser}`;
}

let goals = [];
let subjects = [];

// =====================================
// GOALS ELEMENTS
// =====================================

const goalInput = document.getElementById("goalInput");
const addGoalBtn = document.getElementById("addGoalBtn");
const goalList = document.getElementById("goalList");
const checklist = document.getElementById("checklist");

// =====================================
// SAVE GOALS
// =====================================

function saveGoals() {
    localStorage.setItem(goalsKey(), JSON.stringify(goals));
}

// =====================================
// RENDER GOALS
// =====================================

function renderGoals() {
    goalList.innerHTML = "";
    checklist.innerHTML = "";

    goals.forEach((goal, index) => {
        // GOAL ITEM
        const goalItem = document.createElement("li");
        const text = document.createElement("span");
        text.textContent = "🎯 " + goal.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.addEventListener("click", () => {
            goals.splice(index, 1);
            saveGoals();
            renderGoals();
        });

        goalItem.appendChild(text);
        goalItem.appendChild(deleteBtn);
        goalList.appendChild(goalItem);

        // CHECKLIST ITEM
        const checkItem = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = goal.completed;

        checkbox.addEventListener("change", () => {
            goals[index].completed = checkbox.checked;
            saveGoals();
            if (checkbox.checked) {
                randomMessage();
                celebrate();
            }
        });

        const span = document.createElement("span");
        span.textContent = goal.text;

        checkItem.appendChild(checkbox);
        checkItem.appendChild(span);
        checklist.appendChild(checkItem);
    });
}

// =====================================
// ADD GOAL
// =====================================

addGoalBtn.addEventListener("click", () => {
    const value = goalInput.value.trim();
    if (!value) return;

    goals.push({
        text: value,
        completed: false
    });

    goalInput.value = "";
    saveGoals();
    renderGoals();
});

// =====================================
// SUBJECT ELEMENTS
// =====================================

const subjectInput = document.getElementById("subjectInput");
const addSubjectBtn = document.getElementById("addSubjectBtn");
const subjectList = document.getElementById("subjectList");

// =====================================
// SAVE SUBJECTS
// =====================================

function saveSubjects() {
    localStorage.setItem(subjectsKey(), JSON.stringify(subjects));
}

// =====================================
// RENDER SUBJECTS
// =====================================

function renderSubjects() {
    subjectList.innerHTML = "";

    subjects.forEach((subject, index) => {
        const li = document.createElement("li");
        const text = document.createElement("span");
        text.textContent = "📚 " + subject;

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.addEventListener("click", () => {
            subjects.splice(index, 1);
            saveSubjects();
            renderSubjects();
        });

        li.appendChild(text);
        li.appendChild(deleteBtn);
        subjectList.appendChild(li);
    });
}

// =====================================
// ADD SUBJECT
// =====================================

addSubjectBtn.addEventListener("click", () => {
    const value = subjectInput.value.trim();
    if (!value) return;

    subjects.push(value);
    subjectInput.value = "";
    saveSubjects();
    renderSubjects();
});

// =====================================
// UPDATE USER DATA LOADER (FIXED)
// =====================================

function loadUserData() {
    if (!currentUser) return; // Safety check
    
    goals = JSON.parse(localStorage.getItem(goalsKey())) || [];
    subjects = JSON.parse(localStorage.getItem(subjectsKey())) || [];
    
    renderGoals();
    renderSubjects();
}

// =====================================
// CAT SYSTEM
// =====================================

const studyCat = document.getElementById("studyCat");
const catMood = document.getElementById("catMood");

function catHappy() {
    studyCat.innerHTML = "😺";
    catMood.textContent = "Ready to study together! 🍓";
}

function catStudying() {
    studyCat.innerHTML = "😴";
    catMood.textContent = "I'm waiting quietly while you focus... 💤";
}

function catPaused() {
    studyCat.innerHTML = "🙀";
    catMood.textContent = "Taking a little break? 💖";
}

function catReset() {
    studyCat.innerHTML = "😿";
    catMood.textContent = "Session cancelled, but we can always try again 🌷";
}

function catFinished() {
    studyCat.innerHTML = "😸";
    catMood.textContent = "YOU DID IT!! 🍓✨";
}

// =====================================
// SUPPORT MESSAGES
// =====================================

const supportMessage = document.getElementById("supportMessage");

const messages = [
    "Great job! 🍓",
    "You're doing amazing! 🌸",
    "Progress is progress 💖",
    "One task at a time 🌷",
    "Keep going! ✨",
    "Your future self will thank you 🍓",
    "You're stronger than you think 💕",
    "Look at you go! 🌸"
];

function randomMessage() {
    if (!supportMessage) return;
    supportMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
}

// =====================================
// TIMER
// =====================================

const timerDisplay = document.getElementById("timerDisplay");
const set25 = document.getElementById("set25");
const set45 = document.getElementById("set45");
const startTimer = document.getElementById("startTimer");
const pauseTimer = document.getElementById("pauseTimer");
const resumeTimer = document.getElementById("resumeTimer");
const resetTimer = document.getElementById("resetTimer");

let totalSeconds = 1500;
let selectedTime = 1500;
let timerInterval;
let isPaused = false;
let isTimerRunning = false;

function updateTimer() {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function stopTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
}

set25.addEventListener("click", () => {
    stopTimer();
    selectedTime = 1500;
    totalSeconds = 1500;
    isPaused = false;
    isTimerRunning = false;
    updateTimer();
    catHappy();
});

set45.addEventListener("click", () => {
    stopTimer();
    selectedTime = 2700;
    totalSeconds = 2700;
    isPaused = false;
    isTimerRunning = false;
    updateTimer();
    catHappy();
});

startTimer.addEventListener("click", () => {
    if (isTimerRunning) return; // Prevent multiple intervals
    
    stopTimer();
    isPaused = false;
    isTimerRunning = true;
    catStudying();

    timerInterval = setInterval(() => {
        if (!isPaused) {
            totalSeconds--;
            updateTimer();

            if (totalSeconds <= 0) {
                stopTimer();
                timerDisplay.textContent = "Done! 🎉";
                catFinished();
                celebrate();
                randomMessage();
                
                // Sound notification
                try {
                    const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
                    audio.play();
                } catch (error) {}

                alert("🍓 Study Session Complete!");
                isTimerRunning = false;
            }
        }
    }, 1000);
});

pauseTimer.addEventListener("click", () => {
    if (isTimerRunning && !isPaused) {
        isPaused = true;
        catPaused();
    }
});

resumeTimer.addEventListener("click", () => {
    if (isTimerRunning && isPaused) {
        isPaused = false;
        catStudying();
    }
});

resetTimer.addEventListener("click", () => {
    stopTimer();
    totalSeconds = selectedTime;
    isPaused = false;
    isTimerRunning = false;
    updateTimer();
    catReset();
});

updateTimer();

// =====================================
// SPARKLE CURSOR
// =====================================

const sparkleContainer = document.getElementById("sparkle-container");

document.addEventListener("mousemove", (e) => {
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");
    const sparkles = ["✨", "🌸", "💖", "⭐"];
    sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
    sparkle.style.left = e.clientX + "px";
    sparkle.style.top = e.clientY + "px";
    sparkleContainer.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, 800);
});

// =====================================
// CELEBRATION
// =====================================

function celebrate() {
    const emojis = ["🍓", "🌸", "💖", "✨"];

    for (let i = 0; i < 25; i++) {
        const piece = document.createElement("div");
        piece.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        piece.style.position = "fixed";
        piece.style.left = Math.random() * 100 + "vw";
        piece.style.top = "-20px";
        piece.style.fontSize = "24px";
        piece.style.zIndex = "9999";
        piece.style.pointerEvents = "none";
        document.body.appendChild(piece);

        piece.animate([
            { transform: "translateY(0)" },
            { transform: "translateY(110vh)" }
        ], {
            duration: 3000 + Math.random() * 2000
        });

        setTimeout(() => {
            piece.remove();
        }, 5000);
    }
}

// =====================================
// RANDOM CAT QUOTES
// =====================================

const catQuotes = [
    "Let's earn some strawberries 🍓",
    "One small step at a time 🌷",
    "You can do this 💖",
    "Let's focus together 🌸",
    "I believe in you ✨",
    "Every task matters 🍓"
];

setInterval(() => {
    if (studyCat && studyCat.innerHTML === "😺") {
        catMood.textContent = catQuotes[Math.floor(Math.random() * catQuotes.length)];
    }
}, 10000);

// =====================================
// STARTUP
// =====================================

catHappy();
updateTimer();
    
