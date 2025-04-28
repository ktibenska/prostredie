var Canvas = /** @class */ (function () {
    function Canvas(id) {
        this.cards = [];
        this.image = null;
        this.bgColor = '#ffffff';
        this.grid = true;
        this.viewX = 0;
        this.viewY = 0;
        this.canvas = document.getElementById(id);
        this.canvas.width = document.getElementById('canvas-row').offsetWidth;
        this.canvas.height = document.getElementById('canvas-row').offsetHeight;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 5;
        this.ctx.lineCap = 'round';
    }
    Canvas.prototype.addCard = function (card) {
        this.cards.push(card);
    };
    Canvas.prototype.bg = function () {
        this.canvas.width = document.getElementById('canvas-row').offsetWidth;
        this.canvas.height = document.getElementById('canvas-row').offsetHeight;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        function mod(n, m) {
            return ((n % m) + m) % m;
        }
        var w = this.canvas.width;
        var h = this.canvas.height;
        if (this.image) {
            this.ctx.drawImage(this.image, 0, 0, w, h);
            return;
        }
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, w, h);
        if (!this.grid)
            return;
        this.ctx.lineWidth = 0.3;
        this.ctx.strokeStyle = 'gray';
        this.ctx.fillStyle = 'black';
        for (var i = 0; i < w; i++) {
            this.ctx.lineWidth = 0.3;
            var x = i - this.viewX;
            if (mod(x, 10) != 0)
                continue;
            if (mod(x, 50) == 0)
                this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, h);
            this.ctx.stroke();
        }
        for (var i = 0; i < h; i++) {
            this.ctx.lineWidth = 0.3;
            var y = i - this.viewY;
            if (mod(y, 10) != 0)
                continue;
            if (mod(y, 50) == 0)
                this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(w, i);
            this.ctx.stroke();
        }
        this.ctx.lineWidth = 2;
    };
    Canvas.prototype.addEventListeners = function (onMouseDown, onMouseMove, onMouseUp, onMouseEnter, onMouseLeave) {
        this.canvas.addEventListener('mousedown', onMouseDown);
        this.canvas.addEventListener('mousemove', onMouseMove);
        this.canvas.addEventListener('mouseup', onMouseUp);
        this.canvas.addEventListener('mouseenter', onMouseEnter);
        this.canvas.addEventListener('mouseleave', onMouseLeave);
    };
    Canvas.prototype.getViewX = function () {
        return this.viewX;
    };
    Canvas.prototype.getViewY = function () {
        return this.viewY;
    };
    Canvas.prototype.redraw = function (finalCanvas) {
        var _this = this;
        if (finalCanvas === void 0) { finalCanvas = null; }
        this.bg();
        if (finalCanvas) {
            for (var _i = 0, _a = finalCanvas.cards; _i < _a.length; _i++) {
                var card = _a[_i];
                if (card.isMovable()) {
                    card.drawOutline(this.ctx);
                }
            }
        }
        this.cards.map(function (o) { return o.draw(_this.ctx); });
    };
    Canvas.prototype.redrawResize = function () {
        var _this = this;
        this.cards.map(function (o) { return o.drawResize(_this.ctx); });
    };
    Canvas.prototype.clear = function () {
        this.bgColor = '#ffffff';
        this.image = null;
        this.bg();
        this.cards = [];
    };
    Canvas.prototype.setBg = function (image) {
        this.image = image;
    };
    return Canvas;
}());
