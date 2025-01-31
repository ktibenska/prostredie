class Buttons {
    sketchpad: Main

    moveButton;
    addButton;

    finalStateButton;
    homeStateButton;

    runButton;
    closeButton;
    checkButton

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
            this.sketchpad.homecanvas.cards = []
            for (let card of this.sketchpad.canvas.cards) {
                this.sketchpad.homecanvas.cards.push(card.clone())
            }
            this.sketchpad.homecanvas.redraw();
        });

        this.finalStateButton = document.getElementById('final_state_button');
        this.finalStateButton.addEventListener('mouseup', () => {

            this.sketchpad.finalcanvas.cards = []
            for (let card of this.sketchpad.canvas.cards) {
                this.sketchpad.finalcanvas.cards.push(card.clone())
            }
            this.sketchpad.finalcanvas.redraw();

        });

        this.moveButton = document.getElementById('new_activity_button');
        this.moveButton.addEventListener('mouseup', () => {
            this.sketchpad.clearAll();
        });

        this.runButton = document.getElementById('run_button');
        this.runButton.addEventListener('mouseup', () => {
            this.buttonsHidden(true);
            this.sketchpad.canvas.cards = []
            for (let card of this.sketchpad.homecanvas.cards) {
                this.sketchpad.canvas.cards.push(card.clone())
            }
            this.sketchpad.redraw();
            this.sketchpad.mode = Types.MOVE;

            // window.open("excersise.html")
        });


        this.closeButton = document.getElementById('close_button');
        this.closeButton.hidden = true;
        this.closeButton.addEventListener('mouseup', () => {
            this.buttonsHidden(false);

            this.sketchpad.canvas.cards = []
            for (let card of this.sketchpad.homecanvas.cards) {
                this.sketchpad.canvas.cards.push(card.clone())
            }
            this.sketchpad.redraw();
        });

        this.checkButton = document.getElementById('check_answer_button');
        this.checkButton.hidden = true;
        let ok = true;
        this.checkButton.addEventListener('mouseup', () => {
            let cards = this.sketchpad.canvas.cards;
            let final = this.sketchpad.finalcanvas.cards;
            for (let i = 0; i < this.sketchpad.canvas.cards.length; i++) {
                if (Math.abs(cards[i].x - final[i].x) > 10 || Math.abs(cards[i].y - final[i].y) > 10) ok = false;
            }

            if (ok) {
                alert("riešenie je správne!")
            } else {
                alert("riešenie je nesprávne")

            }
        });

    }


    private buttonsHidden(hidden: boolean) {
        this.closeButton.hidden = !hidden
        this.checkButton.hidden = !hidden

        document.getElementById('left_panel_content').hidden = hidden;
        document.getElementById('right_panel_content').hidden = hidden;

    }

}


