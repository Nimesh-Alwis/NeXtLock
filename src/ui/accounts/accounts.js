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
    document.getElementById("categoryTitle").textContent = `${activeProfile.avatar || "👤"} ${currentCategory}`;
    document.getElementById("windowCategoryTitle").textContent = `${activeProfile.name} • ${currentCategory}`;
    document.getElementById("activeCatNav").textContent = currentCategory;

    let accountsData = JSON.parse(localStorage.getItem(accKey) || "{}");
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

    // View Mode State ("grouped" or "flat")
    let currentViewMode = "grouped";

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
    function openModal(prefillService = "") {
        addAccountModal.classList.remove("hidden");
        serviceInput.value = typeof prefillService === "string" ? prefillService : "";
        usernameInput.value = "";
        passwordInput.value = "";
        evaluateStrength("");
        if (prefillService) {
            usernameInput.focus();
        } else {
            serviceInput.focus();
        }
    }

    function closeModal() {
        addAccountModal.classList.add("hidden");
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
        localStorage.setItem(accKey, JSON.stringify(accountsData));

        renderAccounts(searchInput ? searchInput.value.trim().toLowerCase() : "");
        closeModal();
        showToast(`Account "${service}" saved!`);
    });

    // Search Account Filter
    searchInput.addEventListener("input", function () {
        renderAccounts(this.value.trim().toLowerCase());
    });

    // SVG Brand Logo Renderer
    function getBrandIcon(serviceName) {
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.54-1.31 1.48-1.34 2.47-.04.99.37 1.97 1.12 2.6.76.64 1.8.92 2.78.75 1.01-.15 1.93-.84 2.36-1.76.32-.67.45-1.43.43-2.17.03-4.99.01-9.98.02-14.97z"/></svg>
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
        const iconHtml = getBrandIcon(acc.service);

        card.innerHTML = `
            <div class="account-info">
                ${iconHtml}
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

    // Export Backup JSON
    exportBtn.addEventListener("click", function () {
        const backupData = {
            version: "1.0",
            profileId: activeProfileId,
            timestamp: new Date().toISOString(),
            categories: JSON.parse(localStorage.getItem(catKey) || "[]"),
            accounts: JSON.parse(localStorage.getItem(accKey) || "{}")
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
                    localStorage.setItem(catKey, JSON.stringify(imported.categories));
                    localStorage.setItem(accKey, JSON.stringify(imported.accounts));
                    
                    accountsData = imported.accounts;
                    categoryAccounts = accountsData[currentCategory] || [];
                    
                    renderAccounts(searchInput ? searchInput.value.trim().toLowerCase() : "");
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