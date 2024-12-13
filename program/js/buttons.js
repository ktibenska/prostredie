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
            _this.sketchpad.homecanvas.cards = _this.sketchpad.canvas.cards;
            _this.sketchpad.homecanvas.redraw();
        });
        this.finalStateButton = document.getElementById('final_state_button');
        this.finalStateButton.addEventListener('mouseup', function () {
            _this.sketchpad.finalcanvas.cards = _this.sketchpad.canvas.cards;
            _this.sketchpad.finalcanvas.redraw();
        });
        this.moveButton = document.getElementById('new_activity_button');
        this.moveButton.addEventListener('mouseup', function () {
            _this.sketchpad.clearAll();
        });
    };
    return Buttons;
}());
