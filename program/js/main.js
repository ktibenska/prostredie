var Main = /** @class */ (function () {
    function Main() {
        var _this = this;
        this.x = -10;
        this.y = -10;
        this.imageInput = document.getElementById('id_email');
        this.submitButton = document.getElementById('submit');
        this.bgImageInput = document.getElementById('id_bg');
        this.bgSubmitButton = document.getElementById('bg_submit');
        this.shuffleButton = document.getElementById('shuffle_cards');
        this.outlineButton = document.getElementById('outline_cards');
        this.canvas = new Canvas('sketchpad_main');
        this.mode = "move" /* Types.MOVE */;
        this.canvas.addEventListeners(function (e) { return _this.onMouseDown(e); }, function (e) { return _this.onMouseMove(e); }, function (e) { return _this.onMouseUp(e); }, function (e) { return _this.onMouseEnter(e); }, function (e) { return _this.onMouseLeave(e); });
        this.homeCanvas = new Canvas('home_state_canvas');
        this.finalCanvas = new Canvas('final_state_canvas');
        this.clearAll();
        this.submitButton.addEventListener('click', function (event) {
            var input = _this.imageInput;
            var c;
            if (input.files && input.files[0]) {
                //todo check aj podla toho ci je zakliknuty checkbox text/obrazok!
                // ked je pridany obrazok a kliknuty text, vykresli sa obrazok aj tak - text naopak
                c = new ImageCard(_this.x, _this.y, _this.generateID());
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
                c = new TextCard(_this.x, _this.y, _this.generateID());
                var text = document.getElementById('text_value');
                c.text = ' ';
                if (text.value)
                    c.text = text.value;
                var textColorSelector = document.getElementById('color_selector_text');
                c.text_color = textColorSelector.value;
                var bgColorSelector = document.getElementById('color_selector_bg');
                c.bg_color = bgColorSelector.value;
            }
            var immovable = document.querySelector('input[name="movableCardRadio"]:checked').id;
            if (immovable == 'iCardRadio')
                c.setMovable(false); //todo kontrola
            var width = document.getElementById('width');
            var height = document.getElementById('height');
            if (width.value)
                c.width = +width.value;
            if (height.value)
                c.height = +height.value;
            _this.canvas.cards.push(c);
            if (!c.movable) {
                _this.addImmovableCard(c);
                // this.homeCanvas.cards.push(c.clone())
                // this.finalCanvas.cards.push(c.clone())
            }
            _this.redrawAll();
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
            var bgColorSelector = document.getElementById('bg_color');
            _this.canvas.bgColor = bgColorSelector.value;
            _this.homeCanvas.bgColor = bgColorSelector.value;
            _this.finalCanvas.bgColor = bgColorSelector.value;
            _this.redrawAll();
        });
        this.canvas.canvas.addEventListener('contextmenu', function (event) {
            event.preventDefault();
            var contextMenu = document.getElementById('contextMenu');
            if (_this.mode == "run" /* Types.RUN */)
                return;
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
        var data = "{";
        data += '\"bgcolor\":' + JSON.stringify(this.canvas.bgColor) + ',';
        if (this.canvas.image != null) {
            data += '\"bg\":' + JSON.stringify(this.canvas.image.src) + ',';
        }
        data += '\"shuffle\":' + JSON.stringify(this.shuffleButton.checked) + ',';
        data += '\"outline\":' + JSON.stringify(this.outlineButton.checked) + ',';
        var cardDataString = "";
        for (var _i = 0, _a = this.homeCanvas.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            cardDataString += JSON.stringify(card) + ",";
        }
        for (var _b = 0, _c = this.finalCanvas.cards; _b < _c.length; _b++) {
            var card = _c[_b];
            cardDataString += JSON.stringify(card) + ",";
        }
        var downloadFile = function () {
            var link = document.createElement("a");
            var content = data + '\"cards\":[' + cardDataString.slice(0, -1) + ']}';
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
        this.canvas.bgColor = json.bgcolor;
        this.homeCanvas.bgColor = json.bgcolor;
        this.finalCanvas.bgColor = json.bgcolor;
        if (json.bg) {
            var bgimage = new Image();
            bgimage.src = json.bg;
            this.canvas.setBg(bgimage);
            this.homeCanvas.setBg(bgimage);
            this.finalCanvas.setBg(bgimage);
        }
        this.shuffleButton.checked = json.shuffle;
        this.outlineButton.checked = json.outline;
        for (var _i = 0, _a = json.cards; _i < _a.length; _i++) {
            var x = _a[_i];
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
        this.redrawAll();
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
            this.canvas.addCard(new TextCard(e.offsetX - 50, e.offsetY - 50, this.generateID())); //?
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
        if (this.mode == "resize" /* Types.RESIZE */) {
            for (var _b = 0, _c = this.canvas.cards; _b < _c.length; _b++) {
                var card = _c[_b];
                if (card.getClickedHandle(x, y)) {
                    this.selected = card;
                    break;
                }
            }
        }
    };
    Main.prototype.onMouseMove = function (e) {
        if (this.canvas.cards[0]) { // todo ?
        }
        var x = e.offsetX - this.canvas.getViewX();
        var y = e.offsetY - this.canvas.getViewY();
        if (this.mode == "resize" /* Types.RESIZE */ && this.selected) {
            switch (this.selected.getClickedHandle(x, y)) {
                case "top-left" /* Sides.TL */:
                    this.selected.width += this.selected.x - x;
                    this.selected.height += this.selected.y - y;
                    this.selected.x = x;
                    this.selected.y = y;
                    break;
                case "top-right" /* Sides.TR */:
                    this.selected.width = x - this.selected.x;
                    this.selected.height += this.selected.y - y;
                    this.selected.y = y;
                    break;
                case "bottom-left" /* Sides.BL */:
                    this.selected.width += this.selected.x - x;
                    this.selected.x = x;
                    this.selected.height = y - this.selected.y;
                    break;
                case "bottom-right" /* Sides.BR */:
                    this.selected.width = x - this.selected.x;
                    this.selected.height = y - this.selected.y;
                    break;
            }
        }
        if (this.selected) {
            if (this.mode == "move" /* Types.MOVE */ || (this.mode == "run" /* Types.RUN */ && this.selected.isMovable())) {
                var mx = this.selected.x + (x - this.x);
                var my = this.selected.y + (y - this.y);
                this.selected.setCoordinates(mx, my);
                if (!this.selected.movable) {
                    this.homeCanvas.getCardByID(this.selected.id).setCoordinates(mx, my);
                    this.finalCanvas.getCardByID(this.selected.id).setCoordinates(mx, my);
                    this.redrawAll();
                }
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
        if (this.mode == "run" /* Types.RUN */ && this.outlineButton.checked) {
            this.canvas.redraw(this.finalCanvas);
        }
        else {
            this.canvas.redraw();
        }
        if (this.mode == "resize" /* Types.RESIZE */) {
            this.canvas.redrawResize();
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
    Main.prototype.gridOn = function (grid) {
        this.canvas.grid = grid;
        this.homeCanvas.grid = grid;
        this.finalCanvas.grid = grid;
        this.redrawAll();
    };
    Main.prototype.updateCardCategory = function (color) {
        this.selected.category = color;
        var homeCard = this.homeCanvas.getCardByID(this.selected.id);
        if (homeCard)
            homeCard.category = color;
        var finalCard = this.finalCanvas.getCardByID(this.selected.id);
        if (finalCard)
            finalCard.category = color;
        this.selected = null;
    };
    //
    Main.prototype.checkCards = function () {
        if (this.homeCanvas.cards.length != this.finalCanvas.cards.length) {
            return false;
        }
        // console.log(this.homeCanvas.cards.length)
        // console.log(this.finalCanvas.cards.length)
        for (var i = 0; i < this.homeCanvas.cards.length; i++) {
            var homeCard = this.homeCanvas.cards[i];
            if (homeCard.isMovable()) {
                continue;
            }
            var finalcard = this.finalCanvas.getCardByID(homeCard.id);
            if (!this.isSamePosition(homeCard, finalcard)) {
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
        if (this.shuffleButton.checked) {
            for (var _b = 0, _c = this.canvas.cards; _b < _c.length; _b++) {
                var card = _c[_b];
                if (!card.movable) {
                    continue;
                }
                var randomCard = this.canvas.cards[Math.floor(Math.random() * this.canvas.cards.length)];
                if (!randomCard.movable)
                    continue;
                var randomCardCoords = randomCard.getCoordinates();
                randomCard.setCoordinates.apply(randomCard, card.getCoordinates());
                card.setCoordinates.apply(card, randomCardCoords);
            }
        }
    };
    Main.prototype.isSamePosition = function (card1, card2) {
        return !(Math.abs(card1.x - card2.x) > 20 || Math.abs(card1.y - card2.y) > 20);
    };
    Main.prototype.checkSolution = function () {
        var ok = true;
        var _loop_1 = function (card) {
            // podla id
            if (card.category == 'white') {
                var idcard = this_1.canvas.getCardByID(card.id);
                if (!this_1.isSamePosition(card, idcard)) {
                    ok = false;
                    return "break";
                }
                if (card.images.length > 1) {
                    if (card.selected_image != idcard.selected_image) {
                        ok = false;
                        return "break";
                    }
                }
            }
            else //ma nastavenu kategoriu
             {
                var categorycards = this_1.canvas.cards.filter(function (c) { return c.category === card.category; });
                var okCategorycards = false;
                for (var _b = 0, categorycards_1 = categorycards; _b < categorycards_1.length; _b++) {
                    var c = categorycards_1[_b];
                    if (this_1.isSamePosition(card, c)) {
                        okCategorycards = true;
                        break;
                    }
                }
                if (!okCategorycards) {
                    ok = false;
                    return "break";
                }
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this.finalCanvas.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            var state_1 = _loop_1(card);
            if (state_1 === "break")
                break;
        }
        if (ok) {
            alert("riešenie je správne!");
        }
        else {
            alert("riešenie je nesprávne");
        }
    };
    Main.prototype.duplicateCard = function () {
        var duplicate = this.selected.clone();
        duplicate.id = this.generateID();
        this.canvas.cards.push(duplicate);
        if (!duplicate.movable) {
            this.addImmovableCard(duplicate);
        }
        this.redrawAll();
        this.selected = null;
    };
    // adds immovable card to home and final canvas
    Main.prototype.addImmovableCard = function (card) {
        this.homeCanvas.cards.push(card.clone());
        var finalDuplicate = card.clone();
        finalDuplicate.home = false;
        this.finalCanvas.cards.push(finalDuplicate);
    };
    Main.prototype.removeCard = function () {
        var id = this.selected.id;
        this.canvas.cards = this.canvas.cards.filter(function (item) { return item.id !== id; });
        this.homeCanvas.cards = this.homeCanvas.cards.filter(function (item) { return item.id !== id; });
        this.finalCanvas.cards = this.finalCanvas.cards.filter(function (item) { return item.id !== id; });
        this.redrawAll();
        this.selected = null;
    };
    Main.prototype.generateID = function () {
        if (this.canvas.cards.length > 0) {
            return this.canvas.cards.slice(-1)[0].id + 1;
        }
        return 1;
    };
    Main.prototype.redrawAll = function () {
        this.redraw();
        this.homeCanvas.redraw();
        this.finalCanvas.redraw();
    };
    return Main;
}());
