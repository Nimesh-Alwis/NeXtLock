document.addEventListener("DOMContentLoaded", function () {
    // Redirect to login if not authenticated
    if (!localStorage.getItem("masterPassword")) {
        window.location.href = "../login/login.html";
        return;
    }

    let categories = JSON.parse(localStorage.getItem("categories") || "[]");
    let accountsData = JSON.parse(localStorage.getItem("accounts") || "{}");
    let iconMap = JSON.parse(localStorage.getItem("categoryIcons") || "{}");

    // Initialize default categories and pre-populated popular accounts if brand new
    if (categories.length === 0) {
        categories = ["Social Media", "Work & Professional", "Streaming & Entertainment", "Banking & Finance"];
        localStorage.setItem("categories", JSON.stringify(categories));

        // Default Icon mappings
        iconMap = {
            "Social Media": "💬",
            "Work & Professional": "💼",
            "Streaming & Entertainment": "📺",
            "Banking & Finance": "🏦"
        };
        localStorage.setItem("categoryIcons", JSON.stringify(iconMap));
    }

    // Pre-populate main social media and popular accounts if empty or not fully populated
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

    localStorage.setItem("accounts", JSON.stringify(accountsData));

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

    // Lock Vault Handlers
    const lockButtons = [
        document.getElementById("lockVaultBtn"),
        document.getElementById("lockVaultSidebarBtn"),
        document.getElementById("btnCloseWindow")
    ];

    lockButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", function () {
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

        if (categories.includes(name)) {
            showToast("Category already exists", "error");
            return;
        }

        categories.push(name);
        localStorage.setItem("categories", JSON.stringify(categories));
        
        // Save category icon mapping
        const icons = JSON.parse(localStorage.getItem("categoryIcons") || "{}");
        icons[name] = selectedIcon;
        localStorage.setItem("categoryIcons", JSON.stringify(icons));

        renderCategories();
        closeModal();
        showToast(`Category "${name}" created with icon ${selectedIcon}`);
    });

    // Live Search Filter
    searchCategoryInput.addEventListener("input", function () {
        renderCategories(this.value.trim().toLowerCase());
    });

    function getCategoryIcon(catName) {
        const icons = JSON.parse(localStorage.getItem("categoryIcons") || "{}");
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

    function renderCategories(filterQuery = "") {
        categoryList.innerHTML = "";
        
        const filtered = categories.filter(cat => cat.toLowerCase().includes(filterQuery));
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
            
            const icon = getCategoryIcon(category);

            card.innerHTML = `
                <div class="category-header">
                    <div class="category-icon">${icon}</div>
                    <div class="card-actions">
                        <button class="action-btn rename-btn" title="Rename Category">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="action-btn delete-btn" title="Delete Category">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
                <div class="category-name">${category}</div>
                <div class="category-count">${catAccounts.length} ${catAccounts.length === 1 ? 'account' : 'accounts'}</div>
            `;

            // Open Accounts Page on Click
            card.addEventListener("click", function () {
                localStorage.setItem("selectedCategory", category);
                window.location.href = "accounts/accounts.html";
            });

            // Rename Handler
            const renameBtn = card.querySelector(".rename-btn");
            renameBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                const newName = prompt("Enter new category name:", category);
                if (newName && newName.trim() !== "" && newName.trim() !== category) {
                    const trimmed = newName.trim();
                    if (categories.includes(trimmed)) {
                        showToast("Category name already exists", "error");
                        return;
                    }
                    const idx = categories.indexOf(category);
                    categories[idx] = trimmed;

                    // Migrate accounts under this category
                    if (accountsData[category]) {
                        accountsData[trimmed] = accountsData[category];
                        delete accountsData[category];
                        localStorage.setItem("accounts", JSON.stringify(accountsData));
                    }

                    // Migrate icon
                    const icons = JSON.parse(localStorage.getItem("categoryIcons") || "{}");
                    if (icons[category]) {
                        icons[trimmed] = icons[category];
                        delete icons[category];
                        localStorage.setItem("categoryIcons", JSON.stringify(icons));
                    }

                    localStorage.setItem("categories", JSON.stringify(categories));
                    renderCategories();
                    showToast("Category renamed!");
                }
            });

            // Delete Handler
            const deleteBtn = card.querySelector(".delete-btn");
            deleteBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete "${category}" and all its passwords?`)) {
                    const idx = categories.indexOf(category);
                    categories.splice(idx, 1);
                    delete accountsData[category];

                    const icons = JSON.parse(localStorage.getItem("categoryIcons") || "{}");
                    if (icons[category]) {
                        delete icons[category];
                        localStorage.setItem("categoryIcons", JSON.stringify(icons));
                    }

                    localStorage.setItem("categories", JSON.stringify(categories));
                    localStorage.setItem("accounts", JSON.stringify(accountsData));
                    renderCategories();
                    showToast(`Category "${category}" deleted`);
                }
            });

            categoryList.appendChild(card);
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

    renderCategories();
});