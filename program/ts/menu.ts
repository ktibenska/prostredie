class Menu {
    n: number = 0;
    sketchpad: Main;

    constructor() {
        this.sketchpad = new Main();
        new Buttons(this.sketchpad);
    }



}