const {
    createFile,
    writeFile,
    renameFile,
    deleteFile
} = require("../storage/fileManager");


// Categories list
const categories = [];
 
// Create a new category
function createCategory(categoryName) {

    const category = {
        name: categoryName,
        accounts: [] 
    };

    categories.push(category);

    createFile(categoryName);

    console.log(`${categoryName} category created`);
}

// Add account to category
function addAccountToCategory(
    categoryName,
    username,
    password
) {

    const category = categories.find(
        category => category.name === categoryName
    );

    if (category) {

        const account = {
            username: username,
            password: password,
            updated: new Date()
        };

        category.accounts.push(account);

        let content = `# ${category.name}\n\n`;

category.accounts.forEach(account => {
    content += `### ${account.username}\n\n`;
    content += `Password: ${account.password}\n\n`;
    content += `Updated: ${account.updated}\n\n`;
});

writeFile(category.name, content);


        console.log("Account added");

    } else {

        console.log("Category not found");

    }

}

function renameCategory(oldName, newName) {

    const category = categories.find(
        category => category.name === oldName
    );

    if (category) {

        category.name = newName;

        renameFile(
            oldName,
            newName
        );

        console.log(
            `${oldName} renamed to ${newName}`
        );

    } else {

        console.log("Category not found");

    }
}

function deleteCategory(categoryName) {

    const categoryIndex = categories.findIndex(
        category => category.name === categoryName
    );

    if (categoryIndex !== -1) {

        categories.splice(
            categoryIndex,
            1
        );

        deleteFile(categoryName);

        console.log(
            `${categoryName} category deleted`
        );

    } else {

        console.log("Category not found");

    }
}

// Load all categories
function loadCategories() {
    console.log(
        JSON.stringify(categories, null, 2)
    );
}

// Export functions
module.exports = {
    createCategory,
    addAccountToCategory,
    updatePassword,
    deleteAccount,
    renameCategory,
    deleteCategory,
    loadCategories
};

function updatePassword(
    categoryName,
    username,
    newPassword
) {

    const category = categories.find(
        category => category.name === categoryName
    );

    if (!category) {
        console.log("Category not found");
        return;
    }

    const account = category.accounts.find(
        account => account.username === username
    );

    if (!account) {
        console.log("Account not found");
        return;
    }

    account.password = newPassword;
    account.updated = new Date();

    let content = `# ${category.name}\n\n`;

    category.accounts.forEach(account => {
        content += `### ${account.username}\n\n`;
        content += `Password: ${account.password}\n\n`;
        content += `Updated: ${account.updated}\n\n`;
    });

    writeFile(category.name, content);

    console.log("Password updated");
}




function deleteAccount(
    categoryName,
    username
) {

    const category = categories.find(
        category => category.name === categoryName
    );

    if (!category) {
        console.log("Category not found");
        return;
    }

    const accountIndex =
        category.accounts.findIndex(
            account =>
                account.username === username
        );

    if (accountIndex === -1) {
        console.log("Account not found");
        return;
    }

    category.accounts.splice(
        accountIndex,
        1
    );

    let content = `# ${category.name}\n\n`;

    category.accounts.forEach(account => {
        content += `### ${account.username}\n\n`;
        content += `Password: ${account.password}\n\n`;
        content += `Updated: ${account.updated}\n\n`;
    });

    writeFile(category.name, content);

    console.log("Account deleted");
}




//createCategory("Gmail");

/*addAccountToCategory(
    "Gmail",
    "gk@gmail.com",
    "123456"
);

addAccountToCategory(
    "Gmail",
    "gk.work@gmail.com",
    "abcdef"
);

updatePassword(
    "Gmail",
    "gk@gmail.com",
    "abc123"
);

deleteAccount(
    "Gmail",
    "gk.work@gmail.com"
);

loadCategories();*/


/* test renam eCategory
createCategory("Gmail");

renameCategory(
    "Gmail",
    "Google"
);

loadCategories(); */


/* createCategory("Facebook");

loadCategories();

deleteCategory("Facebook");

loadCategories(); */