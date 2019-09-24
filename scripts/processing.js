function Processing(image) {
    this.dom = {
        canvas: document.querySelector("#image_view"),
    };
    this.ctx = this.dom.canvas.getContext("2d");


    this.data = image.getData();
}

Processing.prototype.getPxl = function(x, y) {
    let w = this.data.width;
    const r = y * (w * 4) + x * 4;

    return {
        r: this.data.data[r],
        g: this.data.data[r + 1],
        b: this.data.data[r + 2],
        a: this.data.data[r + 3],
    };
}

Processing.prototype.render = function() {

    // Get size of image
    let w = this.data.width;
    let h = this.data.height;
    let m = 20;

    // Update canvas
    this.dom.canvas.width = w + m * 2;
    this.dom.canvas.height = h + m * 2;
    this.ctx = this.dom.canvas.getContext("2d");
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, w + m * 2, h + m * 2);

    // Draw image from data
    this.ctx.putImageData(this.data, m, m, 0, 0, w, h);
}