var Main = /** @class */ (function () {
    function Main() {
        var _this = this;
        this.x = -10;
        this.y = -10;
        this.imageInput = document.getElementById('id_email');
        this.submitButton = document.getElementById('submit');
        this.bgImageInput = document.getElementById('id_bg');
        this.bgSubmitButton = document.getElementById('bg_submit');
        this.canvas = new Canvas('sketchpad_main');
        this.mode = "move" /* Types.MOVE */;
        this.canvas.addEventListeners(function (e) { return _this.onMouseDown(e); }, function (e) { return _this.onMouseMove(e); }, function (e) { return _this.onMouseUp(e); }, function (e) { return _this.onMouseEnter(e); }, function (e) { return _this.onMouseLeave(e); });
        this.redraw();
        this.homeCanvas = new Canvas('home_state_canvas');
        this.finalCanvas = new Canvas('final_state_canvas');
        this.clearAll();
        this.canvas.canvas.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
        this.submitButton.addEventListener('click', function (event) {
            var input = _this.imageInput;
            if (input.files && input.files[0]) {
                var c_1 = new Card(_this.x, _this.y);
                var filesArray = [];
                for (var i = 0; i < input.files.length; i++) {
                    filesArray.push(input.files[i]);
                }
                var imageFiles_1 = [];
                filesArray.forEach(function (file) {
                    imageFiles_1.push(file);
                });
                console.log(imageFiles_1);
                imageFiles_1.forEach(function (file, index) {
                    var reader = new FileReader();
                    reader.onload = function () {
                        // console.log(`Image ${index + 1}:`, reader.result);
                        var image = new Image();
                        image.src = reader.result;
                        c_1.images.push(image);
                    };
                    reader.readAsDataURL(file);
                });
                var inputValue = document.querySelector('input[name="movableCardRadio"]:checked').id;
                if (inputValue == 'iCardRadio')
                    c_1.movable = false; //todo kontanta
                var xsize = document.getElementById('xvalue');
                var x = '100';
                if (xsize.value)
                    x = xsize.value;
                c_1.half_size = +x / 2;
                _this.canvas.cards.push(c_1);
                _this.redraw();
            }
        });
        this.bgSubmitButton.addEventListener('click', function (event) {
            var image = new Image();
            var files = _this.bgImageInput.files;
            if (files && files[0]) { //todo kontrola if checked text/obrazok
                var reader = new FileReader();
                reader.onload = function (e) {
                    image.src = e.target.result;
                };
                reader.readAsDataURL(files[0]);
                _this.canvas.setBg(image);
                _this.homeCanvas.setBg(image);
                _this.finalCanvas.setBg(image);
            }
            _this.redraw();
            _this.homeCanvas.redraw();
            _this.finalCanvas.redraw();
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
        if (this.mode == "move" /* Types.MOVE */ || this.mode == "solve" /* Types.SOLVE */) {
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
        if (this.mode == "solve" /* Types.SOLVE */) {
            if (this.selected && this.selected.movable) {
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
        if (this.mode == "solve" /* Types.SOLVE */) {
            this.canvas.redraw(this.finalCanvas);
        }
        else {
            this.canvas.redraw();
        }
    };
    Main.prototype.clearAll = function () {
        this.canvas.clear();
        this.homeCanvas.clear();
        this.finalCanvas.clear();
    };
    Main.prototype.checkSolution = function () {
        var ok = true;
        var cards = this.canvas.cards;
        var final = this.finalCanvas.cards;
        for (var i = 0; i < this.canvas.cards.length; i++) {
            if (Math.abs(cards[i].x - final[i].x) > 20 || Math.abs(cards[i].y - final[i].y) > 20)
                ok = false;
            if (cards[i].selected_image != final[i].selected_image)
                ok = false;
            // console.log(Math.abs(cards[i].x - final[i].x))
            // console.log(Math.abs(cards[i].y - final[i].y))
        }
        if (ok) {
            alert("riešenie je správne!");
        }
        else {
            alert("riešenie je nesprávne");
        }
    };
    return Main;
}());
