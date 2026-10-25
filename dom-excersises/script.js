
const skills = ["HTML", "CSS", "JavaScript", "Python"];

const form = document.getElementById("skill-form");
const skillInput = document.getElementById("skill-input");
const searchInput = document.getElementById("search-input");
const skillList = document.getElementById("skill-list");
const skillCount = document.getElementById("skill-count");
const message = document.getElementById("message");

function displaySkills() {
    const searchText = searchInput.value.trim().toLowerCase();

    const filteredSkills = skills.filter(skill =>
        skill.toLowerCase().includes(searchText)
    );

    skillList.replaceChildren();

    const skillElements = filteredSkills.map(skill => {
        const li = document.createElement("li");
        li.textContent = skill;
        return li;
    });

    skillElements.forEach(element => {
        skillList.appendChild(element);
    });

    skillCount.textContent =
        `Showing ${filteredSkills.length} of ${skills.length} skills`;

    if (filteredSkills.length === 0) {
        message.textContent = "No matching skills found.";
    } else {
        message.textContent = "";
    }
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const newSkill = skillInput.value.trim();

    if (newSkill === "") {
        return;
    }

    const existingSkill = skills.find(skill =>
        skill.toLowerCase() === newSkill.toLowerCase()
    );

    if (existingSkill) {
        message.textContent = "This skill already exists.";
        return;
    }

    skills.push(newSkill);

    skillInput.value = "";
    searchInput.value = "";

    displaySkills();
});

searchInput.addEventListener("input", displaySkills);

displaySkills();
