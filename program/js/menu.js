var Menu = /** @class */ (function () {
    function Menu() {
        this.n = 0;
        this.sketchpad = new Main();
        new Buttons(this.sketchpad);
    }
    return Menu;
}());
