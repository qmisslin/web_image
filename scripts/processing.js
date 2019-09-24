function Color(r, g, b, a) {

    let max_c = Math.max(r, g, b);
    let min_c = Math.min(r, g, b);

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.l = ((max_c + min_c) / 2) / 255 * 100;
}

function Processing(data) {
    this.dom = {
        canvas: document.querySelector("#image_view"),
    };
    this.ctx = this.dom.canvas.getContext("2d");
    this.data = data;
}

Processing.prototype.copy = function() {

    let data = new ImageData(
        new Uint8ClampedArray(this.data.data),
        this.data.width,
        this.data.height
    );

    return new Processing(data);
}

// Get pixel rgba value from this (x,y) coordinates
Processing.prototype.getPxl = function(x, y) {

    let w = this.data.width,
        h = this.data.height,
        d = this.data.data,
        c, r;

    if (x < 0 || y < 0 || x >= w || y >= h) {
        r = y * (w * 4) + x * 4;
        c = new Color(d[r], d[r + 1], d[r + 2], d[r + 3])
    } else {
        c = new Color(0, 0, 0, 0);
    }
    return c;
}

// Set pixel value from this (x,y) coordinates and color value
Processing.prototype.setPxl = function(x, y, c) {
    let w = this.data.width;

    const r = y * (w * 4) + x * 4;

    this.data.data[r] = c.r;
    this.data.data[r + 1] = c.g;
    this.data.data[r + 2] = c.b;
    this.data.data[r + 3] = c.a;
}

// Render current image data in canvas
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


// Loop on sctructural element
Processing.prototype.getMinFromStruct = function(x, y, pro, struct_el) {
    let sx = struct_el.width;
    let sy = struct_el.height;

    let min = 100,
        pxl;

    // Loop on structural element
    struct_el.forEach((vj, j) => {
        struct_el.forEach((vi, i) => {
            pxl = pro.getPxl(x - sx / 2 + i, y - sy / 2 + j);
            min = Math.min(min, pxl.l);
        })
    });

    let color = new Color(min / 100 * 255, min / 100 * 255, min / 100 * 255, 255);
    return color;
}

// Erosion of the image
Processing.prototype.erosion = function(struct_el) {
    let x, y;
    let pro = this.copy();

    console.log(pro);

    // Loop on image
    for (y = 0; y < pro.data.height; y++) {
        for (x = 0; x < pro.data.width; x++) {
            let pxl = pro.getPxl(x, y);
            let min = this.getMinFromStruct(x, y, pro, struct_el);
            this.setPxl(x, y, min);
        }
    }

    console.log("Erosion ok");
}

// Statics methods

// Generates a rectangle-shaped structuring element
Processing.generateRect = function(w, h) {
    let a = Array(h).fill(1).map(e => Array(w).fill(1));
    a.width = w;
    a.height = h;
    return a;
}

// Generates a square-shaped structuring element
Processing.generateSquare = function(s) {
    return Processing.generateRect(s, s);
}

// Generates a disc-shaped structuring element
Processing.generateDisk = function(s) {
    let q = Processing.generateSquare(s),
        r = (s == 3) ? 0 : 0.5,
        m = s / 2 - 0.5;
    q = q.map((e, y) => e.map((f, x) =>
        Math.sqrt(Math.pow(m - x, 2) + Math.pow(m - y, 2)) <= m + r ? 1 : 0
    ));
    q.width = s;
    q.height = s;
    return q;
}