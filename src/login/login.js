document.addEventListener("DOMContentLoaded", function() {
    const passwordInput = document.getElementById("masterPassword");
    const confirmInput = document.getElementById("confirmPassword");
    const confirmGroup = document.getElementById("confirmGroup");
    const loginButton = document.getElementById("loginBtn");
    const message = document.getElementById("message");
    const formSubtitle = document.getElementById("formSubtitle");
    const resetVaultLink = document.getElementById("resetVaultLink");
    const strengthContainer = document.getElementById("strengthContainer");
    const strengthBar = document.getElementById("strengthBar");
    const strengthLabel = document.getElementById("strengthLabel");

    const toggleMasterPwd = document.getElementById("toggleMasterPwd");
    const toggleConfirmPwd = document.getElementById("toggleConfirmPwd");

    const savedPassword = localStorage.getItem("masterPassword");

    if (savedPassword) {
        confirmGroup.style.display = "none";
        strengthContainer.classList.add("hidden");
        formSubtitle.textContent = "Enter your Master Password to unlock";
        loginButton.querySelector("span").textContent = "Unlock Vault";
    } else {
        confirmGroup.style.display = "block";
        strengthContainer.classList.remove("hidden");
        formSubtitle.textContent = "Create a Master Password to protect your secrets";
        loginButton.querySelector("span").textContent = "Create Master Vault";
    }

    // Toggle password visibility
    function setupPasswordToggle(button, input) {
        button.addEventListener("click", function() {
            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            button.style.color = isPassword ? "#60a5fa" : "#9ca3af";
        });
    }

    setupPasswordToggle(toggleMasterPwd, passwordInput);
    setupPasswordToggle(toggleConfirmPwd, confirmInput);

    // Password strength evaluator
    if (!savedPassword) {
        passwordInput.addEventListener("input", function() {
            const val = passwordInput.value;
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

    loginButton.addEventListener("click", handleAuth);
    passwordInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") handleAuth();
    });
    confirmInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") handleAuth();
    });

    function handleAuth() {
        const password = passwordInput.value.trim();

        if (!savedPassword) {
            const confirm = confirmInput.value.trim();

            if (password === "" || confirm === "") {
                message.textContent = "Please fill in all fields.";
                message.style.color = "#ef4444";
                return;
            }

            if (password !== confirm) {
                message.textContent = "Passwords do not match.";
                message.style.color = "#ef4444";
                return;
            }

            if (password.length < 4) {
                message.textContent = "Password must be at least 4 characters.";
                message.style.color = "#ef4444";
                return;
            }

            localStorage.setItem("masterPassword", password);
            message.style.color = "#10b981";
            message.textContent = "Vault created! Unlocking...";

            setTimeout(() => {
                window.location.href = "../ui/index.html";
            }, 600);

        } else {
            if (password === savedPassword) {
                message.style.color = "#10b981";
                message.textContent = "Access Granted. Opening Vault...";
                setTimeout(() => {
                    window.location.href = "../ui/index.html";
                }, 400);
            } else {
                message.style.color = "#ef4444";
                message.textContent = "Incorrect Master Password.";
                passwordInput.value = "";
                passwordInput.focus();
            }
        }
    }

    resetVaultLink.addEventListener("click", function(e) {
        e.preventDefault();
        if (confirm("Resetting your vault will delete all saved passwords and categories. Are you sure?")) {
            localStorage.clear();
            alert("Vault reset successfully.");
            window.location.reload();
        }
    });
});