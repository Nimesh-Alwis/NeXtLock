const category =
    localStorage.getItem(
        "selectedCategory"
    );

document.getElementById(
    "categoryTitle"
).textContent = category;

document.getElementById(
    "backBtn"
).addEventListener(
    "click",
    function () {

        window.location.href =
            "../index.html";
    }
);