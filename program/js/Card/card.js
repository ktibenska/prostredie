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
        return new Card(this.x, this.y);
    };
    Card.prototype.move = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Card.prototype.draw = function (ctx) {
    };
    Card.prototype.drawOutline = function (ctx) {
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
