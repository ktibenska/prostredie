var Card = /** @class */ (function () {
    function Card(x, y, id) {
        this.width = 100;
        this.height = 100;
        this.handleSize = 10;
        this.movable = true;
        this.home = true;
        this.images = [];
        this.selected_image = 0;
        this.category = 'white';
        this.x = x;
        this.y = y;
        this.id = id;
    }
    Card.prototype.clone = function () {
        return new Card(this.x, this.y, this.id);
    };
    Card.prototype.toJSON = function () {
        return {
            x: this.x,
            y: this.y
        };
    };
    Card.fromJSON = function (json) {
        return new TextCard(json.x, json.y, json.id);
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
        return true;
    };
    Card.prototype.drawResize = function (ctx) {
    };
    Card.prototype.getClickedHandle = function (x, y) {
        return null;
    };
    return Card;
}());
