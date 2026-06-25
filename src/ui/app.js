const savedCategories =
    localStorage.getItem(
        "categories"
    );

const categories =
    savedCategories
        ? JSON.parse(savedCategories)
        : [];



const input =
    document.getElementById(
        "categoryInput"
    );

const button =
    document.getElementById(
        "createBtn"
    );

const list =
    document.getElementById(
        "categoryList"
    );

button.addEventListener(
    "click",
    function () {

        const categoryName =
            input.value.trim();

        if (categoryName === "") {
            alert(
                "Enter category name"
            );
            return;
        }

        if (
            categories.includes(categoryName)
        ) {
            alert(
                "Category already exists"
            );
            return;
        }

        categories.push(
            categoryName
        );

        localStorage.setItem(
            "categories",
            JSON.stringify(categories)
        );

        renderCategories();

        input.value = "";
    }
);



function renderCategories() {

    list.innerHTML = "";

    categories.forEach(
        function (category) {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "category-card";

          div.innerHTML = `
    <h3>${category}</h3>

    <button class="rename-btn">
        Rename
    </button>

    <button class="delete-btn">
        Delete
    </button>
`;
div.addEventListener(
    "click",
    function () {

        localStorage.setItem(
            "selectedCategory",
            category
        );

        window.location.href =
            "accounts/accounts.html";
    }
);


const renameButton =
    div.querySelector(
        ".rename-btn"
    );

renameButton.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

        const newName =
            prompt(
                "Enter new category name:"
            );

        if (
            !newName ||
            newName.trim() === ""
        ) {
            return;
        }

        if (
            categories.includes(
                newName.trim()
            )
        ) {
            alert(
                "Category already exists"
            );
            return;
        }

        const index =
            categories.indexOf(
                category
            );

        categories[index] =
            newName.trim();

        localStorage.setItem(
            "categories",
            JSON.stringify(categories)
        );

        renderCategories();
    }
);
     

const deleteButton =
    div.querySelector(
        ".delete-btn"
    );


   // 👇 මෙතන click event එක add කරනවා
        deleteButton.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

        const index =
            categories.indexOf(
                category
            );

        categories.splice(
            index,
            1
        );

        localStorage.setItem(
            "categories",
            JSON.stringify(categories)
        );

        renderCategories();
    }
);



            list.appendChild(
                div
            );
        }
    );
}

renderCategories();