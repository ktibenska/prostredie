var Card = /** @class */ (function () {
    function Card(x, y) {
        this.half_size = 50;
        this.movable = true;
        this.home = true;
        //todo home t/f nech sa meni podla umiestnenia, pripadne zmenit ze si pamata obe polohy - lahsie ukladanie?
        this.images = [];
        this.selected_image = 0;
        this.x = x;
        this.y = y;
    }
    Card.prototype.toJSON = function () {
        return {
            x: this.x,
            y: this.y
        };
    };
    Card.fromJSON = function (json) {
        return new TextCard(json.x, json.y);
    };
    Card.prototype.clone = function () {
        return new Card(this.x, this.y);
    };
    Card.prototype.getCoordinates = function () {
        return [this.x, this.y];
    };
    Card.prototype.setCoordinates = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Card.prototype.isMovable = function () {
        return this.movable;
    };
    Card.prototype.setMovable = function (movable) {
        this.movable = movable;
    };
    Card.prototype.draw = function (ctx) {
    };
    Card.prototype.drawOutline = function (ctx) {
    };
    Card.prototype.isCLicked = function (x, y) {
        var clicked = (x >= this.x - this.half_size && x <= this.x + this.half_size) && (y >= this.y - this.half_size && y <= this.y + this.half_size);
        if (clicked && this.images.length > 1) { //todo zmenit pre imagecard
            this.selected_image++;
            this.selected_image %= (this.images.length);
        }
        return clicked;
    };
    return Card;
}());
