var Main = /** @class */ (function () {
    function Main() {
        var _this = this;
        this.x = -10;
        this.y = -10;
        this.mode = "move" /* Types.MOVE */;
        this.imageInput = document.getElementById('id_image_input');
        this.submitButton = document.getElementById('submit');
        this.bgImageInput = document.getElementById('id_bg');
        this.bgSubmitButton = document.getElementById('bg_submit');
        this.shuffleButton = document.getElementById('shuffle_cards');
        this.outlineButton = document.getElementById('outline_cards');
        this.gridButton = document.getElementById('show_grid');
        this.canvas = new Canvas('main_canvas');
        this.canvas.addEventListeners(function (e) { return _this.onMouseDown(e); }, function (e) { return _this.onMouseMove(e); }, function (e) { return _this.onMouseUp(e); }, function (e) { return _this.onMouseEnter(e); }, function () { return _this.onMouseLeave(); });
        this.homeCanvas = new Canvas('home_state_canvas');
        this.finalCanvas = new Canvas('final_state_canvas');
        this.clearAll();
        this.initSubmitButton();
        this.initBgSubmitButton();
        this.initContextMenu();
    }
    Main.prototype.toJSON = function () {
        var data = "{";
        data += '\"bgcolor\":' + JSON.stringify(this.canvas.bgColor) + ',';
        if (this.canvas.image != null) {
            data += '\"bg\":' + JSON.stringify(this.canvas.image.src) + ',';
        }
        data += '\"shuffle\":' + JSON.stringify(this.shuffleButton.checked) + ',';
        data += '\"outline\":' + JSON.stringify(this.outlineButton.checked) + ',';
        data += '\"grid\":' + JSON.stringify(this.gridButton.checked) + ',';
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
            link.download = "aktivita.json";
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
        this.gridButton.checked = json.grid;
        this.gridOn(json.grid);
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
                this.homeCanvas.addCard(card);
            }
            else {
                this.finalCanvas.addCard(card);
            }
        }
        this.sortCards();
        this.redrawAll();
    };
    Main.prototype.onMouseDown = function (e) {
        if (e.button !== 0)
            return;
        var x = e.offsetX;
        var y = e.offsetY;
        if (this.mode == "move" /* Types.MOVE */ || this.mode == "run" /* Types.RUN */) {
            var card_1 = this.getClicked(x, y);
            if (card_1 != null) {
                card_1 = card_1.clone();
                this.canvas.cards = this.canvas.cards.filter(function (item) { return item.id !== card_1.id; });
                this.canvas.addCard(card_1);
                this.selected = card_1;
                if (this.selected instanceof ImageCard) {
                    this.selected.nextImage();
                }
                this.x = e.offsetX;
                this.y = e.offsetY;
                this.redraw();
            }
        }
        if (this.mode != "run" /* Types.RUN */) {
            if (this.selected != null)
                return;
            for (var _i = 0, _a = this.canvas.cards; _i < _a.length; _i++) {
                var card = _a[_i];
                if (card.getClickedHandle(x, y)) {
                    this.selected = card;
                    this.mode = "resize" /* Types.RESIZE */;
                    break;
                }
            }
        }
    };
    Main.prototype.onMouseMove = function (e) {
        var x = e.offsetX - this.canvas.getViewX();
        var y = e.offsetY - this.canvas.getViewY();
        document.body.style.cursor = "auto";
        if (this.canvas.cards[0]) {
            if (this.getClicked(x, y)) {
                document.body.style.cursor = "pointer";
            }
        }
        if (this.selected) {
            document.body.style.cursor = "grab";
            if (this.mode == "resize" /* Types.RESIZE */) {
                var xbefore = this.selected.x;
                var ybefore = this.selected.y;
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
                this.updateCardHF(xbefore, ybefore);
                this.redrawAll();
            }
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
            var grid = 10;
            var x = Math.round(this.selected.x / grid) * grid;
            var y = Math.round(this.selected.y / grid) * grid;
            this.selected.setCoordinates(x, y);
        }
        this.selected = null;
        this.x = e.offsetX;
        this.y = e.offsetY;
        this.redraw();
        if (this.mode == "resize" /* Types.RESIZE */) {
            this.mode = "move" /* Types.MOVE */;
        }
    };
    Main.prototype.onMouseLeave = function () {
        this.redrawAll();
        document.body.style.cursor = "auto";
    };
    Main.prototype.onMouseEnter = function (e) {
        this.selected = null;
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
        if (this.mode != "run" /* Types.RUN */) {
            this.canvas.redrawResize();
        }
    };
    Main.prototype.clearAll = function () {
        this.canvas.clear();
        this.homeCanvas.clear();
        this.finalCanvas.clear();
    };
    // functions for buttons
    Main.prototype.runApplication = function () {
        if (!this.checkCards()) {
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
        if (homeCard) {
            homeCard.category = color;
        }
        var finalCard = this.finalCanvas.getCardByID(this.selected.id);
        if (finalCard) {
            finalCard.category = color;
        }
        this.selected = null;
    };
    Main.prototype.updateCardText = function (text) {
        if (this.selected && this.selected instanceof TextCard) {
            this.selected.text = text;
            this.updateCardHF();
            this.redrawAll();
        }
    };
    Main.prototype.updateCardBgColor = function (color) {
        if (this.selected && this.selected instanceof TextCard) {
            this.selected.bg_color = color;
            this.updateCardHF();
            this.redrawAll();
        }
    };
    //updates card parameters by id both in home and final state
    Main.prototype.updateCardHF = function (x, y) {
        if (x === void 0) { x = null; }
        if (y === void 0) { y = null; }
        for (var _i = 0, _a = [this.homeCanvas, this.finalCanvas]; _i < _a.length; _i++) {
            var c = _a[_i];
            var card = c.getCardByID(this.selected.id);
            if (card) {
                card.text = this.selected.text;
                card.bg_color = this.selected.bg_color;
                if (!card.movable) {
                    card.x = this.selected.x;
                    card.y = this.selected.y;
                    card.width = this.selected.width;
                    card.height = this.selected.height;
                }
                else {
                    if (x && x != this.selected.x) {
                        card.x += (this.selected.x - x);
                    }
                    card.width = this.selected.width;
                    if (y && y != this.selected.y) {
                        card.y += (this.selected.y - y);
                    }
                    card.height = this.selected.height;
                }
            }
        }
    };
    Main.prototype.checkCards = function () {
        if (this.homeCanvas.cards.length != this.finalCanvas.cards.length) {
            window.alert("V domovskom a finálnom stave nie je rovnaký počet kartičiek.");
            return false;
        }
        for (var i = 0; i < this.homeCanvas.cards.length; i++) {
            var homeCard = this.homeCanvas.cards[i];
            var finalcard = this.finalCanvas.getCardByID(homeCard.id);
            if ((homeCard.bg_color != finalcard.bg_color) || (homeCard.text != finalcard.text)) {
                window.alert("Farba alebo text kartičiek sa nezhoduje.");
                return false;
            }
            if ((homeCard.width != finalcard.width) || (homeCard.height != finalcard.height)) {
                window.alert("Rozmery kartičiek sa nezhodujú.");
                return false;
            }
            if (!homeCard.isMovable() && !this.isSamePosition(homeCard, finalcard)) {
                window.alert("Nesprávne položené kartičky.");
                return false;
            }
        }
        return true;
    };
    //adds cards from homestate to canvas, sorts all movable cards
    Main.prototype.sortCards = function () {
        for (var _i = 0, _a = this.homeCanvas.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            this.canvas.addCard(card.clone());
        }
        if (this.shuffleButton.checked) {
            for (var _b = 0, _c = this.canvas.cards; _b < _c.length; _b++) {
                var card = _c[_b];
                if (card.images.length > 1) {
                    card.selected_image = Math.floor(Math.random() * card.images.length);
                }
                if (!card.movable) {
                    continue;
                }
                var randomCard = this.canvas.cards[Math.floor(Math.random() * this.canvas.cards.length)];
                if (!randomCard.movable) {
                    continue;
                }
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
            else //if category is set
             {
                var categoryCards = this_1.canvas.cards.filter(function (c) { return c.category === card.category; });
                var okCategoryCards = false;
                for (var _b = 0, categoryCards_1 = categoryCards; _b < categoryCards_1.length; _b++) {
                    var c = categoryCards_1[_b];
                    if (this_1.isSamePosition(card, c)) {
                        okCategoryCards = true;
                        break;
                    }
                }
                if (!okCategoryCards) {
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
            alert("Riešenie je správne!");
        }
        else {
            alert("Riešenie je nesprávne.");
        }
    };
    Main.prototype.duplicateCard = function () {
        var duplicate = this.selected.clone();
        duplicate.id = this.generateID();
        duplicate.setCoordinates(this.selected.x + 10, this.selected.y + 10);
        this.canvas.addCard(duplicate);
        if (!duplicate.movable) {
            this.addImmovableCard(duplicate);
        }
        this.redrawAll();
        this.selected = null;
    };
    // adds immovable card to home and final canvas
    Main.prototype.addImmovableCard = function (card) {
        this.homeCanvas.addCard(card.clone());
        var finalDuplicate = card.clone();
        finalDuplicate.home = false;
        this.finalCanvas.addCard(finalDuplicate);
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
            return Math.max.apply(Math, this.canvas.cards.map(function (card) { return card.id; })) + 1;
        }
        return 1;
    };
    Main.prototype.redrawAll = function () {
        this.redraw();
        this.homeCanvas.redraw();
        this.finalCanvas.redraw();
    };
    Main.prototype.getClicked = function (x, y) {
        for (var _i = 0, _a = this.canvas.cards.slice().reverse(); _i < _a.length; _i++) {
            var c = _a[_i];
            if (c.isCLicked(x, y)) {
                return c;
            }
        }
        return null;
    };
    Main.prototype.initSubmitButton = function () {
        var _this = this;
        this.submitButton.addEventListener('click', function () {
            var message = document.getElementById("modal_message");
            var input = _this.imageInput;
            var c;
            var selectedOption = document.querySelector('input[name="txtorImageRadio"]:checked').id;
            if (selectedOption == 'reveal') {
                if (!(input.files && input.files[0])) {
                    message.style.visibility = 'visible';
                    return;
                }
                c = new ImageCard(_this.x, _this.y, _this.generateID());
                var filesArray = [];
                for (var i = 0; i < input.files.length; i++) {
                    filesArray.push(input.files[i]);
                }
                var imageFiles_1 = [];
                filesArray.forEach(function (file) {
                    imageFiles_1.push(file);
                });
                imageFiles_1.forEach(function (file) {
                    var reader = new FileReader();
                    reader.onload = function () {
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
                c.setMovable(false);
            var width = document.getElementById('width');
            var height = document.getElementById('height');
            if (width.value)
                c.width = +width.value;
            if (height.value)
                c.height = +height.value;
            _this.canvas.addCard(c);
            if (!c.movable) {
                _this.addImmovableCard(c);
            }
            message.style.visibility = 'hidden';
            document.getElementById('hiddenSubmit').click();
            _this.redrawAll();
        });
    };
    Main.prototype.initBgSubmitButton = function () {
        var _this = this;
        this.bgSubmitButton.addEventListener('click', function () {
            var image = null;
            var files = _this.bgImageInput.files;
            if (files && files[0]) {
                image = new Image();
                var reader = new FileReader();
                reader.onload = function (e) {
                    image.src = e.target.result;
                };
                reader.readAsDataURL(files[0]);
                _this.bgImageInput.value = null;
            }
            _this.canvas.setBg(image);
            _this.homeCanvas.setBg(image);
            _this.finalCanvas.setBg(image);
            var bgColorSelector = document.getElementById('bg_color');
            _this.canvas.bgColor = bgColorSelector.value;
            _this.homeCanvas.bgColor = bgColorSelector.value;
            _this.finalCanvas.bgColor = bgColorSelector.value;
            _this.redrawAll();
        });
    };
    Main.prototype.initContextMenu = function () {
        var _this = this;
        this.canvas.canvas.addEventListener('contextmenu', function (event) {
            event.preventDefault();
            var contextMenu = document.getElementById('contextMenu');
            if (_this.mode == "run" /* Types.RUN */)
                return;
            var x = event.offsetX;
            var y = event.offsetY;
            var card = _this.getClicked(x, y);
            if (card == null)
                return;
            _this.selected = card;
            // button color
            if (_this.selected.category) {
                document.querySelectorAll('.color-btn').forEach(function (btn) {
                    var button = btn;
                    var matches = button.style.backgroundColor == _this.selected.category;
                    button.classList.toggle('selected-color', matches);
                });
            }
            contextMenu.style.display = 'block';
            contextMenu.style.left = "".concat(event.pageX - 15, "px");
            contextMenu.style.top = "".concat(event.pageY - 15, "px");
            var change_text = document.getElementById('change_text');
            var change_bg_color = document.getElementById('change_bg_color');
            var change_text_button = document.getElementById('change_text_button');
            var change_bg_color_button = document.getElementById('change_bg_color_button');
            if (_this.selected instanceof ImageCard) {
                change_text.style.display = 'none';
                change_bg_color.style.display = 'none';
            }
            else {
                change_text_button.value = _this.selected.text;
                change_text.style.display = 'block';
                change_bg_color_button.value = _this.selected.bg_color;
                change_text.style.display = 'block';
            }
            contextMenu.addEventListener("mouseleave", function () {
                contextMenu.style.display = "none";
                _this.selected = null;
            });
        });
    };
    return Main;
}());
