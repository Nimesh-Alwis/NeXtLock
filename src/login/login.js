document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const profilesView = document.getElementById("profilesView");
    const createProfileView = document.getElementById("createProfileView");
    const unlockProfileView = document.getElementById("unlockProfileView");
    const profilesGrid = document.getElementById("profilesGrid");
    const message = document.getElementById("message");

    // Create Profile Elements
    const profileNameInput = document.getElementById("profileNameInput");
    const avatarPills = document.getElementById("avatarPills");
    const createMasterPassword = document.getElementById("createMasterPassword");
    const confirmMasterPassword = document.getElementById("confirmMasterPassword");
    const toggleCreatePwd = document.getElementById("toggleCreatePwd");
    const toggleConfirmPwd = document.getElementById("toggleConfirmPwd");
    const strengthBar = document.getElementById("strengthBar");
    const strengthLabel = document.getElementById("strengthLabel");
    const submitCreateProfileBtn = document.getElementById("submitCreateProfileBtn");
    const cancelCreateProfileBtn = document.getElementById("cancelCreateProfileBtn");

    // Unlock Profile Elements
    const selectedAvatar = document.getElementById("selectedAvatar");
    const selectedName = document.getElementById("selectedName");
    const unlockMasterPassword = document.getElementById("unlockMasterPassword");
    const toggleUnlockPwd = document.getElementById("toggleUnlockPwd");
    const unlockProfileBtn = document.getElementById("unlockProfileBtn");
    const backToProfilesBtn = document.getElementById("backToProfilesBtn");

    // Photo Upload Elements
    const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
    const profilePicInput = document.getElementById("profilePicInput");
    const avatarPreview = document.getElementById("avatarPreview");

    let selectedAvatarValue = "👤";
    let activeSelectedProfile = null;

    if (uploadPhotoBtn && profilePicInput) {
        uploadPhotoBtn.addEventListener("click", () => profilePicInput.click());

        profilePicInput.addEventListener("change", function (e) {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 2 * 1024 * 1024) {
                showMessage("Image size should be less than 2MB.");
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                selectedAvatarValue = event.target.result;
                if (avatarPreview) {
                    avatarPreview.innerHTML = `<img src="${selectedAvatarValue}" alt="Profile Picture">`;
                }
                document.querySelectorAll(".avatar-pill").forEach(p => p.classList.remove("active"));
            };
            reader.readAsDataURL(file);
        });
    }

    // Avatar Selection
    if (avatarPills) {
        avatarPills.addEventListener("click", function (e) {
            const pill = e.target.closest(".avatar-pill");
            if (pill) {
                document.querySelectorAll(".avatar-pill").forEach(p => p.classList.remove("active"));
                pill.classList.add("active");
                selectedAvatarValue = pill.getAttribute("data-avatar") || "👤";
                if (avatarPreview) {
                    avatarPreview.textContent = selectedAvatarValue;
                }
            }
        });
    }

    // Load & Migrate Profiles Data
    function getProfiles() {
        let profiles = [];
        try {
            const raw = localStorage.getItem("profiles");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) profiles = parsed;
            }
        } catch (e) {
            profiles = [];
        }

        // Migration for legacy single-user vaults
        const legacyPwd = localStorage.getItem("masterPassword");
        if (legacyPwd && profiles.length === 0) {
            const legacyProfile = {
                id: "prof_default",
                name: "My Vault",
                avatar: "🔒",
                password: legacyPwd,
                created: new Date().toLocaleDateString()
            };
            profiles.push(legacyProfile);

            // Copy legacy categories and accounts to profile specific keys
            const legacyCats = localStorage.getItem("categories");
            const legacyAccs = localStorage.getItem("accounts");
            const legacyIcons = localStorage.getItem("categoryIcons");

            if (legacyCats) localStorage.setItem("categories_prof_default", legacyCats);
            if (legacyAccs) localStorage.setItem("accounts_prof_default", legacyAccs);
            if (legacyIcons) localStorage.setItem("categoryIcons_prof_default", legacyIcons);

            localStorage.setItem("profiles", JSON.stringify(profiles));
        }

        return profiles;
    }

    function showMessage(msg, type = "error") {
        message.textContent = msg;
        message.style.color = type === "success" ? "#10b981" : "#ef4444";
    }

    function clearMessage() {
        message.textContent = "";
    }

    // Toggle Eye Handlers
    function setupPasswordToggle(button, input) {
        if (!button || !input) return;
        button.addEventListener("click", function () {
            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            button.style.color = isPassword ? "#60a5fa" : "#9ca3af";
        });
    }

    setupPasswordToggle(toggleCreatePwd, createMasterPassword);
    setupPasswordToggle(toggleConfirmPwd, confirmMasterPassword);
    setupPasswordToggle(toggleUnlockPwd, unlockMasterPassword);

    // Strength Evaluator
    if (createMasterPassword) {
        createMasterPassword.addEventListener("input", function () {
            const val = this.value;
            let score = 0;
            if (val.length >= 6) score += 25;
            if (val.length >= 10) score += 25;
            if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score += 25;
            if (/[^A-Za-z0-9]/.test(val)) score += 25;

            strengthBar.style.width = score + "%";
            if (score <= 25) {
                strengthBar.style.backgroundColor = "#ef4444";
                strengthLabel.textContent = "Strength: Weak";
                strengthLabel.style.color = "#ef4444";
            } else if (score <= 50) {
                strengthBar.style.backgroundColor = "#f59e0b";
                strengthLabel.textContent = "Strength: Fair";
                strengthLabel.style.color = "#f59e0b";
            } else if (score <= 75) {
                strengthBar.style.backgroundColor = "#3b82f6";
                strengthLabel.textContent = "Strength: Good";
                strengthLabel.style.color = "#3b82f6";
            } else {
                strengthBar.style.backgroundColor = "#10b981";
                strengthLabel.textContent = "Strength: Strong (Master Class)";
                strengthLabel.style.color = "#10b981";
            }
        });
    }

    // Render Profiles Screen
    function renderProfilesView() {
        clearMessage();
        profilesView.classList.remove("hidden");
        createProfileView.classList.add("hidden");
        unlockProfileView.classList.add("hidden");

        const profiles = getProfiles();
        profilesGrid.innerHTML = "";

        // If no profiles exist, directly show Create Profile screen
        if (profiles.length === 0) {
            showCreateProfileView();
            return;
        }

        profiles.forEach(prof => {
            const card = document.createElement("div");
            card.className = "profile-card";

            const isImage = prof.avatar && (prof.avatar.startsWith("data:image") || prof.avatar.startsWith("http"));
            const avatarHtml = isImage 
                ? `<img src="${prof.avatar}" class="prof-img" alt="${prof.name}">` 
                : `<div class="prof-avatar">${prof.avatar || "👤"}</div>`;

            card.innerHTML = `
                <button class="prof-delete-btn" title="Delete Profile">&times;</button>
                ${avatarHtml}
                <div class="prof-name">${prof.name}</div>
            `;

            // Click to Unlock Profile
            card.addEventListener("click", function (e) {
                if (e.target.closest(".prof-delete-btn")) return;
                showUnlockProfileView(prof);
            });

            // Delete Profile
            const deleteBtn = card.querySelector(".prof-delete-btn");
            deleteBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete profile "${prof.name}" and all its saved passwords?`)) {
                    deleteProfile(prof.id);
                }
            });

            profilesGrid.appendChild(card);
        });

        // "+ Create New Profile" Card
        const createCard = document.createElement("div");
        createCard.className = "profile-card create-card";
        createCard.innerHTML = `
            <div class="prof-avatar">➕</div>
            <div class="prof-name" style="color: #60a5fa;">New Profile</div>
        `;
        createCard.addEventListener("click", showCreateProfileView);
        profilesGrid.appendChild(createCard);
    }

    function showCreateProfileView() {
        clearMessage();
        profilesView.classList.add("hidden");
        createProfileView.classList.remove("hidden");
        unlockProfileView.classList.add("hidden");

        profileNameInput.value = "";
        createMasterPassword.value = "";
        confirmMasterPassword.value = "";
        selectedAvatarValue = "👤";
        if (avatarPreview) avatarPreview.textContent = "👤";
        strengthBar.style.width = "0%";
        strengthLabel.textContent = "Password Strength: -";
        profileNameInput.focus();
    }

    function showUnlockProfileView(prof) {
        clearMessage();
        activeSelectedProfile = prof;
        profilesView.classList.add("hidden");
        createProfileView.classList.add("hidden");
        unlockProfileView.classList.remove("hidden");

        const isImage = prof.avatar && (prof.avatar.startsWith("data:image") || prof.avatar.startsWith("http"));
        if (isImage) {
            selectedAvatar.innerHTML = `<img src="${prof.avatar}" class="sel-img" alt="${prof.name}">`;
        } else {
            selectedAvatar.textContent = prof.avatar || "👤";
        }

        selectedName.textContent = prof.name;
        unlockMasterPassword.value = "";
        unlockMasterPassword.focus();
    }

    function deleteProfile(profId) {
        let profiles = getProfiles();
        profiles = profiles.filter(p => p.id !== profId);
        localStorage.setItem("profiles", JSON.stringify(profiles));

        // Clear profile vault data
        localStorage.removeItem(`categories_${profId}`);
        localStorage.removeItem(`accounts_${profId}`);
        localStorage.removeItem(`categoryIcons_${profId}`);

        if (localStorage.getItem("activeProfileId") === profId) {
            localStorage.removeItem("activeProfileId");
        }

        renderProfilesView();
        showMessage("Profile deleted successfully.", "success");
    }

    // Handlers for Creation
    if (submitCreateProfileBtn) {
        submitCreateProfileBtn.addEventListener("click", handleCreateProfile);
    }
    if (cancelCreateProfileBtn) {
        cancelCreateProfileBtn.addEventListener("click", renderProfilesView);
    }

    [profileNameInput, createMasterPassword, confirmMasterPassword].forEach(inp => {
        if (inp) {
            inp.addEventListener("keypress", function (e) {
                if (e.key === "Enter") handleCreateProfile();
            });
        }
    });

    function handleCreateProfile() {
        const name = profileNameInput.value.trim();
        const pwd = createMasterPassword.value.trim();
        const confirmPwd = confirmMasterPassword.value.trim();

        if (!name || !pwd || !confirmPwd) {
            showMessage("Please fill in all fields.");
            return;
        }

        if (pwd !== confirmPwd) {
            showMessage("Passwords do not match.");
            return;
        }

        if (pwd.length < 4) {
            showMessage("Password must be at least 4 characters.");
            return;
        }

        const profiles = getProfiles();

        // Check duplicate profile name
        if (profiles.some(p => p.name.toLowerCase() === name.toLowerCase())) {
            showMessage(`A profile named "${name}" already exists.`);
            return;
        }

        const newProfile = {
            id: `prof_${Date.now()}`,
            name: name,
            avatar: selectedAvatarValue,
            password: pwd,
            created: new Date().toLocaleDateString()
        };

        profiles.push(newProfile);
        localStorage.setItem("profiles", JSON.stringify(profiles));

        // Automatically set active profile session
        localStorage.setItem("activeProfileId", newProfile.id);
        localStorage.setItem("masterPassword", newProfile.password); // for legacy checks

        showMessage(`Profile "${name}" created! Opening vault...`, "success");
        setTimeout(() => {
            window.location.href = "../ui/index.html";
        }, 600);
    }

    // Handlers for Unlock
    if (unlockProfileBtn) {
        unlockProfileBtn.addEventListener("click", handleUnlockProfile);
    }
    if (backToProfilesBtn) {
        backToProfilesBtn.addEventListener("click", renderProfilesView);
    }
    if (unlockMasterPassword) {
        unlockMasterPassword.addEventListener("keypress", function (e) {
            if (e.key === "Enter") handleUnlockProfile();
        });
    }

    function handleUnlockProfile() {
        if (!activeSelectedProfile) return;

        const pwd = unlockMasterPassword.value.trim();
        if (pwd === activeSelectedProfile.password) {
            localStorage.setItem("activeProfileId", activeSelectedProfile.id);
            localStorage.setItem("masterPassword", activeSelectedProfile.password); // for legacy checks
            showMessage("Access Granted! Unlocking vault...", "success");

            setTimeout(() => {
                window.location.href = "../ui/index.html";
            }, 400);
        } else {
            showMessage("Incorrect Password for profile.");
            unlockMasterPassword.value = "";
            unlockMasterPassword.focus();
        }
    }



    // Initialize
    renderProfilesView();
});