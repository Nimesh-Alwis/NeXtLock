// Account Manager

const accounts = [];

// Add account
function addAccount(username, password) {

    const account = {
        username: username,
        password: password,
        updated: new Date()
    };

    accounts.push(account);

    console.log("Account added");
}

// Load accottsee
function loadAccounts() {
    console.log(accounts);
}