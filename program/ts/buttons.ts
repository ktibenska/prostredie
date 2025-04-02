class Buttons {
    sketchpad: Main

    moveButton: HTMLElement;
    addButton: HTMLElement;

    finalStateButton: HTMLElement;
    homeStateButton: HTMLElement;

    runButton: HTMLElement;
    closeButton: HTMLElement;
    checkButton: HTMLElement

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
            this.sketchpad.homeCanvas.cards = []
            for (let card of this.sketchpad.canvas.cards) {
                this.sketchpad.homeCanvas.cards.push(card.clone())
            }
            this.sketchpad.homeCanvas.redraw();
        });

        this.finalStateButton = document.getElementById('final_state_button');
        this.finalStateButton.addEventListener('mouseup', () => {

            this.sketchpad.finalCanvas.cards = []
            for (let card of this.sketchpad.canvas.cards) {
                this.sketchpad.finalCanvas.cards.push(card.clone())
            }
            this.sketchpad.finalCanvas.redraw();

        });

        this.moveButton = document.getElementById('new_activity_button');
        this.moveButton.addEventListener('mouseup', () => {
            this.sketchpad.clearAll();
        });

        this.runButton = document.getElementById('run_button');
        this.runButton.addEventListener('mouseup', () => {
            this.buttonsHidden(true);
            this.sketchpad.canvas.cards = []
            for (let card of this.sketchpad.homeCanvas.cards) {
                this.sketchpad.canvas.cards.push(card.clone())
            }
            this.sketchpad.redraw();
            this.sketchpad.mode = Types.SOLVE;
        });


        this.closeButton = document.getElementById('close_button');
        this.closeButton.hidden = true;
        this.closeButton.addEventListener('mouseup', () => {
            this.buttonsHidden(false);

            this.sketchpad.canvas.cards = []
            for (let card of this.sketchpad.homeCanvas.cards) {
                this.sketchpad.canvas.cards.push(card.clone())
            }
            this.sketchpad.redraw();
            this.sketchpad.mode = Types.MOVE;
        });

        this.checkButton = document.getElementById('check_answer_button');
        this.checkButton.hidden = true;
        this.checkButton.addEventListener('mouseup', () => {
            this.sketchpad.checkSolution()
        });

    }


    private buttonsHidden(hidden: boolean) {
        this.closeButton.hidden = !hidden
        this.checkButton.hidden = !hidden

        document.getElementById('left_panel_content').hidden = hidden;
        document.getElementById('right_panel_content').hidden = hidden;
    }

}


