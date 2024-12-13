class Buttons {
    sketchpad: Main

    moveButton;
    addButton;

    finalStateButton;
    homeStateButton;

    constructor(sketchpad: Main) {
        this.sketchpad = sketchpad;
        this.initButtons();
    }

    private initButtons() {


        this.moveButton = document.getElementById('move_button');
        this.moveButton.addEventListener('mouseup', () => {
            this.sketchpad.setMode(Types.MOVE)
        });

        this.addButton = document.getElementById('add_button');
        this.addButton.addEventListener('mouseup', () => {
            this.sketchpad.setMode(Types.ADD)
        });

        this.homeStateButton = document.getElementById('home_state_button');
        this.homeStateButton.addEventListener('mouseup', () => {
            this.sketchpad.homecanvas.cards = this.sketchpad.canvas.cards;
            this.sketchpad.homecanvas.redraw();
        });

        this.finalStateButton = document.getElementById('final_state_button');
        this.finalStateButton.addEventListener('mouseup', () => {
            this.sketchpad.finalcanvas.cards = this.sketchpad.canvas.cards;
            this.sketchpad.finalcanvas.redraw();
        });

        this.moveButton = document.getElementById('new_activity_button');
        this.moveButton.addEventListener('mouseup', () => {
            this.sketchpad.clearAll();
        });
    }

}


