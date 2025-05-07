var Menu = /** @class */ (function () {
    function Menu() {
        this.main = new Main();
        new Buttons(this.main);
    }
    return Menu;
}());
