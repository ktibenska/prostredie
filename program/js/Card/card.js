var Card = /** @class */ (function () {
    function Card(x, y) {
        this.half_size = 50;
        this.images = [];
        this.selected_image = 0;
        this.x = x;
        this.y = y;
    }
    Card.prototype.clone = function () {
        var clone = new Card(this.x, this.y);
        clone.half_size = this.half_size;
        clone.images = this.images;
        clone.selected_image = this.selected_image;
        return clone;
    };
    Card.prototype.move = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Card.prototype.draw = function (ctx) {
        if (this.images) {
            var img = this.images[this.selected_image];
            ctx.drawImage(img, this.x, this.y, img.width, img.height);
            // ctx.drawImage(this.images[this.selected_image], this.x, this.y, this.half_size * 2, this.half_size * 2)
        }
        else {
            ctx.fillStyle = "lightgray";
            // ctx.strokeStyle = "black";
            ctx.rect(this.x - this.half_size, this.y - this.half_size, this.half_size * 2, this.half_size * 2);
            ctx.fill();
            // ctx.stroke();
        }
    };
    Card.prototype.isCLicked = function (x, y) {
        var clicked = (x >= this.x - this.half_size && x <= this.x + this.half_size) && (y >= this.y - this.half_size && y <= this.y + this.half_size);
        if (clicked && this.images.length > 1) {
            this.selected_image++;
            this.selected_image %= (this.images.length);
        }
        return clicked;
    };
    return Card;
}());
