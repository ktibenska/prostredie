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
var ImageCard = /** @class */ (function (_super) {
    __extends(ImageCard, _super);
    function ImageCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.images = [];
        _this.selected_image = 0;
        return _this;
    }
    ImageCard.prototype.toJSON = function () {
        return {
            x: this.x,
            y: this.y,
            movable: this.movable,
            home: this.home,
            images: this.images,
            selected_image: this.selected_image
        };
    };
    ImageCard.fromJSON = function (json) {
        var card = new ImageCard(json.x, json.y);
        card.movable = json.movable;
        card.home = json.home;
        card.images = [json.images];
        card.selected_image = json.selected_image;
        return card;
    };
    ImageCard.prototype.clone = function () {
        var clone = new ImageCard(this.x, this.y);
        clone.half_size = this.half_size;
        clone.images = this.images;
        clone.selected_image = this.selected_image;
        // clone.setMovable(this.isMovable);
        clone.movable = this.movable;
        return clone;
    };
    ImageCard.prototype.draw = function (ctx) {
        var img = this.images[this.selected_image];
        ctx.drawImage(img, this.x, this.y, img.width, img.height);
    };
    ImageCard.prototype.drawOutline = function (ctx) {
        ctx.fillStyle = "lightgray";
        ctx.strokeStyle = "black";
        var w = this.images[0].width;
        var h = this.images[0].height;
        ctx.rect(this.x, this.y, w, h);
        ctx.stroke();
    };
    return ImageCard;
}(Card));
