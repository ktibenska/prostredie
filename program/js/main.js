var Main = /** @class */ (function () {
    function Main() {
        var _this = this;
        this.x = -10;
        this.y = -10;
        this.imageInput = document.getElementById('id_email');
        this.submitButton = document.getElementById('submit');
        this.canvas = new Canvas('sketchpad_main');
        this.mode = "move" /* Types.MOVE */;
        this.canvas.addEventListeners(function (e) { return _this.onMouseDown(e); }, function (e) { return _this.onMouseMove(e); }, function (e) { return _this.onMouseUp(e); }, function (e) { return _this.onMouseEnter(e); }, function (e) { return _this.onMouseLeave(e); });
        this.redraw();
        this.homecanvas = new Canvas('home_state_canvas');
        this.finalcanvas = new Canvas('final_state_canvas');
        this.clearAll();
        this.canvas.canvas.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
        this.submitButton.addEventListener('click', function (event) {
            var image = new Image();
            var files = _this.imageInput.files;
            var c = new Card(_this.x, _this.y);
            if (files && files[0]) { //todo kontrola if checked text/obrazok
                var reader = new FileReader();
                reader.onload = function (e) {
                    image.src = e.target.result;
                };
                reader.readAsDataURL(files[0]);
                c.image = image;
                _this.canvas.cards.push(c);
            }
            var xsize = document.getElementById('xvalue');
            var x = '100';
            if (xsize.value)
                x = xsize.value;
            c.half_size = +x / 2;
            _this.canvas.cards.push(c);
            _this.redraw();
        });
    }
    Main.prototype.setMode = function (mode) {
        this.mode = mode;
    };
    Main.prototype.onMouseDown = function (e) {
        var x = e.offsetX;
        var y = e.offsetY;
        if (this.mode == "add" /* Types.ADD */) {
            this.canvas.addCard(new MovableCard(e.offsetX, e.offsetY));
        }
        if (this.mode == "move" /* Types.MOVE */) {
            for (var _i = 0, _a = this.canvas.cards; _i < _a.length; _i++) {
                var card = _a[_i];
                if (card.isCLicked(x, y)) {
                    this.selected = card;
                }
            }
            this.x = e.offsetX;
            this.y = e.offsetY;
            this.redraw();
        }
    };
    Main.prototype.onMouseMove = function (e) {
        if (this.canvas.cards[0]) {
        }
        var x = e.offsetX - this.canvas.getViewX();
        var y = e.offsetY - this.canvas.getViewY();
        if (this.mode == "move" /* Types.MOVE */) {
            if (this.selected) {
                this.selected.move(x, y);
            }
        }
        this.x = e.offsetX;
        this.y = e.offsetY;
        this.redraw();
    };
    Main.prototype.onMouseUp = function (e) {
        if (this.selected != null) {
            this.selected.x -= (this.selected.x %= 10);
            this.selected.y -= (this.selected.y %= 10);
        }
        this.selected = null;
        this.x = e.offsetX;
        this.y = e.offsetY;
        this.redraw();
    };
    Main.prototype.onMouseLeave = function (e) {
        this.redraw();
    };
    Main.prototype.onMouseEnter = function (e) {
        this.x = e.offsetX;
        this.y = e.offsetY;
        this.redraw();
    };
    Main.prototype.redraw = function () {
        this.canvas.bg();
        this.canvas.redraw();
    };
    Main.prototype.clearAll = function () {
        this.canvas.clear();
        this.homecanvas.clear();
        this.finalcanvas.clear();
    };
    return Main;
}());
