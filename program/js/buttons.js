var Buttons = /** @class */ (function () {
    function Buttons(sketchpad) {
        this.sketchpad = sketchpad;
        this.initButtons();
    }
    Buttons.prototype.initButtons = function () {
        var _this = this;
        this.moveButton = document.getElementById('move_button');
        this.moveButton.addEventListener('mouseup', function () {
            _this.sketchpad.setMode("move" /* Types.MOVE */);
        });
        this.addButton = document.getElementById('add_button');
        this.addButton.addEventListener('mouseup', function () {
            _this.sketchpad.setMode("add" /* Types.ADD */);
        });
        this.homeStateButton = document.getElementById('home_state_button');
        this.homeStateButton.addEventListener('mouseup', function () {
            _this.sketchpad.homeCanvas.cards = [];
            for (var _i = 0, _a = _this.sketchpad.canvas.cards; _i < _a.length; _i++) {
                var card = _a[_i];
                _this.sketchpad.homeCanvas.cards.push(card.clone());
            }
            _this.sketchpad.homeCanvas.redraw();
        });
        this.finalStateButton = document.getElementById('final_state_button');
        this.finalStateButton.addEventListener('mouseup', function () {
            _this.sketchpad.finalCanvas.cards = [];
            for (var _i = 0, _a = _this.sketchpad.canvas.cards; _i < _a.length; _i++) {
                var card = _a[_i];
                var c = card.clone();
                c.home = false;
                _this.sketchpad.finalCanvas.cards.push(c);
            }
            _this.sketchpad.finalCanvas.redraw();
        });
        this.moveButton = document.getElementById('new_activity_button');
        this.moveButton.addEventListener('mouseup', function () {
            _this.sketchpad.clearAll();
        });
        this.runButton = document.getElementById('run_button');
        this.runButton.addEventListener('mouseup', function () {
            _this.sketchpad.runApplication();
            if (_this.sketchpad.mode == "run" /* Types.RUN */) {
                _this.buttonsHidden(true);
            }
        });
        this.closeButton = document.getElementById('close_button');
        this.closeButton.hidden = true;
        this.closeButton.addEventListener('mouseup', function () {
            _this.buttonsHidden(false);
            _this.sketchpad.canvas.cards = [];
            for (var _i = 0, _a = _this.sketchpad.homeCanvas.cards; _i < _a.length; _i++) {
                var card = _a[_i];
                _this.sketchpad.canvas.cards.push(card.clone());
            }
            _this.sketchpad.redraw();
            _this.sketchpad.mode = "move" /* Types.MOVE */;
        });
        this.checkButton = document.getElementById('check_answer_button');
        this.checkButton.hidden = true;
        this.checkButton.addEventListener('mouseup', function () {
            _this.sketchpad.checkSolution();
        });
        this.saveButton = document.getElementById('save_button');
        this.saveButton.addEventListener('mouseup', function () {
            _this.sketchpad.toJSON();
        });
        this.loadButton = document.getElementById('load_button');
        this.loadButton.addEventListener('mouseup', function () {
            var jsonData;
            var jsonInput = document.getElementById('json_input');
            var files = jsonInput.files;
            // let xy = [];
            if (files && files[0]) {
                // if (file[0].type === 'application/json')
                var reader_1 = new FileReader();
                reader_1.onload = function () {
                    jsonData = JSON.parse(reader_1.result);
                    console.log(jsonData);
                    _this.sketchpad.fromJSON(jsonData);
                };
                reader_1.readAsText(files[0]);
            }
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
