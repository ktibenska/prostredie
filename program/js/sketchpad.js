var Sketchpad = /** @class */ (function () {
    function Sketchpad() {
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
        this.canvas.canvas.addEventListener('contextmenu', function (event) {
            event.preventDefault();
            // this.imageInput.click();
            // this.redraw()
        });
        // this.imageInput.addEventListener('change', (event: Event) => {
        //     console.log('CHANGE')
        //     let image = new Image();
        //     const files = this.imageInput.files;
        //
        //     if (files && files[0]) { //todo check if image
        //         console.log('toto sa deje')
        //         const reader = new FileReader();
        //         reader.onload = function (e) {
        //             image.src = e.target.result as string;
        //         };
        //         reader.readAsDataURL(files[0]);
        //         let c = new Card(this.x, this.y)
        //         c.image = image
        //         this.canvas.cards.push(c)
        //         this.redraw()
        //         console.log('pridany,', this.canvas.cards.length)
        //
        //     }
        //
        //     this.redraw();
        //
        // });
        this.submitButton.addEventListener('click', function (event) {
            console.log('CHANGE');
            var image = new Image();
            var files = _this.imageInput.files;
            var c = new Card(_this.x, _this.y);
            if (files && files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    image.src = e.target.result;
                };
                reader.readAsDataURL(files[0]);
                c.image = image;
                _this.canvas.cards.push(c);
            }
            else {
                var xsize = document.getElementById('xvalue');
                var x = '100';
                if (xsize)
                    x = xsize.value;
                c.half_size = +x / 2;
                _this.canvas.cards.push(c);
            }
            _this.redraw();
        });
    }
    Sketchpad.prototype.setMode = function (mode) {
        this.mode = mode;
    };
    Sketchpad.prototype.onMouseDown = function (e) {
        var x = e.offsetX;
        var y = e.offsetY;
        // if (e.button !== 0) return;
        // if (e.button !== 0 || e.button !== 1 || e.button !== 2) return;
        if (this.mode == "add" /* Types.ADD */) {
            this.canvas.addCard(new MovableCard(e.offsetX, e.offsetY));
        }
        if (this.mode == "move" /* Types.MOVE */) {
            for (var _i = 0, _a = this.canvas.cards; _i < _a.length; _i++) {
                var card = _a[_i];
                if (card.isCLicked(x, y)) {
                    this.selected = card;
                    // break;
                }
                console.log(this.selected);
                console.log("move");
            }
            this.x = e.offsetX;
            this.y = e.offsetY;
            this.redraw();
        }
    };
    Sketchpad.prototype.onMouseMove = function (e) {
        if (this.canvas.cards[0]) {
            console.log(',');
            console.log(this.canvas.cards[0].x, this.canvas.cards[0].y);
        }
        var x = e.offsetX - this.canvas.getViewX();
        var y = e.offsetY - this.canvas.getViewY();
        console.log(this.canvas.cards.length);
        console.log('..');
        if (this.mode == "move" /* Types.MOVE */) {
            if (this.selected) {
                this.selected.move(x, y);
            }
        }
        this.x = e.offsetX;
        this.y = e.offsetY;
        this.redraw();
    };
    Sketchpad.prototype.onMouseUp = function (e) {
        // this.selected.x/=10
        if (this.selected != null) {
            this.selected.x -= (this.selected.x %= 10);
            this.selected.y -= (this.selected.y %= 10);
        }
        this.selected = null;
        this.x = e.offsetX;
        this.y = e.offsetY;
        this.redraw();
    };
    Sketchpad.prototype.onMouseLeave = function (e) {
        console.log('leave');
        this.redraw();
    };
    Sketchpad.prototype.onMouseEnter = function (e) {
        console.log('enter');
        this.x = e.offsetX;
        this.y = e.offsetY;
        this.redraw();
    };
    Sketchpad.prototype.redraw = function () {
        this.canvas.bg();
        this.canvas.redraw();
    };
    return Sketchpad;
}());
