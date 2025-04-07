var Card = /** @class */ (function () {
    function Card(x, y) {
        this.half_size = 50;
        this.images = [];
        this.selected_image = 0;
        this.movable = true;
        this.x = x;
        this.y = y;
    }
    Card.prototype.clone = function () {
        var clone = new Card(this.x, this.y);
        clone.half_size = this.half_size;
        clone.images = this.images;
        clone.selected_image = this.selected_image;
        clone.movable = this.movable;
        clone.text = this.text;
        clone.text_color = this.text_color;
        clone.bg_color = this.bg_color;
        return clone;
    };
    Card.prototype.move = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Card.prototype.draw = function (ctx) {
        if (this.images[0]) {
            var img = this.images[this.selected_image];
            ctx.drawImage(img, this.x, this.y, img.width, img.height);
        }
        else {
            ctx.fillStyle = this.bg_color;
            ctx.fillRect(this.x - this.half_size, this.y - this.half_size, this.half_size * 2, this.half_size * 2);
            ctx.fillStyle = this.text_color;
            ctx.font = "20px Arial";
            ctx.fillText(this.text, this.x - this.half_size, this.y);
        }
    };
    Card.prototype.drawOutline = function (ctx) {
        ctx.fillStyle = "lightgray";
        ctx.strokeStyle = "black";
        var w = this.half_size * 2;
        var h = this.half_size * 2;
        if (this.images[0]) {
            w = this.images[0].width;
            h = this.images[0].height;
        }
        ctx.rect(this.x, this.y, w, h);
        ctx.stroke();
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
