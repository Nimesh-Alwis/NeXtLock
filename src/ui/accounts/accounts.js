document.addEventListener("DOMContentLoaded", function () {
    const activeProfileId = localStorage.getItem("activeProfileId");

    // Auth Check
    if (!localStorage.getItem("masterPassword") || !activeProfileId) {
        window.location.href = "../../login/login.html";
        return;
    }

    const catKey = "categories_" + activeProfileId;
    const accKey = "accounts_" + activeProfileId;

    const currentCategory = localStorage.getItem("selectedCategory");
    if (!currentCategory) {
        window.location.href = "../index.html";
        return;
    }

    const profiles = JSON.parse(localStorage.getItem("profiles") || "[]");
    const activeProfile = profiles.find(p => p.id === activeProfileId) || { name: "My Vault", avatar: "👤" };

    // Title Updates
    const catTitleEl = document.getElementById("categoryTitle");
    if (catTitleEl) {
        const avatarVal = activeProfile.avatar || "👤";
        if (avatarVal.startsWith("data:image") || avatarVal.startsWith("http")) {
            catTitleEl.innerHTML = `<img src="${avatarVal}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;vertical-align:middle;margin-right:10px;display:inline-block;box-shadow:0 2px 8px rgba(0,0,0,0.3);" alt="Avatar"><span>${currentCategory}</span>`;
        } else {
            catTitleEl.textContent = `${avatarVal} ${currentCategory}`;
        }
    }
    document.getElementById("windowCategoryTitle").textContent = `${activeProfile.name} • ${currentCategory}`;
    document.getElementById("activeCatNav").textContent = currentCategory;

    let accountsData = {};
    try {
        const rawAcc = localStorage.getItem(accKey);
        if (rawAcc) {
            const parsed = JSON.parse(rawAcc);
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) accountsData = parsed;
        }
    } catch (e) {
        accountsData = {};
    }

    let categoryAccounts = Array.isArray(accountsData[currentCategory]) ? accountsData[currentCategory] : [];

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

    const exportBtn = document.getElementById("exportBtn");
    const importBtn = document.getElementById("importBtn");
    const importFile = document.getElementById("importFile");

    const serviceInput = document.getElementById("serviceInput");
    const usernameInput = document.getElementById("usernameInput");
    const passwordInput = document.getElementById("passwordInput");
    const togglePasswordBtn = document.getElementById("togglePasswordBtn");

    const strengthBar = document.getElementById("strengthBar");
    const strengthText = document.getElementById("strengthText");

    // Custom Account Avatar & Notes Elements
    const accUploadPhotoBtn = document.getElementById("accUploadPhotoBtn");
    const accPhotoInput = document.getElementById("accPhotoInput");
    const accAvatarPills = document.getElementById("accAvatarPills");
    const notesInput = document.getElementById("notesInput");

    let selectedAccIconValue = "auto";

    if (accUploadPhotoBtn && accPhotoInput) {
        accUploadPhotoBtn.addEventListener("click", () => accPhotoInput.click());

        accPhotoInput.addEventListener("change", function (e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (event) {
                selectedAccIconValue = event.target.result;
                if (accAvatarPills) {
                    document.querySelectorAll(".acc-avatar-pill").forEach(p => p.classList.remove("active"));
                }
                showToast("Custom Photo selected!");
            };
            reader.readAsDataURL(file);
        });
    }

    if (accAvatarPills) {
        accAvatarPills.addEventListener("click", function (e) {
            const pill = e.target.closest(".acc-avatar-pill");
            if (pill) {
                document.querySelectorAll(".acc-avatar-pill").forEach(p => p.classList.remove("active"));
                pill.classList.add("active");
                selectedAccIconValue = pill.getAttribute("data-icon") || "auto";
            }
        });
    }

    // Password Generator Elements
    const generateBtn = document.getElementById("generateBtn");
    const lengthSlider = document.getElementById("lengthSlider");
    const lengthVal = document.getElementById("lengthVal");
    const chkSymbols = document.getElementById("chkSymbols");
    const chkNumbers = document.getElementById("chkNumbers");

    // View Mode State ("grouped" or "flat")
    let currentViewMode = "grouped";
    let editingAccountId = null;

    const viewGroupedBtn = document.getElementById("viewGroupedBtn");
    const viewFlatBtn = document.getElementById("viewFlatBtn");
    const quickBrandPresets = document.getElementById("quickBrandPresets");

    if (viewGroupedBtn && viewFlatBtn) {
        viewGroupedBtn.addEventListener("click", function () {
            currentViewMode = "grouped";
            viewGroupedBtn.classList.add("active");
            viewFlatBtn.classList.remove("active");
            renderAccounts(searchInput ? searchInput.value.trim().toLowerCase() : "");
        });

        viewFlatBtn.addEventListener("click", function () {
            currentViewMode = "flat";
            viewFlatBtn.classList.add("active");
            viewGroupedBtn.classList.remove("active");
            renderAccounts(searchInput ? searchInput.value.trim().toLowerCase() : "");
        });
    }

    // Modal Handlers
    const addAccountModalTitle = document.getElementById("addAccountModalTitle");

    function openModal(prefillService = "", editAcc = null) {
        addAccountModal.classList.remove("hidden");
        
        if (editAcc) {
            editingAccountId = editAcc.id;
            if (addAccountModalTitle) addAccountModalTitle.textContent = "Edit Account Credentials";
            if (addAccountBtn) addAccountBtn.textContent = "Save Changes";

            serviceInput.value = editAcc.service || "";
            usernameInput.value = editAcc.username || "";
            passwordInput.value = editAcc.password || "";
            if (notesInput) notesInput.value = editAcc.notes || "";
            selectedAccIconValue = editAcc.customAvatar || "auto";

            if (accAvatarPills) {
                document.querySelectorAll(".acc-avatar-pill").forEach(p => p.classList.remove("active"));
                const matchingPill = accAvatarPills.querySelector(`[data-icon="${selectedAccIconValue}"]`);
                if (matchingPill) {
                    matchingPill.classList.add("active");
                } else {
                    const autoPill = accAvatarPills.querySelector('[data-icon="auto"]');
                    if (autoPill) autoPill.classList.add("active");
                }
            }
            evaluateStrength(editAcc.password || "");
            usernameInput.focus();
        } else {
            editingAccountId = null;
            if (addAccountModalTitle) addAccountModalTitle.textContent = "Add New Credentials";
            if (addAccountBtn) addAccountBtn.textContent = "Save Account";

            serviceInput.value = typeof prefillService === "string" ? prefillService : "";
            usernameInput.value = "";
            passwordInput.value = "";
            if (notesInput) notesInput.value = "";
            selectedAccIconValue = "auto";
            if (accAvatarPills) {
                document.querySelectorAll(".acc-avatar-pill").forEach(p => p.classList.remove("active"));
                const autoPill = accAvatarPills.querySelector('[data-icon="auto"]');
                if (autoPill) autoPill.classList.add("active");
            }
            evaluateStrength("");
            if (prefillService) {
                usernameInput.focus();
            } else {
                serviceInput.focus();
            }
        }
    }

    function closeModal() {
        addAccountModal.classList.add("hidden");
        editingAccountId = null;
    }

    // Quick Brand Pills Listener
    if (quickBrandPresets) {
        quickBrandPresets.addEventListener("click", function (e) {
            const btn = e.target.closest(".brand-pill");
            if (btn) {
                const brand = btn.getAttribute("data-brand");
                serviceInput.value = brand;
                usernameInput.focus();
            }
        });
    }

    if (openAddAccountModalBtn) openAddAccountModalBtn.addEventListener("click", () => openModal());
    if (closeAddAccountModalBtn) closeAddAccountModalBtn.addEventListener("click", closeModal);
    if (cancelAddAccountModalBtn) cancelAddAccountModalBtn.addEventListener("click", closeModal);

    // Enter Key Listeners inside Modal
    [serviceInput, usernameInput, passwordInput].forEach(inp => {
        if (inp) {
            inp.addEventListener("keypress", function (e) {
                if (e.key === "Enter" && addAccountBtn) addAccountBtn.click();
            });
        }
    });

    // Toggle Eye inside Modal
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener("click", function () {
            const isPass = passwordInput.type === "password";
            passwordInput.type = isPass ? "text" : "password";
            togglePasswordBtn.style.color = isPass ? "#60a5fa" : "#9ca3af";
        });
    }

    // Password Strength Meter Listener
    if (passwordInput) {
        passwordInput.addEventListener("input", function () {
            evaluateStrength(this.value);
        });
    }

    function evaluateStrength(pwd) {
        if (!strengthBar || !strengthText) return;
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
    if (lengthSlider && lengthVal) {
        lengthSlider.addEventListener("input", function () {
            lengthVal.textContent = this.value;
        });
    }

    if (generateBtn && passwordInput && lengthSlider && chkNumbers && chkSymbols) {
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
            if (togglePasswordBtn) togglePasswordBtn.style.color = "#60a5fa";
            evaluateStrength(result);
            showToast("Strong Password Generated!");
        });
    }

    // Add / Edit Account Handler
    if (addAccountBtn) {
        addAccountBtn.addEventListener("click", function () {
            if (!serviceInput || !usernameInput || !passwordInput) {
                showToast("Form fields missing", "error");
                return;
            }

            const service = serviceInput.value.trim();
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            const notes = notesInput ? notesInput.value.trim() : "";

            if (!service || !username || !password) {
                showToast("Please fill in all fields (Service, Username, Password)", "error");
                return;
            }

            if (!Array.isArray(categoryAccounts)) {
                categoryAccounts = [];
            }

            if (editingAccountId) {
                // Update existing account
                const idx = categoryAccounts.findIndex(a => a.id === editingAccountId);
                if (idx > -1) {
                    categoryAccounts[idx].service = service;
                    categoryAccounts[idx].username = username;
                    categoryAccounts[idx].password = password;
                    categoryAccounts[idx].notes = notes;
                    categoryAccounts[idx].customAvatar = selectedAccIconValue || "auto";
                    categoryAccounts[idx].updated = new Date().toLocaleDateString();
                }
            } else {
                // Create new account
                const newAccount = {
                    id: Date.now().toString(),
                    service: service,
                    username: username,
                    password: password,
                    notes: notes,
                    customAvatar: selectedAccIconValue || "auto",
                    created: new Date().toLocaleDateString()
                };
                categoryAccounts.push(newAccount);
            }

            accountsData[currentCategory] = categoryAccounts;
            
            try {
                localStorage.setItem(accKey, JSON.stringify(accountsData));
            } catch (e) {
                showToast("Error saving to Storage", "error");
                return;
            }

            renderAccounts(searchInput ? searchInput.value.trim().toLowerCase() : "");
            const wasEditing = !!editingAccountId;
            closeModal();
            showToast(wasEditing ? `Account "${service}" updated!` : `Account "${service}" saved!`);
        });
    }

    // Search Account Filter
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            renderAccounts(this.value.trim().toLowerCase());
        });
    }

    // SVG Brand Logo Renderer
    function getBrandIcon(serviceName, customAvatar) {
        if (customAvatar && customAvatar !== "auto") {
            const isImg = customAvatar.startsWith("data:image") || customAvatar.startsWith("http");
            if (isImg) {
                return `<div class="brand-badge" style="background:transparent;"><img src="${customAvatar}" style="width:26px;height:26px;border-radius:50%;object-fit:cover;" alt="Avatar"></div>`;
            } else {
                return `<div class="brand-badge brand-default" style="font-size:18px;">${customAvatar}</div>`;
            }
        }

        const s = serviceName.toLowerCase();
        
        // Instagram
        if (s.includes("insta")) {
            return `<div class="brand-badge brand-insta" title="Instagram">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </div>`;
        }
        
        // Facebook
        if (s.includes("facebook") || s.includes("fb")) {
            return `<div class="brand-badge brand-fb" title="Facebook">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </div>`;
        }

        // Snapchat
        if (s.includes("snapchat") || s.includes("snap")) {
            return `<div class="brand-badge brand-snap" title="Snapchat">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12.004 2c-3.153 0-5.418 2.373-5.418 5.378 0 1.258.411 2.338.995 3.238-.344.183-.75.312-1.255.45-.494.135-.86.236-1.12.392-.352.21-.497.472-.497.777 0 .445.38.742 1.077.892.932.2 1.83.176 2.368.146.126.31.257.653.376.994.185.53.407 1.168.89 1.488.375.25.867.382 1.486.382.607 0 1.096-.133 1.472-.382.483-.32.705-.958.89-1.488.119-.34.25-.684.376-.994.538.03 1.436.054 2.368-.146.697-.15 1.077-.447 1.077-.892 0-.305-.145-.567-.497-.777-.26-.156-.626-.257-1.12-.392-.505-.138-.911-.267-1.255-.45.584-.9 1-.005 1-2.26 0-3.005-2.265-5.378-5.418-5.378z"/></svg>
            </div>`;
        }

        // WhatsApp
        if (s.includes("whatsapp") || s.includes("wa")) {
            return `<div class="brand-badge brand-wa" title="WhatsApp">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </div>`;
        }

        // TikTok
        if (s.includes("tiktok")) {
            return `<div class="brand-badge brand-tiktok" title="TikTok">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68a6.34 6.34 0 0 0 10.86 4.46A6.29 6.29 0 0 0 15.82 15V8.84a8.35 8.35 0 0 0 4.77 1.48V6.87a4.79 4.79 0 0 1-1-.18z"/></svg>
            </div>`;
        }

        // Telegram
        if (s.includes("telegram")) {
            return `<div class="brand-badge brand-telegram" title="Telegram">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.96 1.25-5.54 3.67-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.75 3.99-1.74 6.66-2.89 8.01-3.46 3.81-1.6 4.6-1.88 5.12-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.13-.03.22z"/></svg>
            </div>`;
        }

        // X / Twitter
        if (s.includes("twitter") || s.includes("x.com") || s === "x") {
            return `<div class="brand-badge brand-x" title="X (Twitter)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </div>`;
        }

        // YouTube
        if (s.includes("youtube") || s.includes("yt")) {
            return `<div class="brand-badge brand-yt" title="YouTube">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </div>`;
        }

        // Reddit
        if (s.includes("reddit")) {
            return `<div class="brand-badge brand-reddit" title="Reddit">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701z"/></svg>
            </div>`;
        }

        // Pinterest
        if (s.includes("pinterest") || s.includes("pin")) {
            return `<div class="brand-badge brand-pin" title="Pinterest">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026z"/></svg>
            </div>`;
        }

        // LinkedIn
        if (s.includes("linkedin")) {
            return `<div class="brand-badge brand-linkedin" title="LinkedIn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </div>`;
        }

        // Google / Gmail
        if (s.includes("google") || s.includes("gmail")) {
            return `<div class="brand-badge brand-google" title="Google">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 15.96 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
            </div>`;
        }

        // GitHub
        if (s.includes("github") || s.includes("git")) {
            return `<div class="brand-badge brand-github" title="GitHub">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </div>`;
        }

        // Netflix
        if (s.includes("netflix")) {
            return `<div class="brand-badge brand-netflix" title="Netflix">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M5.398 0v24h4.152v-9.619l5.064 9.619h4.152V0h-4.152v9.619L9.55 0H5.398z"/></svg>
            </div>`;
        }

        // Spotify
        if (s.includes("spotify")) {
            return `<div class="brand-badge brand-spotify" title="Spotify">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.66.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.38-1.32 9.84-.66 13.5 1.56.36.24.54.84.241 1.26zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3z"/></svg>
            </div>`;
        }

        // PayPal
        if (s.includes("paypal")) {
            return `<div class="brand-badge brand-paypal" title="PayPal">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.009.49 5.364.188 5.78.188h7.066c2.446 0 4.397.587 5.485 1.645 1.051 1.022 1.37 2.479.947 4.327-.478 2.091-1.558 3.738-3.21 4.898-1.606 1.127-3.69 1.698-6.19 1.698H8.257l-1.181 8.581zm.69-14.733l-1.554 11.282h2.24l1.242-9.025h2.247c1.782 0 3.224-.395 4.288-1.174.996-.73 1.66-1.84 1.974-3.3.266-1.242.062-2.146-.607-2.69-.731-.594-2.029-.893-3.856-.893H7.766z"/></svg>
            </div>`;
        }

        // Default Icon
        return `<div class="brand-badge brand-default" title="${serviceName}">
            🔑
        </div>`;
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

    function createAccountCardElement(acc) {
        const card = document.createElement("div");
        card.className = "account-card";
        const iconHtml = getBrandIcon(acc.service, acc.customAvatar);

        const notesHtml = acc.notes ? `
            <div class="account-notes-box">
                <div class="notes-text">📝 ${acc.notes}</div>
                <button class="copy-notes-btn" title="Copy Notes">Copy</button>
            </div>
        ` : "";

        card.innerHTML = `
            <div class="account-info">
                ${iconHtml}
                <div class="account-meta">
                    <div class="account-service">${acc.service}</div>
                    <div class="account-user">${acc.username}</div>
                </div>
            </div>

            <div class="account-secret">
                <span class="secret-username" title="Username: ${acc.username}">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    ${acc.username}
                </span>
                <span class="secret-divider">|</span>
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

                <button class="btn-icon-action edit-btn" title="Edit Account">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    <span>Edit</span>
                </button>

                <button class="btn-icon-action delete-btn" title="Delete Account">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
            ${notesHtml}
        `;

        // Copy Notes Handler
        const copyNotesBtn = card.querySelector(".copy-notes-btn");
        if (copyNotesBtn) {
            copyNotesBtn.addEventListener("click", function () {
                copyToClipboard(acc.notes).then(() => {
                    showToast("Notes copied to clipboard!");
                });
            });
        }

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

        // Edit Account Handler
        const editBtn = card.querySelector(".edit-btn");
        if (editBtn) {
            editBtn.addEventListener("click", function () {
                openModal("", acc);
            });
        }

        // Delete Account Handler
        const deleteBtn = card.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", function () {
            if (confirm(`Delete credentials for "${acc.service}" (${acc.username})?`)) {
                const idx = categoryAccounts.findIndex(a => a.id === acc.id);
                if (idx > -1) {
                    categoryAccounts.splice(idx, 1);
                    accountsData[currentCategory] = categoryAccounts;
                    localStorage.setItem(accKey, JSON.stringify(accountsData));
                    renderAccounts(searchInput ? searchInput.value.trim().toLowerCase() : "");
                    showToast(`Deleted ${acc.service} (${acc.username})`);
                }
            }
        });

        return card;
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
            if (emptyAddAccBtn) emptyAddAccBtn.addEventListener("click", () => openModal());
            return;
        }

        if (currentViewMode === "grouped") {
            // Group accounts by Service Brand Name
            const groupsMap = new Map();
            filtered.forEach(acc => {
                const serviceKey = acc.service.trim().toLowerCase();
                if (!groupsMap.has(serviceKey)) {
                    groupsMap.set(serviceKey, {
                        displayName: acc.service.trim(),
                        accounts: []
                    });
                }
                groupsMap.get(serviceKey).accounts.push(acc);
            });

            groupsMap.forEach((groupObj) => {
                const brandName = groupObj.displayName;
                const accs = groupObj.accounts;

                const groupCard = document.createElement("div");
                groupCard.className = "brand-group-card open";

                const iconHtml = getBrandIcon(brandName);
                const countText = accs.length === 1 ? "1 Account" : `${accs.length} Accounts`;

                groupCard.innerHTML = `
                    <div class="brand-group-header">
                        <div class="brand-group-left">
                            ${iconHtml}
                            <div class="brand-group-title">
                                <span>${brandName}</span>
                                <span class="account-count-badge">${countText}</span>
                            </div>
                        </div>
                        <div class="brand-group-right">
                            <button class="btn-brand-add" title="Add another account under ${brandName}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                <span>+ Add Account</span>
                            </button>
                            <svg class="chevron-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                    <div class="brand-group-body"></div>
                `;

                const headerEl = groupCard.querySelector(".brand-group-header");
                const bodyEl = groupCard.querySelector(".brand-group-body");
                const brandAddBtn = groupCard.querySelector(".btn-brand-add");

                // Expand/Collapse accordion toggle
                headerEl.addEventListener("click", function (e) {
                    if (e.target.closest(".btn-brand-add")) return; // don't toggle when clicking add button
                    groupCard.classList.toggle("open");
                    groupCard.classList.toggle("collapsed");
                });

                // Add Account prefilled with brand name
                brandAddBtn.addEventListener("click", function (e) {
                    e.stopPropagation();
                    openModal(brandName);
                });

                // Append accounts inside group body
                accs.forEach(acc => {
                    bodyEl.appendChild(createAccountCardElement(acc));
                });

                accountList.appendChild(groupCard);
            });
        } else {
            // Flat List View
            filtered.forEach(acc => {
                accountList.appendChild(createAccountCardElement(acc));
            });
        }
    }

    // Export Modal Elements
    const exportModal = document.getElementById("exportModal");
    const closeExportModalBtn = document.getElementById("closeExportModalBtn");
    const cancelExportModalBtn = document.getElementById("cancelExportModalBtn");
    const confirmExportBtn = document.getElementById("confirmExportBtn");
    const exportMasterPassword = document.getElementById("exportMasterPassword");
    const toggleExportPwd = document.getElementById("toggleExportPwd");
    const exportErrorMsg = document.getElementById("exportErrorMsg");
    const formatCards = document.querySelectorAll(".format-card");

    // Toggle Eye inside Export Modal
    if (toggleExportPwd && exportMasterPassword) {
        toggleExportPwd.addEventListener("click", function () {
            const isPass = exportMasterPassword.type === "password";
            exportMasterPassword.type = isPass ? "text" : "password";
            toggleExportPwd.style.color = isPass ? "#60a5fa" : "#9ca3af";
        });
    }

    // Format Card Radio Selection UI
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

    if (exportBtn) exportBtn.addEventListener("click", openExportModal);
    if (closeExportModalBtn) closeExportModalBtn.addEventListener("click", closeExportModal);
    if (cancelExportModalBtn) cancelExportModalBtn.addEventListener("click", closeExportModal);

    if (exportMasterPassword) {
        exportMasterPassword.addEventListener("keypress", function (e) {
            if (e.key === "Enter") confirmExportBtn.click();
        });
    }

    // Confirm & Process Export
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

            // Password verified -> Get selected format
            const selectedRadio = document.querySelector('input[name="exportFormat"]:checked');
            const format = selectedRadio ? selectedRadio.value : "md";

            processVaultExport(format);
            closeExportModal();
        });
    }

    function processVaultExport(format) {
        const categories = JSON.parse(localStorage.getItem(catKey) || "[]");
        const accountsData = JSON.parse(localStorage.getItem(accKey) || "{}");
        const profileName = activeProfile.name || "My_Vault";
        const dateStr = new Date().toISOString().slice(0, 10);
        const fileNameBase = `NeXtLock_${profileName.replace(/\s+/g, "_")}_Export_${dateStr}`;

        let fileContent = "";
        let mimeType = "text/plain";
        let extension = "txt";

        if (format === "md") {
            extension = "md";
            mimeType = "text/markdown";
            fileContent = `# 🔐 NeXtLock Vault Export - ${profileName}\n\n`;
            fileContent += `**Export Date:** ${new Date().toLocaleString()}\n`;
            fileContent += `**Total Categories:** ${categories.length}\n\n`;
            fileContent += `---\n\n`;

            categories.forEach(cat => {
                const accs = accountsData[cat] || [];
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
            categories.forEach(cat => {
                const accs = accountsData[cat] || [];
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
            fileContent += `NeXtLock Vault Credentials Export\n`;
            fileContent += `Profile Name: ${profileName}\n`;
            fileContent += `Export Date : ${new Date().toLocaleString()}\n`;
            fileContent += `==================================================\n\n`;

            categories.forEach(cat => {
                const accs = accountsData[cat] || [];
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

        // Trigger Download
        const blob = new Blob([fileContent], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileNameBase}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast(`Exported vault credentials as .${extension}!`);
    }

    // Import Multi-Format Backup (.md, .txt, .csv)
    if (importBtn && importFile) {
        importBtn.addEventListener("click", function () {
            importFile.click();
        });

        importFile.addEventListener("change", function (e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (event) {
                try {
                    const content = event.target.result;
                    const parsed = parseVaultFileContent(content, file.name);
                    const res = executeVaultImport(parsed, catKey, accKey);

                    if (res.success) {
                        try {
                            const rawAcc = localStorage.getItem(accKey);
                            if (rawAcc) accountsData = JSON.parse(rawAcc);
                        } catch (err) {}

                        categoryAccounts = accountsData[currentCategory] || [];
                        renderAccounts(searchInput ? searchInput.value.trim().toLowerCase() : "");
                        showToast(`Successfully imported ${res.count} account(s) from .${file.name.split('.').pop()}`);
                    } else {
                        showToast("No valid credentials found in file", "error");
                    }
                } catch (err) {
                    showToast("Failed to parse import file", "error");
                }
                importFile.value = "";
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
                localStorage.removeItem("categoryIcons_" + activeProfileId);

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
                window.location.href = "../../login/login.html";
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

    renderAccounts();
});