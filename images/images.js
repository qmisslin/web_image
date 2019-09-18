// Get number of each image format
const images_number = {
    bmp: 3,
    gif: 10,
    jpg: 13,
    png: 12,

    // Aren't support in browser : bgm and tif format
    // pgm: 2,
    // tif: 4, 
}

// Function to create and load image
function Image(image_element) {

    // Get local reference
    let that = this;

    // Init attributes
    this.element = image_element;
    this.size = { x: 0, y: 0 };
}

/** METHODS */

Image.prototype.loadImage = function(number, extention, callback) {

    // Create image
    let img = new Image();

    // Loading image
    img.onload = function() {
        that.size = {
            x: this.width,
            y: this.height,
        };
        if (callback) {
            callback(that);
        }
    }
    img.src = Image.getUrl(number, extention);
}

Image.prototype.getData = function() {

    // Create virtual canvas
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    canvas.width = this.element.width;
    canvas.height = this.element.height;

    // Draw image on canvas 
    context.drawImage(this.element, 0, 0);

    // Get image data
    this.data = context.getImageData(0, 0, this.element.naturalWidth, this.element.naturalHeight);
    return this.data;
}

/** STATICS METHODS */

// Transform number and extention to image name
Image.getName = function(number, extention) {
    let s = (n) => n > 9 ? n : '0' + n;
    let name = s(number) + '.' + extention;
    return name;
}

// Transform number and extention to image url
Image.getUrl = function(number, extention) {
    let name = Image.getName(number, extention);
    let url = './images/' + extention + '/' + name;
    return url;
}

// Get images as list
Image.getList = function() {

    let list = [],
        nb = 0,
        key, i;

    for (key in images_number) {
        if (images_number.hasOwnProperty(key)) {
            nb = images_number[key];
            for (i = 0; i < nb; i++) {
                list.push({
                    name: Image.getName(i, key),
                    url: Image.getUrl(i, key),
                    extention: key,
                })
            }
        }
    }

    return list;
}