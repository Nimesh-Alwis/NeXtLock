const category =
    localStorage.getItem(
        "selectedCategory"
    );

document.getElementById(
    "categoryTitle"
).textContent = category;

const savedAccounts =
    localStorage.getItem(
        category + "_accounts"
    );

const accounts =
    savedAccounts
        ? JSON.parse(savedAccounts)
        : [];

const usernameInput =
    document.getElementById(
        "usernameInput"
    );

const passwordInput =
    document.getElementById(
        "passwordInput"
    );

const addButton =
    document.getElementById(
        "addAccountBtn"
    );

const accountList =
    document.getElementById(
        "accountList"
    );

document.getElementById(
    "backBtn"
).addEventListener(
    "click",
    function () {

        window.location.href =
            "../index.html";
    }
);

addButton.addEventListener(
    "click",
    function () {

        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value.trim();

        if (
            username === "" ||
            password === ""
        ) {
            alert(
                "Fill all fields"
            );
            return;
        }

        const account = {
            username,
            password
        };

        accounts.push(account);

        localStorage.setItem(
            category + "_accounts",
            JSON.stringify(accounts)
        );

        renderAccounts();

        usernameInput.value = "";
        passwordInput.value = "";
    }
);

function renderAccounts() {

    accountList.innerHTML = "";

    accounts.forEach(
        function (account) {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "category-card";

            div.innerHTML = `
    <h3>${account.username}</h3>

    <p class="password-text">
        Password: ********
    </p>

    <button class="show-btn">
        Show
    </button>

    <button class="copy-btn">
        Copy Password
    </button>

    <button class="edit-btn">
        Edit Password
    </button>

    <button class="delete-btn">
        Delete Account
    </button>
`;

 
const passwordText =
    div.querySelector(
        ".password-text"
    );

const showButton =
    div.querySelector(
        ".show-btn"
    );

const copyButton =
    div.querySelector(
        ".copy-btn"
    );

const editButton =
    div.querySelector(
        ".edit-btn"
    );

const deleteButton =
    div.querySelector(
        ".delete-btn"
    );

let visible = false;

showButton.addEventListener(
    "click",
    function () {

        visible = !visible;

        if (visible) {

            passwordText.textContent =
                `Password: ${account.password}`;

            showButton.textContent =
                "Hide";

        } else {

            passwordText.textContent =
                "Password: ********";

            showButton.textContent =
                "Show";
        }
    }
);


copyButton.addEventListener(
    "click",
    function () {

        navigator.clipboard.writeText(
            account.password
        );

        alert(
            "Password copied!"
        );
    }
);

            editButton.addEventListener(
                "click",
                function () {

                    const newPassword =
                        prompt(
                            "Enter new password:"
                        );

                    if (
                        !newPassword ||
                        newPassword.trim() === ""
                    ) {
                        return;
                    }

                    account.password =
                        newPassword.trim();

                    localStorage.setItem(
                        category + "_accounts",
                        JSON.stringify(accounts)
                    );

                    renderAccounts();
                }
            );

            deleteButton.addEventListener(
                "click",
                function () {

                    const index =
                        accounts.indexOf(
                            account
                        );

                    accounts.splice(
                        index,
                        1
                    );

                    localStorage.setItem(
                        category + "_accounts",
                        JSON.stringify(accounts)
                    );

                    renderAccounts();
                }
            );

            accountList.appendChild(
                div
            );
        }
    );
}

renderAccounts();