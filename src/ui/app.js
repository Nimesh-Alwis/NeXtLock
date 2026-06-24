const categories = [];

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
            input.value;

        if (categoryName === "") {
            alert(
                "Enter category name"
            );
            return;
        }

        categories.push(
            categoryName
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

            div.textContent =
                category;

            list.appendChild(
                div
            );
        }
    );
}