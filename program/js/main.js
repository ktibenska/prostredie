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
            var c;
            if (input.files && input.files[0]) {
                //todo check aj podla toho ci je zakliknuty checkbox text/obrazok!
                // ked je pridany obrazok a kliknuty text, vykresli sa obrazok aj tak - text naopak
                c = new ImageCard(_this.x, _this.y);
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
                        c.images.push(image);
                    };
                    reader.readAsDataURL(file);
                });
            }
            else {
                c = new TextCard(_this.x, _this.y);
                var text = document.getElementById('text_value');
                c.text = text.value;
                var textColorSelector = document.getElementById('color_selector_text');
                c.text_color = textColorSelector.value;
                var bgColorSelector = document.getElementById('color_selector_bg');
                c.bg_color = bgColorSelector.value;
            }
            var inputValue = document.querySelector('input[name="movableCardRadio"]:checked').id;
            if (inputValue == 'iCardRadio')
                c.movable = false; //todo kontanta
            var xsize = document.getElementById('xvalue');
            var x = '100';
            if (xsize.value)
                x = xsize.value;
            c.half_size = +x / 2;
            _this.canvas.cards.push(c);
            _this.redraw();
        });
        this.bgSubmitButton.addEventListener('click', function (event) {
            var image = new Image();
            var files = _this.bgImageInput.files;
            if (files && files[0]) {
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
            this.canvas.addCard(new TextCard(e.offsetX, e.offsetY)); //?
        }
        if (this.mode == "move" /* Types.MOVE */ || this.mode == "run" /* Types.RUN */) {
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
        if (this.canvas.cards[0]) { // todo ?
        }
        var x = e.offsetX - this.canvas.getViewX();
        var y = e.offsetY - this.canvas.getViewY();
        if (this.mode == "move" /* Types.MOVE */) {
            if (this.selected) {
                this.selected.setCoordinates(x, y);
            }
        }
        if (this.mode == "run" /* Types.RUN */) {
            if (this.selected && this.selected.movable) {
                this.selected.setCoordinates(x, y);
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
        if (this.mode == "run" /* Types.RUN */) {
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
    // funkcie pri tlacidlach
    Main.prototype.runApplication = function () {
        if (!this.correctCardsCheck())
            return;
        this.canvas.cards = [];
        this.sortCards();
        this.redraw();
        this.mode = "run" /* Types.RUN */;
    };
    Main.prototype.correctCardsCheck = function () {
        // todo CHECK:
        //      - ci je rovnaky pocet karticiek v final a home stave
        //      - ci immovable karticky su na rovnakom mieste v home a final stave
        return true;
    };
    //adds cards from homestate to canvas, sorts all movable cards
    Main.prototype.sortCards = function () {
        for (var _i = 0, _a = this.homeCanvas.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            this.canvas.cards.push(card.clone());
        }
        var shuffle = document.getElementById('shuffle_cards');
        if (shuffle) {
            for (var _b = 0, _c = this.canvas.cards; _b < _c.length; _b++) {
                var card = _c[_b];
                var randomCard = this.canvas.cards[Math.floor(Math.random() * this.canvas.cards.length)];
                var randomCardCoords = randomCard.getCoordinates();
                randomCard.setCoordinates.apply(randomCard, card.getCoordinates());
                card.setCoordinates.apply(card, randomCardCoords);
            }
        }
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
