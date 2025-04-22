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
                c.setMovable(false); //todo kontanta
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
        this.canvas.canvas.addEventListener('contextmenu', function (event) {
            event.preventDefault();
            var contextMenu = document.getElementById('contextMenu');
            var x = event.offsetX;
            var y = event.offsetY;
            for (var _i = 0, _a = _this.canvas.cards; _i < _a.length; _i++) {
                var card = _a[_i];
                if (card.isCLicked(x, y)) {
                    _this.selected = card;
                    // button color
                    if (_this.selected.category) {
                        document.querySelectorAll('.color-btn').forEach(function (btn) {
                            var button = btn;
                            var matches = button.style.backgroundColor === _this.selected.category;
                            button.classList.toggle('selected-color', matches);
                        });
                    }
                    contextMenu.style.display = 'block';
                    contextMenu.style.left = "".concat(event.pageX - 15, "px");
                    contextMenu.style.top = "".concat(event.pageY - 15, "px");
                }
            }
            contextMenu.addEventListener("mouseleave", function () {
                contextMenu.style.display = "none";
                _this.selected = null;
            });
        });
    }
    Main.prototype.toJSON = function () {
        var string = "";
        //todo najprv ulozit:
        //      - ci shuffle t/f
        //      - POZADIE A OBRAZKY
        for (var _i = 0, _a = this.homeCanvas.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            string += JSON.stringify(card) + ",";
        }
        for (var _b = 0, _c = this.finalCanvas.cards; _b < _c.length; _b++) {
            var card = _c[_b];
            string += JSON.stringify(card) + ",";
        }
        console.log(string);
        var downloadFile = function () {
            var link = document.createElement("a");
            var content = '[' + string.slice(0, -1) + ']';
            var file = new Blob([content], { type: 'application/json' });
            link.href = URL.createObjectURL(file);
            link.download = "test.json";
            link.click();
            URL.revokeObjectURL(link.href);
        };
        downloadFile();
    };
    Main.prototype.fromJSON = function (json) {
        this.clearAll();
        for (var _i = 0, json_1 = json; _i < json_1.length; _i++) {
            var x = json_1[_i];
            var card = void 0;
            if (x.text) {
                card = TextCard.fromJSON(x);
            }
            else {
                card = ImageCard.fromJSON(x);
            }
            if (x.home) {
                this.homeCanvas.cards.push(card);
            }
            else {
                this.finalCanvas.cards.push(card);
            }
        }
        this.sortCards();
        this.homeCanvas.redraw();
        this.finalCanvas.redraw();
        this.redraw();
    };
    Main.prototype.setMode = function (mode) {
        this.mode = mode;
    };
    Main.prototype.onMouseDown = function (e) {
        if (e.button !== 0)
            return;
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
            if (this.selected && this.selected.isMovable()) {
                this.selected.setCoordinates(x, y);
            }
        }
        this.x = e.offsetX;
        this.y = e.offsetY;
        this.redraw();
    };
    Main.prototype.onMouseUp = function (e) {
        if (e.button !== 0)
            return;
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
        if (!this.checkCards()) {
            window.alert("nesprávne položené kartičky"); //todo change message
            return;
        }
        this.canvas.cards = [];
        this.sortCards();
        this.mode = "run" /* Types.RUN */;
        this.redraw();
    };
    Main.prototype.checkCards = function () {
        if (this.homeCanvas.cards.length != this.finalCanvas.cards.length) {
            return false;
        }
        console.log(this.homeCanvas.cards.length);
        console.log(this.finalCanvas.cards.length);
        for (var i = 0; i < this.homeCanvas.cards.length; i++) {
            var homeCard = this.homeCanvas.cards[i];
            if (homeCard.isMovable()) {
                continue;
            }
            if (homeCard.getCoordinates() != this.finalCanvas.cards[i].getCoordinates()) {
                console.log("?");
                console.log(homeCard.isMovable());
                return false;
            }
        }
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
    Main.prototype.removeCard = function () {
        var card = this.selected;
        // todo zmenit, vymazavat priamo
        //  vymazat aj z home aj final
        var newCards = this.canvas.cards.filter(function (item) { return item !== card; });
        this.canvas.cards = newCards;
        this.redraw();
        this.selected = null;
    };
    Main.prototype.updateCardCategory = function (color) {
        this.selected.category = color;
        this.selected = null;
    };
    return Main;
}());
