var Card = /** @class */ (function () {
    function Card(x, y) {
        this.half_size = 50;
        this.image = null;
        this.x = x;
        this.y = y;
    }
    Card.prototype.clone = function () {
        var clone = new Card(this.x, this.y);
        clone.half_size = this.half_size;
        clone.image = this.image;
        return clone;
    };
    Card.prototype.move = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Card.prototype.draw = function (ctx) {
        if (this.image) {
            ctx.drawImage(this.image, this.x, this.y, this.half_size * 2, this.half_size * 2);
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
        return (x >= this.x - this.half_size && x <= this.x + this.half_size) && (y >= this.y - this.half_size && y <= this.y + this.half_size);
    };
    return Card;
}());
