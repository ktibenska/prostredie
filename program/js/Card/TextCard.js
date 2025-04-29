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
        clone.width = this.width;
        clone.height = this.height;
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
            bg_color: this.bg_color,
            width: this.width,
            height: this.height
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
        card.width = json.width;
        card.height = json.height;
        return card;
    };
    TextCard.prototype.draw = function (ctx) {
        ctx.fillStyle = this.bg_color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.text_color;
        ctx.font = "24px Arial";
        var padding = 5;
        var maxFontSize = 24;
        var minFontSize = 10;
        var fontSize = maxFontSize;
        var textWidth = ctx.measureText(this.text).width;
        while (textWidth > Math.abs(this.width - 2 * padding) && fontSize > minFontSize) {
            fontSize--;
            ctx.font = fontSize + 'px Arial';
            textWidth = Math.abs(ctx.measureText(this.text).width);
        }
        ctx.font = fontSize + 'px Arial';
        var x = this.x + this.width / 2;
        var y = this.y + this.height / 2;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, x, y);
    };
    TextCard.prototype.drawResize = function (ctx) {
        this.drawHandle(ctx, this.x, this.y); // TL
        this.drawHandle(ctx, this.x + this.width, this.y); // TR
        this.drawHandle(ctx, this.x, this.y + this.height); // BL
        this.drawHandle(ctx, this.x + this.width, this.y + this.height); //BR
    };
    TextCard.prototype.drawHandle = function (ctx, x, y) {
        ctx.fillStyle = "#000";
        ctx.fillRect(x - this.handleSize / 2, y - this.handleSize / 2, this.handleSize, this.handleSize);
    };
    TextCard.prototype.getClickedHandle = function (x, y) {
        if (this.isHandleClicked(x, y, this.x, this.y))
            return "top-left" /* Sides.TL */;
        if (this.isHandleClicked(x, y, this.x + this.width, this.y))
            return "top-right" /* Sides.TR */;
        if (this.isHandleClicked(x, y, this.x, this.y + this.height))
            return "bottom-left" /* Sides.BL */;
        if (this.isHandleClicked(x, y, this.x + this.width, this.y + this.height))
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
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    };
    TextCard.prototype.isCLicked = function (x, y) {
        return (x >= this.x && x <= this.x + this.width) && (y >= this.y && y <= this.y + this.height);
    };
    return TextCard;
}(Card));
