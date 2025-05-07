var Buttons = /** @class */ (function () {
    function Buttons(main) {
        this.tempCardList = [];
        this.main = main;
        this.initContextMenu();
        this.initButtons();
    }
    Buttons.prototype.initContextMenu = function () {
        var _this = this;
        this.contextMenu = document.getElementById('contextMenu');
        window.addEventListener('click', function () {
            // this.contextMenu.style.display = 'none';
        });
        // hide on escape key
        window.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                _this.contextMenu.style.display = 'none';
                _this.main.selected = null;
            }
        });
        document.querySelectorAll(".color-btn").forEach(function (button) {
            button.addEventListener("click", function (e) {
                var color = e.target.style.backgroundColor;
                _this.main.updateCardCategory(color);
                document.querySelectorAll(".color-btn").forEach(function (btn) {
                    btn.classList.remove("selected-color");
                });
                var target = e.target;
                target.classList.add('selected-color');
                _this.contextMenu.style.display = "none";
            });
        });
    };
    Buttons.prototype.initButtons = function () {
        var _this = this;
        this.homeStateButton = document.getElementById('home_state_button');
        this.homeStateButton.addEventListener('mouseup', function () {
            _this.main.homeCanvas.cards = [];
            for (var _i = 0, _a = _this.main.canvas.cards; _i < _a.length; _i++) {
                var card = _a[_i];
                _this.main.homeCanvas.cards.push(card.clone());
            }
            _this.main.homeCanvas.redraw();
        });
        this.finalStateButton = document.getElementById('final_state_button');
        this.finalStateButton.addEventListener('mouseup', function () {
            _this.main.finalCanvas.cards = [];
            for (var _i = 0, _a = _this.main.canvas.cards; _i < _a.length; _i++) {
                var card = _a[_i];
                var c = card.clone();
                c.home = false;
                _this.main.finalCanvas.cards.push(c);
            }
            _this.main.finalCanvas.redraw();
        });
        this.clearSubmitButton = document.getElementById('clear_submit_button');
        this.clearSubmitButton.addEventListener('mouseup', function () {
            _this.main.clearAll();
        });
        this.runButton = document.getElementById('run_button');
        this.runButton.addEventListener('mouseup', function () {
            _this.tempCardList = [];
            for (var _i = 0, _a = _this.main.canvas.cards; _i < _a.length; _i++) {
                var card = _a[_i];
                _this.tempCardList.push(card.clone());
            }
            _this.main.runApplication();
            if (_this.main.mode == "run" /* Types.RUN */) {
                _this.buttonsHidden(true);
            }
        });
        this.txtRadio = document.getElementById('hideBack');
        this.txtRadio.addEventListener('click', function () {
            var message = document.getElementById("modal_message");
            message.style.visibility = 'hidden';
        });
        this.imageInput = document.getElementById('id_image_input');
        this.imageInput.addEventListener('change', function () {
            var message = document.getElementById("modal_message");
            message.style.visibility = 'hidden';
        });
        this.closeButton = document.getElementById('close_button');
        this.closeButton.hidden = true;
        this.closeButton.addEventListener('mouseup', function () {
            _this.buttonsHidden(false);
            _this.main.canvas.cards = [];
            for (var _i = 0, _a = _this.tempCardList; _i < _a.length; _i++) {
                var card = _a[_i];
                _this.main.canvas.cards.push(card.clone());
            }
            _this.main.mode = "move" /* Types.MOVE */;
            _this.main.redraw();
        });
        this.checkButton = document.getElementById('check_answer_button');
        this.checkButton.hidden = true;
        this.checkButton.addEventListener('mouseup', function () {
            _this.main.checkSolution();
        });
        this.saveButton = document.getElementById('save_button');
        this.saveButton.addEventListener('mouseup', function () {
            _this.main.toJSON();
        });
        this.loadInput = document.getElementById('id_load');
        this.loadSubmitButton = document.getElementById('load_submit_button');
        this.loadSubmitButton.addEventListener('mouseup', function () {
            var jsonData;
            var jsonInput = document.getElementById('json_input');
            var files = jsonInput.files;
            if (files && files[0]) {
                var reader_1 = new FileReader();
                reader_1.onload = function () {
                    jsonData = JSON.parse(reader_1.result);
                    _this.main.fromJSON(jsonData);
                };
                reader_1.readAsText(files[0]);
            }
        });
        this.duplicateCardCtxBtn = document.getElementById('duplicate_card');
        this.duplicateCardCtxBtn.addEventListener('mouseup', function () {
            _this.main.duplicateCard();
            _this.contextMenu.style.display = 'none';
        });
        this.removeCardCtxBtn = document.getElementById('remove_card');
        this.removeCardCtxBtn.addEventListener('mouseup', function () {
            _this.main.removeCard();
            _this.contextMenu.style.display = 'none';
        });
        var changeTextCtxBtn = document.getElementById('change_text_button');
        changeTextCtxBtn.addEventListener('input', function (event) {
            _this.main.updateCardText(changeTextCtxBtn.value);
        });
        var changeBgColorCtxBtn = document.getElementById('change_bg_color_button');
        changeBgColorCtxBtn.addEventListener('input', function (event) {
            _this.main.updateCardBgColor(event.target.value);
        });
        this.showGridBtn = document.getElementById('show_grid');
        this.showGridBtn.addEventListener('mouseup', function () {
            _this.main.gridOn(!_this.showGridBtn.checked);
        });
    };
    Buttons.prototype.buttonsHidden = function (hidden) {
        this.closeButton.hidden = !hidden;
        this.checkButton.hidden = !hidden;
        document.getElementById('left_panel_content').hidden = hidden;
        document.getElementById('right_panel_content').hidden = hidden;
    };
    return Buttons;
}());
