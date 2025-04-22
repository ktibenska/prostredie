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
        var clone = new TextCard(this.x, this.y, this.id);
        clone.xsize = this.xsize;
        clone.ysize = this.ysize;
        clone.movable = this.movable;
        clone.category = this.category;
        clone.text = this.text;
        clone.text_color = this.text_color;
        clone.bg_color = this.bg_color;
        return clone;
    };
    TextCard.prototype.toJSON = function () {
        return {
            id: this.id,
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
        var card = new TextCard(json.x, json.y, json.id);
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
        ctx.fillRect(this.x, this.y, this.xsize, this.ysize);
        ctx.fillStyle = this.text_color;
        ctx.font = "20px Arial";
        ctx.fillText(this.text, this.x, this.y + this.ysize / 2);
    };
    TextCard.prototype.drawResize = function (ctx) {
        this.drawHandle(ctx, this.x, this.y); // TL
        this.drawHandle(ctx, this.x + this.xsize, this.y); // TR
        this.drawHandle(ctx, this.x, this.y + this.ysize); // BL
        this.drawHandle(ctx, this.x + this.xsize, this.y + this.ysize); //BR
    };
    TextCard.prototype.drawHandle = function (ctx, x, y) {
        ctx.fillRect(x - this.handleSize / 2, y - this.handleSize / 2, this.handleSize, this.handleSize);
    };
    TextCard.prototype.getClickedHandle = function (x, y) {
        if (this.isHandleClicked(x, y, this.x, this.y))
            return "top-left" /* Sides.TL */;
        if (this.isHandleClicked(x, y, this.x + this.xsize, this.y))
            return "top-right" /* Sides.TR */;
        if (this.isHandleClicked(x, y, this.x, this.y + this.ysize))
            return "bottom-left" /* Sides.BL */;
        if (this.isHandleClicked(x, y, this.x + this.xsize, this.y + this.ysize))
            return "bottom-right" /* Sides.BR */;
        return null;
    };
    TextCard.prototype.isHandleClicked = function (mx, my, x, y) {
        var handleBorder = 5;
        return ((mx >= x - handleBorder - this.handleSize / 2) && (mx <= x + handleBorder + this.handleSize / 2) &&
            (my >= y - handleBorder - this.handleSize / 2) && (my <= y + handleBorder + this.handleSize / 2));
    };
    TextCard.prototype.drawOutline = function (ctx) {
        ctx.fillStyle = "lightgray";
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y, this.xsize, this.ysize);
    };
    TextCard.prototype.isCLicked = function (x, y) {
        return (x >= this.x && x <= this.x + this.xsize) && (y >= this.y && y <= this.y + this.ysize);
    };
    return TextCard;
}(Card));
