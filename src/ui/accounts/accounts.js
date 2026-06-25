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
                <p>
                    Password:
                    ${account.password}
                </p>
            `;

            accountList.appendChild(
                div
            );
        }
    );
}




    renderAccounts();