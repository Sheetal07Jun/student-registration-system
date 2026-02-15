// ================================
// STUDENT REGISTRATION SYSTEM
// ================================

// Selecting DOM elements
const form = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const studentCount = document.getElementById("studentCount");

// Input fields
const nameInput = document.getElementById("name");
const idInput = document.getElementById("studentId");
const emailInput = document.getElementById("email");
const contactInput = document.getElementById("contact");

// Error fields
const nameError = document.getElementById("nameError");
const idError = document.getElementById("idError");
const emailError = document.getElementById("emailError");
const contactError = document.getElementById("contactError");

// Load from localStorage
let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = null;

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Update Student Counter
function updateCounter() {
    studentCount.textContent = students.length;
}

// Dynamic Scrollbar using JS
function updateScrollbar() {
    if (students.length > 4) {
        studentList.style.overflowY = "scroll";
    } else {
        studentList.style.overflowY = "hidden";
    }
}

// Render Students
function renderStudents() {
    studentList.innerHTML = "";

    students.forEach((student, index) => {
        const card = document.createElement("div");
        card.classList.add("student-card");

        card.innerHTML = `
            <div class="student-info">
                <p><strong>Name:</strong> ${student.name}</p>
                <p><strong>ID:</strong> ${student.id}</p>
                <p><strong>Email:</strong> ${student.email}</p>
                <p><strong>Contact:</strong> ${student.contact}</p>
            </div>
            <div>
                <button class="edit-btn" onclick="editStudent(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteStudent(${index})">Delete</button>
            </div>
        `;

        studentList.appendChild(card);
    });

    updateCounter();
    updateScrollbar();
}

// Validation Function
function validateInputs(name, id, email, contact) {

    let valid = true;

    const nameRegex = /^[A-Za-z\s]+$/;
    const numberRegex = /^[0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    nameError.textContent = "";
    idError.textContent = "";
    emailError.textContent = "";
    contactError.textContent = "";

    if (!name) {
        nameError.textContent = "Name is required";
        valid = false;
    } else if (!nameRegex.test(name)) {
        nameError.textContent = "Only letters allowed";
        valid = false;
    }

    if (!id) {
        idError.textContent = "Student ID is required";
        valid = false;
    } else if (!numberRegex.test(id)) {
        idError.textContent = "Only numbers allowed";
        valid = false;
    } else if (students.some((student, index) => student.id === id && index !== editIndex)) {
        idError.textContent = "Duplicate Student ID not allowed";
        valid = false;
    }

    if (!email) {
        emailError.textContent = "Email is required";
        valid = false;
    } else if (!emailRegex.test(email)) {
        emailError.textContent = "Invalid email format";
        valid = false;
    }

    if (!contact) {
        contactError.textContent = "Contact number is required";
        valid = false;
    } else if (!numberRegex.test(contact) || contact.length < 10) {
        contactError.textContent = "Minimum 10 digits required";
        valid = false;
    }

    return valid;
}

// Form Submit
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const id = idInput.value.trim();
    const email = emailInput.value.trim();
    const contact = contactInput.value.trim();

    if (!validateInputs(name, id, email, contact)) return;

    const studentData = { name, id, email, contact };

    if (editIndex === null) {
        students.push(studentData);
    } else {
        students[editIndex] = studentData;
        editIndex = null;
    }

    saveToLocalStorage();
    renderStudents();
    form.reset();
});

// Edit Student
function editStudent(index) {
    const student = students[index];

    nameInput.value = student.name;
    idInput.value = student.id;
    emailInput.value = student.email;
    contactInput.value = student.contact;

    editIndex = index;
}

// Delete Student (with confirmation)
function deleteStudent(index) {
    const confirmDelete = confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    students.splice(index, 1);
    saveToLocalStorage();
    renderStudents();
}

// Initial Render
renderStudents();

