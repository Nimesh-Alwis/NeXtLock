document.addEventListener("DOMContentLoaded", function () {
    // Auth Check
    if (!localStorage.getItem("masterPassword")) {
        window.location.href = "../../login/login.html";
        return;
    }

    const currentCategory = localStorage.getItem("selectedCategory");
    if (!currentCategory) {
        window.location.href = "../index.html";
        return;
    }

    // Title Updates
    document.getElementById("categoryTitle").textContent = currentCategory;
    document.getElementById("windowCategoryTitle").textContent = currentCategory;
    document.getElementById("activeCatNav").textContent = currentCategory;

    let accountsData = JSON.parse(localStorage.getItem("accounts") || "{}");
    let categoryAccounts = accountsData[currentCategory] || [];

    // Navigation Back
    const backBtn = document.getElementById("backBtn");
    const brandBackBtn = document.getElementById("brandBackBtn");
    const backToDashBtn = document.getElementById("backToDashBtn");
    const btnCloseWindow = document.getElementById("btnCloseWindow");

    function goToDashboard() {
        window.location.href = "../index.html";
    }

    if (backBtn) backBtn.addEventListener("click", goToDashboard);
    if (brandBackBtn) brandBackBtn.addEventListener("click", goToDashboard);
    if (backToDashBtn) backToDashBtn.addEventListener("click", goToDashboard);
    if (btnCloseWindow) btnCloseWindow.addEventListener("click", goToDashboard);

    // Elements
    const accountList = document.getElementById("accountList");
    const searchInput = document.getElementById("searchInput");

    // Modal Elements
    const addAccountModal = document.getElementById("addAccountModal");
    const openAddAccountModalBtn = document.getElementById("openAddAccountModalBtn");
    const closeAddAccountModalBtn = document.getElementById("closeAddAccountModalBtn");
    const cancelAddAccountModalBtn = document.getElementById("cancelAddAccountModalBtn");
    const addAccountBtn = document.getElementById("addAccountBtn");

    const serviceInput = document.getElementById("serviceInput");
    const usernameInput = document.getElementById("usernameInput");
    const passwordInput = document.getElementById("passwordInput");
    const togglePasswordBtn = document.getElementById("togglePasswordBtn");

    const strengthBar = document.getElementById("strengthBar");
    const strengthText = document.getElementById("strengthText");

    // Password Generator Elements
    const generateBtn = document.getElementById("generateBtn");
    const lengthSlider = document.getElementById("lengthSlider");
    const lengthVal = document.getElementById("lengthVal");
    const chkSymbols = document.getElementById("chkSymbols");
    const chkNumbers = document.getElementById("chkNumbers");

    // Backup & Restore
    const exportBtn = document.getElementById("exportBtn");
    const importBtn = document.getElementById("importBtn");
    const importFile = document.getElementById("importFile");

    // Modal Handlers
    function openModal() {
        addAccountModal.classList.remove("hidden");
        serviceInput.value = "";
        usernameInput.value = "";
        passwordInput.value = "";
        evaluateStrength("");
        serviceInput.focus();
    }

    function closeModal() {
        addAccountModal.classList.add("hidden");
    }

    if (openAddAccountModalBtn) openAddAccountModalBtn.addEventListener("click", openModal);
    if (closeAddAccountModalBtn) closeAddAccountModalBtn.addEventListener("click", closeModal);
    if (cancelAddAccountModalBtn) cancelAddAccountModalBtn.addEventListener("click", closeModal);

    // Enter Key Listeners inside Modal
    [serviceInput, usernameInput, passwordInput].forEach(inp => {
        inp.addEventListener("keypress", function (e) {
            if (e.key === "Enter") addAccountBtn.click();
        });
    });

    // Toggle Eye inside Modal
    togglePasswordBtn.addEventListener("click", function () {
        const isPass = passwordInput.type === "password";
        passwordInput.type = isPass ? "text" : "password";
        togglePasswordBtn.style.color = isPass ? "#60a5fa" : "#9ca3af";
    });

    // Password Strength Meter Listener
    passwordInput.addEventListener("input", function () {
        evaluateStrength(this.value);
    });

    function evaluateStrength(pwd) {
        let score = 0;
        if (pwd.length >= 6) score += 25;
        if (pwd.length >= 12) score += 25;
        if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score += 25;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 25;

        strengthBar.style.width = score + "%";
        if (score <= 25) {
            strengthBar.style.backgroundColor = "#ef4444";
            strengthText.textContent = "Strength: Weak";
            strengthText.style.color = "#ef4444";
        } else if (score <= 50) {
            strengthBar.style.backgroundColor = "#f59e0b";
            strengthText.textContent = "Strength: Fair";
            strengthText.style.color = "#f59e0b";
        } else if (score <= 75) {
            strengthBar.style.backgroundColor = "#3b82f6";
            strengthText.textContent = "Strength: Good";
            strengthText.style.color = "#3b82f6";
        } else {
            strengthBar.style.backgroundColor = "#10b981";
            strengthText.textContent = "Strength: Strong (Vault Certified)";
            strengthText.style.color = "#10b981";
        }
    }

    // Password Generator
    lengthSlider.addEventListener("input", function () {
        lengthVal.textContent = this.value;
    });

    generateBtn.addEventListener("click", function () {
        const length = parseInt(lengthSlider.value);
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const nums = "0123456789";
        const syms = "!@#$%^&*()_+-=[]{}|;:,.<>?";

        let validPool = chars;
        if (chkNumbers.checked) validPool += nums;
        if (chkSymbols.checked) validPool += syms;

        let result = "";
        for (let i = 0; i < length; i++) {
            result += validPool.charAt(Math.floor(Math.random() * validPool.length));
        }

        passwordInput.value = result;
        passwordInput.type = "text";
        togglePasswordBtn.style.color = "#60a5fa";
        evaluateStrength(result);
        showToast("Strong Password Generated!");
    });

    // Add Account Handler
    addAccountBtn.addEventListener("click", function () {
        const service = serviceInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!service || !username || !password) {
            showToast("Please fill in all fields", "error");
            return;
        }

        const newAccount = {
            id: Date.now().toString(),
            service,
            username,
            password,
            created: new Date().toLocaleDateString()
        };

        categoryAccounts.push(newAccount);
        accountsData[currentCategory] = categoryAccounts;
        localStorage.setItem("accounts", JSON.stringify(accountsData));

        renderAccounts();
        closeModal();
        showToast(`Account "${service}" saved!`);
    });

    // Search Account Filter
    searchInput.addEventListener("input", function () {
        renderAccounts(this.value.trim().toLowerCase());
    });

    function getBrandIcon(serviceName) {
        const s = serviceName.toLowerCase();
        if (s.includes("google") || s.includes("gmail")) return "🌐";
        if (s.includes("facebook") || s.includes("fb") || s.includes("meta")) return "👥";
        if (s.includes("github") || s.includes("git")) return "🐙";
        if (s.includes("netflix") || s.includes("hulu") || s.includes("disney")) return "📺";
        if (s.includes("bank") || s.includes("paypal") || s.includes("stripe") || s.includes("visa")) return "🏦";
        if (s.includes("apple") || s.includes("icloud")) return "🍎";
        if (s.includes("amazon")) return "📦";
        if (s.includes("twitter") || s.includes("x.com")) return "🐦";
        if (s.includes("spotify")) return "🎵";
        return "🔑";
    }

    // Robust Clipboard Copy Fallback
    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        } else {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            return Promise.resolve();
        }
    }

    function renderAccounts(filterQuery = "") {
        accountList.innerHTML = "";

        const filtered = categoryAccounts.filter(acc => 
            acc.service.toLowerCase().includes(filterQuery) || 
            acc.username.toLowerCase().includes(filterQuery)
        );

        if (filtered.length === 0) {
            accountList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔐</div>
                    <div class="empty-title">No Accounts Found</div>
                    <div class="empty-desc">Click "+ Add Account" to save credentials for ${currentCategory}.</div>
                    <button class="btn-primary" style="margin: 0 auto;" id="emptyAddAccBtn">+ Add Account</button>
                </div>
            `;
            const emptyAddAccBtn = document.getElementById("emptyAddAccBtn");
            if (emptyAddAccBtn) emptyAddAccBtn.addEventListener("click", openModal);
            return;
        }

        filtered.forEach(acc => {
            const card = document.createElement("div");
            card.className = "account-card";
            const icon = getBrandIcon(acc.service);

            card.innerHTML = `
                <div class="account-info">
                    <div class="brand-icon-box">${icon}</div>
                    <div class="account-meta">
                        <div class="account-service">${acc.service}</div>
                        <div class="account-user">${acc.username}</div>
                    </div>
                </div>

                <div class="account-secret">
                    <span class="masked-pass">••••••••</span>
                    <button class="btn-icon-action card-eye-btn" title="Show/Hide Password">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                </div>

                <div class="account-actions">
                    <button class="btn-icon-action copy-user-btn" title="Copy Username">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        <span>User</span>
                    </button>

                    <button class="btn-icon-action copy-pass-btn" title="Copy Password">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        <span>Pass</span>
                    </button>

                    <button class="btn-icon-action delete-btn" title="Delete Account">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            `;

            // Mask/Unmask Handler
            const passSpan = card.querySelector(".masked-pass");
            const cardEyeBtn = card.querySelector(".card-eye-btn");
            cardEyeBtn.addEventListener("click", function () {
                const isMasked = passSpan.classList.contains("unmasked");
                if (isMasked) {
                    passSpan.textContent = "••••••••";
                    passSpan.classList.remove("unmasked");
                    cardEyeBtn.style.color = "var(--text-main)";
                } else {
                    passSpan.textContent = acc.password;
                    passSpan.classList.add("unmasked");
                    cardEyeBtn.style.color = "#60a5fa";
                }
            });

            // Copy Username Handler
            const copyUserBtn = card.querySelector(".copy-user-btn");
            copyUserBtn.addEventListener("click", function () {
                copyToClipboard(acc.username).then(() => {
                    showToast(`Copied Username: ${acc.username}`);
                });
            });

            // Copy Password Handler
            const copyPassBtn = card.querySelector(".copy-pass-btn");
            copyPassBtn.addEventListener("click", function () {
                copyToClipboard(acc.password).then(() => {
                    showToast(`Password copied for ${acc.service}!`);
                });
            });

            // Delete Account Handler
            const deleteBtn = card.querySelector(".delete-btn");
            deleteBtn.addEventListener("click", function () {
                if (confirm(`Delete credentials for "${acc.service}"?`)) {
                    const idx = categoryAccounts.findIndex(a => a.id === acc.id);
                    if (idx > -1) {
                        categoryAccounts.splice(idx, 1);
                        accountsData[currentCategory] = categoryAccounts;
                        localStorage.setItem("accounts", JSON.stringify(accountsData));
                        renderAccounts();
                        showToast(`Deleted ${acc.service}`);
                    }
                }
            });

            accountList.appendChild(card);
        });
    }

    // Export Backup JSON
    exportBtn.addEventListener("click", function () {
        const backupData = {
            version: "1.0",
            timestamp: new Date().toISOString(),
            categories: JSON.parse(localStorage.getItem("categories") || "[]"),
            accounts: JSON.parse(localStorage.getItem("accounts") || "{}")
        };

        const jsonStr = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `NeXtLock_Backup_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Backup file downloaded!");
    });

    // Import Backup JSON
    importBtn.addEventListener("click", function () {
        importFile.click();
    });

    importFile.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const imported = JSON.parse(event.target.result);
                if (imported.categories && imported.accounts) {
                    localStorage.setItem("categories", JSON.stringify(imported.categories));
                    localStorage.setItem("accounts", JSON.stringify(imported.accounts));
                    
                    accountsData = imported.accounts;
                    categoryAccounts = accountsData[currentCategory] || [];
                    
                    renderAccounts();
                    showToast("Vault restored from backup successfully!");
                } else {
                    showToast("Invalid backup file format", "error");
                }
            } catch (err) {
                showToast("Failed to parse backup JSON", "error");
            }
        };
        reader.readAsText(file);
    });

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

    renderAccounts();
});