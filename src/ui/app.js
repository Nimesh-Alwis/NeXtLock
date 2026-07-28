document.addEventListener("DOMContentLoaded", function () {
    // Redirect to login if not authenticated
    if (!localStorage.getItem("masterPassword")) {
        window.location.href = "../login/login.html";
        return;
    }

    let categories = JSON.parse(localStorage.getItem("categories") || "[]");
    let accountsData = JSON.parse(localStorage.getItem("accounts") || "{}");

    // Initialize default categories if none exist
    if (categories.length === 0) {
        categories = ["Work", "Social Media", "Streaming", "Banking"];
        localStorage.setItem("categories", JSON.stringify(categories));
    }

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
    const iconOpts = document.querySelectorAll(".icon-opt");
    
    let selectedIcon = "📁";

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

    // Icon Selector Listener
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
        const iconMap = JSON.parse(localStorage.getItem("categoryIcons") || "{}");
        iconMap[name] = selectedIcon;
        localStorage.setItem("categoryIcons", JSON.stringify(iconMap));

        renderCategories();
        closeModal();
        showToast(`Category "${name}" created!`);
    });

    // Live Search Filter
    searchCategoryInput.addEventListener("input", function () {
        renderCategories(this.value.trim().toLowerCase());
    });

    function getCategoryIcon(catName) {
        const iconMap = JSON.parse(localStorage.getItem("categoryIcons") || "{}");
        if (iconMap[catName]) return iconMap[catName];
        
        const lower = catName.toLowerCase();
        if (lower.includes("work") || lower.includes("job")) return "💼";
        if (lower.includes("social") || lower.includes("media")) return "👥";
        if (lower.includes("stream") || lower.includes("video")) return "📺";
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
                    const iconMap = JSON.parse(localStorage.getItem("categoryIcons") || "{}");
                    if (iconMap[category]) {
                        iconMap[trimmed] = iconMap[category];
                        delete iconMap[category];
                        localStorage.setItem("categoryIcons", JSON.stringify(iconMap));
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

                    const iconMap = JSON.parse(localStorage.getItem("categoryIcons") || "{}");
                    if (iconMap[category]) {
                        delete iconMap[category];
                        localStorage.setItem("categoryIcons", JSON.stringify(iconMap));
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