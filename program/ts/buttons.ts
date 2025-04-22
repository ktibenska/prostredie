class Buttons {
    sketchpad: Main

    moveButton: HTMLElement;
    addButton: HTMLElement;
    resizeButton: HTMLElement;


    finalStateButton: HTMLElement;
    homeStateButton: HTMLElement;

    runButton: HTMLElement;
    closeButton: HTMLElement;
    checkButton: HTMLElement

    saveButton: HTMLElement;

    loadInput: HTMLInputElement;
    loadSubmitButton: HTMLInputElement;

    removeCardCtxBtn: HTMLElement


    contextMenu: HTMLElement;

    constructor(sketchpad: Main) {
        this.sketchpad = sketchpad;
        this.initContextMenu()
        this.initButtons();
    }


    private initContextMenu() {
        this.contextMenu = document.getElementById('contextMenu');

        window.addEventListener('click', () => {
            this.contextMenu.style.display = 'none';
        });

        // hide on escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.contextMenu.style.display = 'none';
                this.sketchpad.selected = null
            }
        });

        document.querySelectorAll(".color-btn").forEach(button => {

            button.addEventListener("click", (e) => {
                const color = (e.target as HTMLButtonElement).style.backgroundColor;

                this.sketchpad.updateCardCategory(color)

                document.querySelectorAll(".color-btn").forEach(btn => {
                    btn.classList.remove("selected-color");
                });


                const target = e.target as HTMLElement;
                target.classList.add('selected-color');
                this.contextMenu.style.display = "none";

            });

        });

    }

    private initButtons() {

        this.moveButton = document.getElementById('move_button');
        this.moveButton.addEventListener('mouseup', () => {
            this.sketchpad.setMode(Types.MOVE)
            this.sketchpad.redraw()
        });

        this.addButton = document.getElementById('add_button');
        this.addButton.addEventListener('mouseup', () => {
            this.sketchpad.setMode(Types.ADD)
            this.sketchpad.redraw()
        });

        this.resizeButton = document.getElementById('resize_button');
        this.resizeButton.addEventListener('mouseup', () => {
            this.sketchpad.setMode(Types.RESIZE)
            this.sketchpad.redraw()
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
                let c = card.clone()
                c.home = false
                this.sketchpad.finalCanvas.cards.push(c)
            }
            this.sketchpad.finalCanvas.redraw();

        });

        this.moveButton = document.getElementById('new_activity_button');
        this.moveButton.addEventListener('mouseup', () => {
            this.sketchpad.clearAll();
        });

        this.runButton = document.getElementById('run_button');
        this.runButton.addEventListener('mouseup', () => {
            this.sketchpad.runApplication();
            if (this.sketchpad.mode == Types.RUN) {
                this.buttonsHidden(true);
            }

        });


        this.closeButton = document.getElementById('close_button');
        this.closeButton.hidden = true;
        this.closeButton.addEventListener('mouseup', () => {
            this.buttonsHidden(false);

            this.sketchpad.canvas.cards = []
            for (let card of this.sketchpad.homeCanvas.cards) {
                this.sketchpad.canvas.cards.push(card.clone())
            }
            this.sketchpad.mode = Types.MOVE;
            this.sketchpad.redraw();
        });

        this.checkButton = document.getElementById('check_answer_button');
        this.checkButton.hidden = true;
        this.checkButton.addEventListener('mouseup', () => {
            this.sketchpad.checkSolution();
        });


        this.saveButton = document.getElementById('save_button');
        this.saveButton.addEventListener('mouseup', () => {
            this.sketchpad.toJSON();
        });

        this.loadInput = document.getElementById('id_load') as HTMLInputElement;
        this.loadSubmitButton = document.getElementById('load_submit') as HTMLInputElement;

        this.loadSubmitButton.addEventListener('mouseup', () => {

            let jsonData;

            let jsonInput = document.getElementById('json_input') as HTMLInputElement;

            const files = jsonInput.files;
            if (files && files[0]) {
                // if (file[0].type === 'application/json')

                const reader = new FileReader();
                reader.onload = () => {
                    jsonData = JSON.parse(reader.result as string);
                    this.sketchpad.fromJSON(jsonData)
                }
                reader.readAsText(files[0]);
            }
        });

        this.removeCardCtxBtn = document.getElementById('remove_card');
        this.removeCardCtxBtn.addEventListener('mouseup', () => {
            this.sketchpad.removeCard();
        });

    }


    private buttonsHidden(hidden: boolean) {
        this.closeButton.hidden = !hidden
        this.checkButton.hidden = !hidden

        document.getElementById('left_panel_content').hidden = hidden;
        document.getElementById('right_panel_content').hidden = hidden;
    }


}


