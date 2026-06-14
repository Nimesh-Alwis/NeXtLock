// Categories list
const categories = [];

// Create a new category
function createCategory(categoryName) {

    const category = {
        name: categoryName,
        accounts: []
    };

    categories.push(category);

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

        categories.splice(categoryIndex, 1);

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