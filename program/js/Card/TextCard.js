var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TextCard = /** @class */ (function (_super) {
    __extends(TextCard, _super);
    function TextCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.text = "test";
        _this.text_color = "#000000";
        _this.bg_color = "#ffff00";
        return _this;
    }
    TextCard.prototype.clone = function () {
        var clone = new TextCard(this.x, this.y);
        clone.half_size = this.half_size;
        clone.movable = this.movable;
        clone.category = this.category;
        clone.text = this.text;
        clone.text_color = this.text_color;
        clone.bg_color = this.bg_color;
        return clone;
    };
    TextCard.prototype.toJSON = function () {
        return {
            x: this.x,
            y: this.y,
            movable: this.movable,
            home: this.home,
            category: this.category,
            text: this.text,
            text_color: this.text_color,
            bg_color: this.bg_color
        };
    };
    TextCard.fromJSON = function (json) {
        var card = new TextCard(json.x, json.y);
        card.movable = json.movable;
        card.home = json.home;
        card.category = json.category;
        card.text = json.text;
        card.text_color = json.text_color;
        card.bg_color = json.bg_color;
        return card;
    };
    TextCard.prototype.draw = function (ctx) {
        ctx.fillStyle = this.bg_color;
        ctx.fillRect(this.x, this.y, this.half_size * 2, this.half_size * 2);
        ctx.fillStyle = this.text_color;
        ctx.font = "20px Arial";
        ctx.fillText(this.text, this.x, this.y + this.half_size);
    };
    TextCard.prototype.drawOutline = function (ctx) {
        ctx.fillStyle = "lightgray";
        ctx.strokeStyle = "black";
        // let w = this.half_size * 2;
        // let h = this.half_size * 2;
        ctx.strokeRect(this.x, this.y, this.half_size * 2, this.half_size * 2);
    };
    TextCard.prototype.isCLicked = function (x, y) {
        return (x >= this.x && x <= this.x + this.half_size * 2) && (y >= this.y && y <= this.y + this.half_size * 2);
    };
    return TextCard;
}(Card));
