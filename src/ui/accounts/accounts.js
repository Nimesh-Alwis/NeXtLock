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

const generateButton =
    document.getElementById(
        "generateBtn"
    );    

const togglePasswordButton =
    document.getElementById(
        "togglePasswordBtn"
    );

const accountList =
    document.getElementById(
        "accountList"
    );

const searchInput =
    document.getElementById(
        "searchInput"
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

function generatePassword() {

    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=";

    let password = "";

    for (
        let i = 0;
        i < 16;
        i++
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                characters.length
            );

        password +=
            characters[randomIndex];
    }

    return password;
}

generateButton.addEventListener(
    "click",
    function () {

        passwordInput.value =
            generatePassword();
    }
);


togglePasswordButton.addEventListener(
    "click",
    function () {

        if (
            passwordInput.type ===
            "password"
        ) {

            passwordInput.type =
                "text";

            togglePasswordButton.textContent =
                "Hide Password";

        } else {

            passwordInput.type =
                "password";

            togglePasswordButton.textContent =
                "Show Password";
        }
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
    password,
    updated: new Date().toISOString()
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

function formatDate(date) {

    return new Date(date)
        .toLocaleString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }
        )
        .replace(",", " •");
}



function renderAccounts(
    searchText = ""
) {

    accountList.innerHTML = "";

    accounts
    .filter(
        function (account) {

            return account.username
                .toLowerCase()
                .includes(
                    searchText.toLowerCase()
                );
        }
    )
    .forEach(
        function (account) {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "category-card";

         div.innerHTML = `
    <h3>${account.username}</h3>

    <p>
        Last Updated:
        ${formatDate(account.updated)}
    </p>

    <p class="password-text">
        Password: ********
    </p>

    <button class="show-btn">
    Show
</button>

<button class="copy-user-btn">
    Copy Username
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

const copyUserButton =
    div.querySelector(
        ".copy-user-btn"
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

copyUserButton.addEventListener(
    "click",
    function () {

        navigator.clipboard.writeText(
            account.username
        );

        alert(
            "Username copied!"
        );
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

                    account.updated =
    new Date().toISOString();   

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

                    const confirmed =
     confirm(
`Are you sure you want to delete this account?

Username:
${account.username}`
    );

if (!confirmed) {
    return;
}

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

searchInput.addEventListener(
    "input",
    function () {

        renderAccounts(
            searchInput.value
        );
    }
);

renderAccounts();