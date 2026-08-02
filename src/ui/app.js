document.addEventListener("DOMContentLoaded", function () {
    const activeProfileId = localStorage.getItem("activeProfileId");

    // Redirect to login if not authenticated
    if (!localStorage.getItem("masterPassword") || !activeProfileId) {
        window.location.href = "../login/login.html";
        return;
    }
    //profileup
    // Get Active Profile Object
    const profiles = JSON.parse(localStorage.getItem("profiles") || "[]");
    const activeProfile = profiles.find(p => p.id === activeProfileId) || { name: "My Vault", avatar: "👤" };

    // Update Profile Badge in Header
    const userBadge = document.getElementById("lockVaultBtn");
    if (userBadge) {
        const isImage = activeProfile.avatar && (activeProfile.avatar.startsWith("data:image") || activeProfile.avatar.startsWith("http"));
        const avatarHtml = isImage
            ? `<img src="${activeProfile.avatar}" style="width:20px;height:20px;border-radius:50%;object-fit:cover;" alt="Avatar">`
            : `<span>${activeProfile.avatar || "👤"}</span>`;

        userBadge.innerHTML = `
            ${avatarHtml}
            <span>${activeProfile.name}</span>
            <span style="opacity: 0.6; margin-left: 4px;">• Lock</span>
        `;
    }

    // Isolated Keys per Profile
    const catKey = `categories_${activeProfileId}`;
    const accKey = `accounts_${activeProfileId}`;
    const iconKey = `categoryIcons_${activeProfileId}`;

    let categories = [];
    let accountsData = {};
    let iconMap = {};

    try {
        const rawCat = localStorage.getItem(catKey);
        if (rawCat) {
            const parsed = JSON.parse(rawCat);
            if (Array.isArray(parsed)) categories = parsed;
        }
    } catch (e) {
        categories = [];
    }

    try {
        const rawAcc = localStorage.getItem(accKey);
        if (rawAcc) {
            const parsed = JSON.parse(rawAcc);
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) accountsData = parsed;
        }
    } catch (e) {
        accountsData = {};
    }

    try {
        const rawIcon = localStorage.getItem(iconKey);
        if (rawIcon) {
            const parsed = JSON.parse(rawIcon);
            if (parsed && typeof parsed === "object") iconMap = parsed;
        }
    } catch (e) {
        iconMap = {};
    }

    // Clean & Deduplicate Category Array (100% Fail-Safe)
    function sanitizeCategories(catList) {
        const result = [];
        const seen = new Set();
        if (!Array.isArray(catList)) return result;
        catList.forEach(item => {
            if (item && typeof item === "string") {
                const trimmed = item.trim();
                const lower = trimmed.toLowerCase();
                if (trimmed && !seen.has(lower)) {
                    seen.add(lower);
                    result.push(trimmed);
                }
            }
        });
        return result;
    }

    categories = sanitizeCategories(categories);

    // Initialize default categories if empty
    if (categories.length === 0) {
        categories = ["🕵️ Hidden Vault", "Social Media", "Work & Professional", "Streaming & Entertainment", "Banking & Finance"];
        iconMap = {
            "🕵️ Hidden Vault": "🕵️",
            "Social Media": "💬",
            "Work & Professional": "💼",
            "Streaming & Entertainment": "📺",
            "Banking & Finance": "🏦"
        };
        localStorage.setItem(iconKey, JSON.stringify(iconMap));
    }

    // Ensure built-in Hidden Vault is always included at top
    const hvIndex = categories.findIndex(c => typeof c === "string" && c.toLowerCase().includes("hidden vault"));
    if (hvIndex === -1) {
        categories.unshift("🕵️ Hidden Vault");
    } else if (hvIndex > 0) {
        const hvItem = categories.splice(hvIndex, 1)[0];
        categories.unshift(hvItem);
    }
    iconMap["🕵️ Hidden Vault"] = "🕵️";

    localStorage.setItem(catKey, JSON.stringify(categories));
    localStorage.setItem(iconKey, JSON.stringify(iconMap));

    // Pre-populate default accounts if empty
    if (!accountsData["Social Media"] || accountsData["Social Media"].length < 6) {
        accountsData["Social Media"] = [
            { id: "sm-1", service: "Instagram", username: "@insta_official", password: "InstaSecurePass!99", created: new Date().toLocaleDateString() },
            { id: "sm-2", service: "Facebook", username: "user.meta@facebook.com", password: "FacebookPass#2026", created: new Date().toLocaleDateString() },
            { id: "sm-3", service: "Snapchat", username: "snap_user2026", password: "SnapchatKeyPass#2026", created: new Date().toLocaleDateString() },
            { id: "sm-4", service: "WhatsApp", username: "+94 77 123 4567", password: "WhatsAppPass#2026", created: new Date().toLocaleDateString() },
            { id: "sm-5", service: "TikTok", username: "@tiktok_creator", password: "TikTokPassword#2026", created: new Date().toLocaleDateString() },
            { id: "sm-6", service: "Telegram", username: "@telegram_user", password: "TelegramSecret#2026", created: new Date().toLocaleDateString() },
            { id: "sm-7", service: "X (Twitter)", username: "@x_handle", password: "TwitterPasskey#2026", created: new Date().toLocaleDateString() },
            { id: "sm-8", service: "YouTube", username: "channel@youtube.com", password: "YTStreamPass#2026", created: new Date().toLocaleDateString() },
            { id: "sm-9", service: "Reddit", username: "u/reddit_user", password: "RedditKarmaPass#2026", created: new Date().toLocaleDateString() },
            { id: "sm-10", service: "Pinterest", username: "pinterest_pins", password: "PinterestPin#2026", created: new Date().toLocaleDateString() },
            { id: "sm-11", service: "LinkedIn", username: "user@linkedin.com", password: "LinkedInWorkKey#2026", created: new Date().toLocaleDateString() },
            { id: "sm-12", service: "Google / Gmail", username: "user@gmail.com", password: "GoogleVaultKey#2026", created: new Date().toLocaleDateString() }
        ];
    }

    if (!accountsData["Work & Professional"]) {
        accountsData["Work & Professional"] = [
            { id: "wk-1", service: "GitHub", username: "dev_user", password: "GitHubSecretKey!88", created: new Date().toLocaleDateString() },
            { id: "wk-2", service: "Slack", username: "work@company.com", password: "SlackCompanyPass#2026", created: new Date().toLocaleDateString() },
            { id: "wk-3", service: "Microsoft 365", username: "user@office.com", password: "MS365Passcode#1", created: new Date().toLocaleDateString() }
        ];
    }

    if (!accountsData["Streaming & Entertainment"]) {
        accountsData["Streaming & Entertainment"] = [
            { id: "st-1", service: "Netflix", username: "movie_lover@gmail.com", password: "NetflixStreamPass#2026", created: new Date().toLocaleDateString() },
            { id: "st-2", service: "Spotify", username: "music_fan@gmail.com", password: "SpotifyMusicPass#2026", created: new Date().toLocaleDateString() },
            { id: "st-3", service: "YouTube Premium", username: "user@gmail.com", password: "YTPremiumPass#2026", created: new Date().toLocaleDateString() }
        ];
    }

    if (!accountsData["Banking & Finance"]) {
        accountsData["Banking & Finance"] = [
            { id: "fn-1", service: "PayPal", username: "pay@example.com", password: "PayPalSecure$2026", created: new Date().toLocaleDateString() },
            { id: "fn-2", service: "Commercial Bank", username: "user_bank_id", password: "BankKeyPass#77", created: new Date().toLocaleDateString() }
        ];
    }

    localStorage.setItem(accKey, JSON.stringify(accountsData));

    const categoryList = document.getElementById("categoryList");
    const searchCategoryInput = document.getElementById("searchCategoryInput");
    const totalCategoryBadge = document.getElementById("totalCategoryBadge");

    // Modal Elements
    const addCategoryModal = document.getElementById("addCategoryModal");
    const openAddCategoryModalBtn = document.getElementById("openAddCategoryModalBtn");
    const quickAddCategoryBtn = document.getElementById("quickAddCategoryBtn");
    const closeCategoryModalBtn = document.getElementById("closeCategoryModalBtn");
    const cancelCategoryModalBtn = document.getElementById("cancelCategoryModalBtn");
    const createBtn = document.getElementById("createBtn");
    const categoryInput = document.getElementById("categoryInput");

    const emojiTabs = document.querySelectorAll(".emoji-tab");
    const iconOpts = document.querySelectorAll(".icon-opt");

    let selectedIcon = "💬";

    // Lock Vault / Switch Profile Handlers
    const lockButtons = [
        document.getElementById("lockVaultBtn"),
        document.getElementById("lockVaultSidebarBtn"),
        document.getElementById("btnCloseWindow")
    ];

    lockButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", function () {
                localStorage.removeItem("activeProfileId");
                showToast("Vault Locked");
                setTimeout(() => {
                    window.location.href = "../login/login.html";
                }, 300);
            });
        }
    });

    // Emoji Tab Filtering
    emojiTabs.forEach(tab => {
        tab.addEventListener("click", function () {
            emojiTabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
            const group = this.getAttribute("data-group");

            iconOpts.forEach(opt => {
                const optGroups = opt.getAttribute("data-group") || "";
                if (group === "popular" || optGroups.includes(group)) {
                    opt.style.display = "flex";
                } else {
                    opt.style.display = "none";
                }
            });
        });
    });

    // Emoji Selection Listener
    iconOpts.forEach(btn => {
        btn.addEventListener("click", function () {
            iconOpts.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            selectedIcon = this.getAttribute("data-icon");
        });
    });

    // Modal Control Functions
    function openModal() {
        addCategoryModal.classList.remove("hidden");
        categoryInput.value = "";
        categoryInput.focus();
    }

    function closeModal() {
        addCategoryModal.classList.add("hidden");
    }

    if (openAddCategoryModalBtn) openAddCategoryModalBtn.addEventListener("click", openModal);
    if (quickAddCategoryBtn) quickAddCategoryBtn.addEventListener("click", openModal);
    if (closeCategoryModalBtn) closeCategoryModalBtn.addEventListener("click", closeModal);
    if (cancelCategoryModalBtn) cancelCategoryModalBtn.addEventListener("click", closeModal);

    // Enter Key on Modal Input
    categoryInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") createBtn.click();
    });

    // Create Category Listener
    createBtn.addEventListener("click", function () {
        const name = categoryInput.value.trim();

        if (name === "") {
            showToast("Please enter a category name", "error");
            return;
        }

        const isDuplicate = categories.some(c => typeof c === "string" && c.trim().toLowerCase() === name.toLowerCase());
        if (isDuplicate) {
            showToast(`Category "${name}" already exists!`, "error");
            closeModal();
            return;
        }

        categories.push(name);
        localStorage.setItem(catKey, JSON.stringify(categories));

        // Save category icon mapping
        const icons = JSON.parse(localStorage.getItem(iconKey) || "{}");
        icons[name] = selectedIcon;
        localStorage.setItem(iconKey, JSON.stringify(icons));

        closeModal();
        renderCategories(searchCategoryInput ? searchCategoryInput.value.trim().toLowerCase() : "");
        showToast(`Category "${name}" created with icon ${selectedIcon}`);
    });

    // Live Search Filter
    if (searchCategoryInput) {
        searchCategoryInput.addEventListener("input", function () {
            renderCategories(this.value.trim().toLowerCase());
        });
    }

    function getCategoryIcon(catName) {
        if (!catName || typeof catName !== "string") return "📁";
        const icons = JSON.parse(localStorage.getItem(iconKey) || "{}");
        if (icons[catName]) return icons[catName];

        const lower = catName.toLowerCase();
        if (lower.includes("social") || lower.includes("media") || lower.includes("chat")) return "💬";
        if (lower.includes("work") || lower.includes("job") || lower.includes("company")) return "💼";
        if (lower.includes("stream") || lower.includes("video") || lower.includes("movie")) return "📺";
        if (lower.includes("bank") || lower.includes("finance") || lower.includes("pay")) return "🏦";
        if (lower.includes("game") || lower.includes("gaming")) return "🎮";
        if (lower.includes("crypto")) return "🪙";
        return "📁";
    }

    // Hidden Vault Double-Lock Modal Elements
    const hiddenVaultModal = document.getElementById("hiddenVaultModal");
    const closeHiddenVaultModalBtn = document.getElementById("closeHiddenVaultModalBtn");
    const cancelHiddenVaultModalBtn = document.getElementById("cancelHiddenVaultModalBtn");
    const confirmHiddenVaultBtn = document.getElementById("confirmHiddenVaultBtn");
    const hiddenVaultPassword = document.getElementById("hiddenVaultPassword");
    const toggleHiddenVaultPwd = document.getElementById("toggleHiddenVaultPwd");
    const hiddenVaultErrorMsg = document.getElementById("hiddenVaultErrorMsg");

    if (toggleHiddenVaultPwd && hiddenVaultPassword) {
        toggleHiddenVaultPwd.addEventListener("click", function () {
            const isPass = hiddenVaultPassword.type === "password";
            hiddenVaultPassword.type = isPass ? "text" : "password";
            toggleHiddenVaultPwd.style.color = isPass ? "#60a5fa" : "#9ca3af";
        });
    }

    function openHiddenVaultModal() {
        if (!hiddenVaultModal) return;
        hiddenVaultModal.classList.remove("hidden");
        hiddenVaultPassword.value = "";
        hiddenVaultErrorMsg.textContent = "";
        hiddenVaultPassword.focus();
    }

    function closeHiddenVaultModal() {
        if (!hiddenVaultModal) return;
        hiddenVaultModal.classList.add("hidden");
    }

    if (closeHiddenVaultModalBtn) closeHiddenVaultModalBtn.addEventListener("click", closeHiddenVaultModal);
    if (cancelHiddenVaultModalBtn) cancelHiddenVaultModalBtn.addEventListener("click", closeHiddenVaultModal);

    if (hiddenVaultPassword) {
        hiddenVaultPassword.addEventListener("keypress", function (e) {
            if (e.key === "Enter") confirmHiddenVaultBtn.click();
        });
    }

    if (confirmHiddenVaultBtn) {
        confirmHiddenVaultBtn.addEventListener("click", function () {
            const enteredPwd = hiddenVaultPassword.value.trim();
            if (!enteredPwd) {
                hiddenVaultErrorMsg.textContent = "Please enter your Master Password.";
                return;
            }

            if (enteredPwd !== activeProfile.password) {
                hiddenVaultErrorMsg.textContent = "Incorrect Master Password. Access Denied.";
                hiddenVaultPassword.value = "";
                hiddenVaultPassword.focus();
                return;
            }

            // Access Granted
            closeHiddenVaultModal();
            localStorage.setItem("selectedCategory", "🕵️ Hidden Vault");
            window.location.href = "accounts/accounts.html";
        });
    }

    function renderCategories(filterQuery = "") {
        categoryList.innerHTML = "";

        const safeQuery = (filterQuery || "").trim().toLowerCase();
        const filtered = categories.filter(cat => typeof cat === "string" && cat.toLowerCase().includes(safeQuery));
        totalCategoryBadge.textContent = categories.length;

        if (filtered.length === 0) {
            categoryList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📂</div>
                    <div class="empty-title">No Categories Found</div>
                    <div class="empty-desc">Create your first category to start organizing passwords.</div>
                    <button class="btn-primary" style="margin: 0 auto;" id="emptyAddBtn">+ Add Category</button>
                </div>
            `;
            const emptyBtn = document.getElementById("emptyAddBtn");
            if (emptyBtn) emptyBtn.addEventListener("click", openModal);
            return;
        }

        filtered.forEach(category => {
            const catAccounts = accountsData[category] || [];
            const card = document.createElement("div");
            card.className = "category-card";

            const isHiddenVault = category === "🕵️ Hidden Vault";
            if (isHiddenVault) {
                card.style.border = "1px solid rgba(239, 68, 68, 0.4)";
                card.style.background = "rgba(239, 68, 68, 0.05)";
            }

            const icon = getCategoryIcon(category);
            const lockBadgeHtml = isHiddenVault ? `<span class="account-count-badge" style="background:rgba(239,68,68,0.2);color:#f87171;border-color:rgba(239,68,68,0.3);">🔒 Double Locked</span>` : "";

            const actionButtonsHtml = isHiddenVault ? "" : `
                <div class="card-actions">
                    <button class="action-btn rename-btn" title="Rename Category">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="action-btn delete-btn" title="Delete Category">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            `;

            card.innerHTML = `
                <div class="category-header">
                    <div class="category-icon">${icon}</div>
                    ${actionButtonsHtml}
                </div>
                <div class="category-name" style="display:flex;align-items:center;gap:6px;">
                    <span>${category}</span>
                    ${lockBadgeHtml}
                </div>
                <div class="category-count">${catAccounts.length} ${catAccounts.length === 1 ? 'account' : 'accounts'}</div>
            `;

            // Open Category Click Listener
            card.addEventListener("click", function () {
                if (isHiddenVault) {
                    openHiddenVaultModal();
                } else {
                    localStorage.setItem("selectedCategory", category);
                    window.location.href = "accounts/accounts.html";
                }
            });

            // Rename Handler
            const renameBtn = card.querySelector(".rename-btn");
            if (renameBtn) {
                renameBtn.addEventListener("click", function (e) {
                    e.stopPropagation();
                    const newName = prompt("Enter new category name:", category);
                    if (newName && newName.trim() !== "" && newName.trim() !== category) {
                        const trimmed = newName.trim();
                        const isDup = categories.some(c => c.trim().toLowerCase() === trimmed.toLowerCase() && c.trim().toLowerCase() !== category.toLowerCase());
                        if (isDup) {
                            showToast(`Category "${trimmed}" already exists!`, "error");
                            return;
                        }
                        const idx = categories.indexOf(category);
                        categories[idx] = trimmed;

                        if (accountsData[category]) {
                            accountsData[trimmed] = accountsData[category];
                            delete accountsData[category];
                            localStorage.setItem(accKey, JSON.stringify(accountsData));
                        }

                        const icons = JSON.parse(localStorage.getItem(iconKey) || "{}");
                        if (icons[category]) {
                            icons[trimmed] = icons[category];
                            delete icons[category];
                            localStorage.setItem(iconKey, JSON.stringify(icons));
                        }

                        localStorage.setItem(catKey, JSON.stringify(categories));
                        renderCategories();
                        showToast("Category renamed!");
                    }
                });
            }

            // Delete Handler
            const deleteBtn = card.querySelector(".delete-btn");
            if (deleteBtn) {
                deleteBtn.addEventListener("click", function (e) {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to delete "${category}" and all its passwords?`)) {
                        const idx = categories.indexOf(category);
                        categories.splice(idx, 1);
                        delete accountsData[category];

                        const icons = JSON.parse(localStorage.getItem(iconKey) || "{}");
                        if (icons[category]) {
                            delete icons[category];
                            localStorage.setItem(iconKey, JSON.stringify(icons));
                        }

                        localStorage.setItem(catKey, JSON.stringify(categories));
                        localStorage.setItem(accKey, JSON.stringify(accountsData));
                        renderCategories();
                        showToast(`Category "${category}" deleted`);
                    }
                });
            }

            categoryList.appendChild(card);
        });
    }

    // Secure Full Vault Export Handlers
    const openDashboardExportBtn = document.getElementById("openDashboardExportBtn");
    const exportModal = document.getElementById("exportModal");
    const closeExportModalBtn = document.getElementById("closeExportModalBtn");
    const cancelExportModalBtn = document.getElementById("cancelExportModalBtn");
    const confirmExportBtn = document.getElementById("confirmExportBtn");
    const exportMasterPassword = document.getElementById("exportMasterPassword");
    const toggleExportPwd = document.getElementById("toggleExportPwd");
    const exportErrorMsg = document.getElementById("exportErrorMsg");
    const formatCards = document.querySelectorAll(".format-card");

    if (toggleExportPwd && exportMasterPassword) {
        toggleExportPwd.addEventListener("click", function () {
            const isPass = exportMasterPassword.type === "password";
            exportMasterPassword.type = isPass ? "text" : "password";
            toggleExportPwd.style.color = isPass ? "#60a5fa" : "#9ca3af";
        });
    }

    formatCards.forEach(card => {
        card.addEventListener("click", function () {
            formatCards.forEach(c => c.classList.remove("active"));
            this.classList.add("active");
            const radio = this.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    function openExportModal() {
        if (!exportModal) return;
        exportModal.classList.remove("hidden");
        exportMasterPassword.value = "";
        exportErrorMsg.textContent = "";
        exportMasterPassword.focus();
    }

    function closeExportModal() {
        if (!exportModal) return;
        exportModal.classList.add("hidden");
    }

    if (openDashboardExportBtn) openDashboardExportBtn.addEventListener("click", openExportModal);
    if (closeExportModalBtn) closeExportModalBtn.addEventListener("click", closeExportModal);
    if (cancelExportModalBtn) cancelExportModalBtn.addEventListener("click", closeExportModal);

    if (exportMasterPassword) {
        exportMasterPassword.addEventListener("keypress", function (e) {
            if (e.key === "Enter") confirmExportBtn.click();
        });
    }

    if (confirmExportBtn) {
        confirmExportBtn.addEventListener("click", function () {
            const enteredPwd = exportMasterPassword.value.trim();

            if (!enteredPwd) {
                exportErrorMsg.textContent = "Please enter your Master Password to verify identity.";
                return;
            }

            if (enteredPwd !== activeProfile.password) {
                exportErrorMsg.textContent = "Incorrect Master Password. Verification failed.";
                exportMasterPassword.value = "";
                exportMasterPassword.focus();
                return;
            }

            const selectedRadio = document.querySelector('input[name="exportFormat"]:checked');
            const format = selectedRadio ? selectedRadio.value : "md";

            processFullVaultExport(format);
            closeExportModal();
        });
    }

    function processFullVaultExport(format) {
        const cats = JSON.parse(localStorage.getItem(catKey) || "[]");
        const accsData = JSON.parse(localStorage.getItem(accKey) || "{}");
        const profileName = activeProfile.name || "My_Vault";
        const dateStr = new Date().toISOString().slice(0, 10);
        const fileNameBase = `NeXtLock_${profileName.replace(/\s+/g, "_")}_FullVault_${dateStr}`;

        let fileContent = "";
        let mimeType = "text/plain";
        let extension = "txt";

        if (format === "md") {
            extension = "md";
            mimeType = "text/markdown";
            fileContent = `# 🔐 NeXtLock Full Vault Export - ${profileName}\n\n`;
            fileContent += `**Profile:** ${profileName}\n`;
            fileContent += `**Export Date:** ${new Date().toLocaleString()}\n`;
            fileContent += `**Total Categories:** ${cats.length}\n\n`;
            fileContent += `---\n\n`;

            cats.forEach(cat => {
                const accs = accsData[cat] || [];
                fileContent += `## 📂 Category: ${cat}\n\n`;
                if (accs.length === 0) {
                    fileContent += `*No accounts saved in this category.*\n\n`;
                } else {
                    fileContent += `| Service / Brand | Username / Email | Password | Created Date |\n`;
                    fileContent += `|---|---|---|---|\n`;
                    accs.forEach(acc => {
                        fileContent += `| ${acc.service} | \`${acc.username}\` | \`${acc.password}\` | ${acc.created || dateStr} |\n`;
                    });
                    fileContent += `\n`;
                }
            });
        } else if (format === "csv") {
            extension = "csv";
            mimeType = "text/csv";
            fileContent = `"Category","Service Name","Username / Email","Password","Created Date"\n`;
            cats.forEach(cat => {
                const accs = accsData[cat] || [];
                accs.forEach(acc => {
                    const cleanCat = `"${cat.replace(/"/g, '""')}"`;
                    const cleanServ = `"${acc.service.replace(/"/g, '""')}"`;
                    const cleanUser = `"${acc.username.replace(/"/g, '""')}"`;
                    const cleanPass = `"${acc.password.replace(/"/g, '""')}"`;
                    const cleanDate = `"${(acc.created || dateStr).replace(/"/g, '""')}"`;
                    fileContent += `${cleanCat},${cleanServ},${cleanUser},${cleanPass},${cleanDate}\n`;
                });
            });
        } else if (format === "txt") {
            extension = "txt";
            mimeType = "text/plain";
            fileContent = `==================================================\n`;
            fileContent += `NeXtLock Full Vault Credentials Export\n`;
            fileContent += `Profile Name: ${profileName}\n`;
            fileContent += `Export Date : ${new Date().toLocaleString()}\n`;
            fileContent += `==================================================\n\n`;

            cats.forEach(cat => {
                const accs = accsData[cat] || [];
                fileContent += `[ CATEGORY: ${cat.toUpperCase()} ]\n`;
                fileContent += `--------------------------------------------------\n`;
                if (accs.length === 0) {
                    fileContent += `(No accounts)\n\n`;
                } else {
                    accs.forEach(acc => {
                        fileContent += `Service  : ${acc.service}\n`;
                        fileContent += `Username : ${acc.username}\n`;
                        fileContent += `Password : ${acc.password}\n`;
                        fileContent += `Created  : ${acc.created || dateStr}\n`;
                        fileContent += `--------------------------------------------------\n`;
                    });
                    fileContent += `\n`;
                }
            });
        }

        const blob = new Blob([fileContent], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileNameBase}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast(`Full Vault exported as .${extension}!`);
    }

    // Dashboard Multi-Format Import Handler (.md, .txt, .csv)
    const openDashboardImportBtn = document.getElementById("openDashboardImportBtn");
    const dashboardImportFile = document.getElementById("dashboardImportFile");

    if (openDashboardImportBtn && dashboardImportFile) {
        openDashboardImportBtn.addEventListener("click", function () {
            dashboardImportFile.click();
        });

        dashboardImportFile.addEventListener("change", function (e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (event) {
                try {
                    const content = event.target.result;
                    const parsed = parseVaultFileContent(content, file.name);
                    const res = executeVaultImport(parsed, catKey, accKey);

                    if (res.success) {
                        // Refresh active categories list
                        try {
                            categories = JSON.parse(localStorage.getItem(catKey) || "[]");
                        } catch (err) { }
                        renderCategories();
                        showToast(`Successfully imported ${res.count} account(s) from .${file.name.split('.').pop()}`);
                    } else {
                        showToast("No valid credentials found in file", "error");
                    }
                } catch (err) {
                    showToast("Failed to parse import file", "error");
                }
                dashboardImportFile.value = "";
            };
            reader.readAsText(file);
        });
    }

    // Helper Toast Notification
    function showToast(msg, type = "info") {
        const toastContainer = document.getElementById("toastContainer");
        if (!toastContainer) return;
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerHTML = `<span>🔐</span> <span>${msg}</span>`;
        if (type === "error") toast.style.borderColor = "#ef4444";
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 2500);
    }

    // Delete Current Active Profile Handler
    const deleteProfileSidebarBtn = document.getElementById("deleteProfileSidebarBtn");
    if (deleteProfileSidebarBtn) {
        deleteProfileSidebarBtn.addEventListener("click", function () {
            const confirmDelete = confirm(`Are you sure you want to delete profile "${activeProfile.name}" and all its saved vault data? This action cannot be undone.`);
            if (confirmDelete) {
                // Delete active profile vault data
                localStorage.removeItem(catKey);
                localStorage.removeItem(accKey);
                localStorage.removeItem(iconKey);

                // Update profiles array
                let allProfiles = [];
                try {
                    const raw = localStorage.getItem("profiles");
                    if (raw) allProfiles = JSON.parse(raw);
                } catch (e) {
                    allProfiles = [];
                }

                allProfiles = allProfiles.filter(p => p.id !== activeProfileId);
                localStorage.setItem("profiles", JSON.stringify(allProfiles));

                // Clear current active session
                localStorage.removeItem("activeProfileId");
                localStorage.removeItem("masterPassword");

                alert(`Profile "${activeProfile.name}" deleted successfully.`);
                window.location.href = "../login/login.html";
            }
        });
    }

    // Multi-Format Vault Parsers & Import Execution (.md, .txt, .csv)
    function parseVaultFileContent(content, fileName) {
        if (!content) return null;
        const ext = (fileName || "").split('.').pop().toLowerCase();

        if (ext === "csv" || content.startsWith('"Category"') || content.startsWith("Category,")) {
            return parseCSVVault(content);
        } else if (ext === "md" || content.includes("## 📂 Category") || content.includes("## Category") || content.includes("|---|")) {
            return parseMarkdownVault(content);
        } else {
            return parseTextVault(content);
        }
    }

    function parseCSVVault(content) {
        const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length === 0) return null;

        const categories = new Set();
        const accounts = {};

        function parseCSVLine(line) {
            const values = [];
            let current = "";
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    if (inQuotes && line[i + 1] === '"') {
                        current += '"';
                        i++;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (char === ',' && !inQuotes) {
                    values.push(current.trim());
                    current = "";
                } else {
                    current += char;
                }
            }
            values.push(current.trim());
            return values;
        }

        let startIndex = 0;
        const firstRow = parseCSVLine(lines[0]);
        if (firstRow[0] && (firstRow[0].toLowerCase().includes("category") || firstRow[1]?.toLowerCase().includes("service"))) {
            startIndex = 1;
        }

        for (let i = startIndex; i < lines.length; i++) {
            const cols = parseCSVLine(lines[i]);
            if (cols.length < 3) continue;

            const category = cols[0] || "Imported Vault";
            const service = cols[1] || "Unnamed Service";
            const username = cols[2] || "";
            const password = cols[3] || "";
            const created = cols[4] || new Date().toLocaleDateString();

            if (service && service.toLowerCase() !== "service name") {
                categories.add(category);
                if (!accounts[category]) accounts[category] = [];
                accounts[category].push({
                    id: `imp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                    service: service,
                    username: username,
                    password: password,
                    created: created
                });
            }
        }

        return { categories: Array.from(categories), accounts };
    }

    function parseMarkdownVault(content) {
        const lines = content.split(/\r?\n/);
        const categories = new Set();
        const accounts = {};

        let currentCategory = "Imported Vault";

        lines.forEach(line => {
            const trimmed = line.trim();

            if (trimmed.startsWith("##")) {
                let catName = trimmed.replace(/^##\s*/, "").replace(/^📂\s*/, "").replace(/^Category:\s*/i, "").trim();
                if (catName) currentCategory = catName;
            } else if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
                if (trimmed.includes("---|---") || trimmed.toLowerCase().includes("service / brand") || trimmed.toLowerCase().includes("username / email")) {
                    return;
                }

                const cols = trimmed.split("|").map(c => c.trim().replace(/^`|`$/g, ""));
                if (cols.length >= 4) {
                    const service = cols[1];
                    const username = cols[2] || "";
                    const password = cols[3] || "";
                    const created = cols[4] || new Date().toLocaleDateString();

                    if (service && service.toLowerCase() !== "service" && service !== "---|---") {
                        categories.add(currentCategory);
                        if (!accounts[currentCategory]) accounts[currentCategory] = [];
                        accounts[currentCategory].push({
                            id: `imp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                            service: service,
                            username: username,
                            password: password,
                            created: created
                        });
                    }
                }
            }
        });

        return { categories: Array.from(categories), accounts };
    }

    function parseTextVault(content) {
        const lines = content.split(/\r?\n/);
        const categories = new Set();
        const accounts = {};

        let currentCategory = "Imported Vault";
        let currentAcc = {};

        function saveCurrentAcc() {
            if (currentAcc.service) {
                categories.add(currentCategory);
                if (!accounts[currentCategory]) accounts[currentCategory] = [];
                accounts[currentCategory].push({
                    id: `imp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                    service: currentAcc.service,
                    username: currentAcc.username || "",
                    password: currentAcc.password || "",
                    created: currentAcc.created || new Date().toLocaleDateString()
                });
                currentAcc = {};
            }
        }

        lines.forEach(line => {
            const trimmed = line.trim();

            if (trimmed.startsWith("[ CATEGORY:") || trimmed.startsWith("[CATEGORY:")) {
                saveCurrentAcc();
                const catName = trimmed.replace(/^\[\s*CATEGORY:\s*/i, "").replace(/\s*\]$/, "").trim();
                if (catName) currentCategory = catName;
            } else if (trimmed.startsWith("Service  :") || trimmed.startsWith("Service:")) {
                saveCurrentAcc();
                currentAcc.service = trimmed.replace(/^Service\s*:\s*/i, "").trim();
            } else if (trimmed.startsWith("Username :") || trimmed.startsWith("Username:")) {
                currentAcc.username = trimmed.replace(/^Username\s*:\s*/i, "").trim();
            } else if (trimmed.startsWith("Password :") || trimmed.startsWith("Password:")) {
                currentAcc.password = trimmed.replace(/^Password\s*:\s*/i, "").trim();
            } else if (trimmed.startsWith("Created  :") || trimmed.startsWith("Created:")) {
                currentAcc.created = trimmed.replace(/^Created\s*:\s*/i, "").trim();
            } else if (trimmed.startsWith("--------------------------------------------------")) {
                saveCurrentAcc();
            }
        });

        saveCurrentAcc();

        return { categories: Array.from(categories), accounts };
    }

    function executeVaultImport(parsedData, targetCatKey, targetAccKey) {
        if (!parsedData || !parsedData.accounts || Object.keys(parsedData.accounts).length === 0) {
            return { success: false, count: 0 };
        }

        let existingCats = JSON.parse(localStorage.getItem(targetCatKey) || "[]");
        let existingAccs = JSON.parse(localStorage.getItem(targetAccKey) || "{}");

        let totalImported = 0;

        parsedData.categories.forEach(cat => {
            if (!existingCats.includes(cat)) {
                existingCats.push(cat);
            }
        });

        Object.keys(parsedData.accounts).forEach(cat => {
            if (!existingAccs[cat]) existingAccs[cat] = [];
            parsedData.accounts[cat].forEach(newAcc => {
                const exists = existingAccs[cat].some(
                    a => a.service.toLowerCase() === newAcc.service.toLowerCase() &&
                        a.username.toLowerCase() === newAcc.username.toLowerCase()
                );
                if (!exists) {
                    existingAccs[cat].push(newAcc);
                    totalImported++;
                }
            });
        });

        localStorage.setItem(targetCatKey, JSON.stringify(existingCats));
        localStorage.setItem(targetAccKey, JSON.stringify(existingAccs));

        return { success: true, count: totalImported };
    }

    renderCategories();
});