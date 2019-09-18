function App() {
    this.dom = {
        selectImage: document.querySelector("#choose_image"),
        selectImageAnchor: document.querySelector("#choose_image_scrollable"),
    }

    // Init attribute
    this.select_image = null;
}

App.prototype.generateSelectImage = function() {

    let d = this.dom.selectImageAnchor;
    let l = Image.getList();
    let that = this;

    // Loop on all element to create image
    l.forEach((i, index) => {

        let image = document.createElement("img");
        image.src = i.url;
        image.addEventListener("click", function() {
            that.selectImage(this)
        });

        d.appendChild(image);
    });

    // Select first image
    this.selectImage(this.dom.selectImageAnchor.firstChild);
}

// Select image
App.prototype.selectImage = function(el) {
    let selected = this.dom.selectImageAnchor.querySelector(".select");
    if (selected) {
        selected.classList.remove("select");
    }

    // Select image
    el.classList.add("select");
    this.select_image = new Image(el);
    this.process();
}

// Process selected image
App.prototype.process = function() {
    new Processing(this.select_image);
}

// Start app
window.onload = function() {
    let app = new App();
    app.generateSelectImage();
}