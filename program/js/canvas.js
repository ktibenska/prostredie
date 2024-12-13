var Canvas = /** @class */ (function () {
    function Canvas(id) {
        this.cards = [];
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
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, w, h);
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
    Canvas.prototype.redraw = function () {
        var _this = this;
        this.bg();
        this.cards.map(function (o) { return o.draw(_this.ctx); });
    };
    Canvas.prototype.clear = function () {
        this.bg();
        this.cards = [];
    };
    return Canvas;
}());
