class Buttons {
    main: Main

    finalStateButton: HTMLElement;
    homeStateButton: HTMLElement;

    runButton: HTMLElement;

    txtRadio: HTMLElement;
    imageInput: HTMLElement;

    closeButton: HTMLElement;
    checkButton: HTMLElement;

    clearSubmitButton: HTMLElement;

    loadInput: HTMLInputElement;
    loadSubmitButton: HTMLElement;
    saveButton: HTMLElement;

    duplicateCardCtxBtn: HTMLElement;
    removeCardCtxBtn: HTMLElement;

    showGridBtn: HTMLInputElement;

    contextMenu: HTMLElement;

    tempCardList = [];

    constructor(main: Main) {
        this.main = main;
        this.initContextMenu();
        this.initButtons();
    }


    private initContextMenu() {
        this.contextMenu = document.getElementById('contextMenu');

        window.addEventListener('click', () => {
            // this.contextMenu.style.display = 'none';
        });

        // hide on escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.contextMenu.style.display = 'none';
                this.main.selected = null
            }
        });


        document.querySelectorAll(".color-btn").forEach(button => {

            button.addEventListener("click", (e) => {
                const color = (e.target as HTMLButtonElement).style.backgroundColor;

                this.main.updateCardCategory(color)

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

        this.homeStateButton = document.getElementById('home_state_button');
        this.homeStateButton.addEventListener('mouseup', () => {
            this.main.homeCanvas.cards = []
            for (let card of this.main.canvas.cards) {
                this.main.homeCanvas.cards.push(card.clone())
            }
            this.main.homeCanvas.redraw();
        });

        this.finalStateButton = document.getElementById('final_state_button');
        this.finalStateButton.addEventListener('mouseup', () => {

            this.main.finalCanvas.cards = []
            for (let card of this.main.canvas.cards) {
                let c = card.clone()
                c.home = false
                this.main.finalCanvas.cards.push(c)
            }
            this.main.finalCanvas.redraw();

        });

        this.clearSubmitButton = document.getElementById('clear_submit_button');
        this.clearSubmitButton.addEventListener('mouseup', () => {
            this.main.clearAll();
        });

        this.runButton = document.getElementById('run_button');
        this.runButton.addEventListener('mouseup', () => {

            this.tempCardList = []
            for (let card of this.main.canvas.cards) {
                this.tempCardList.push(card.clone())
            }

            this.main.runApplication();
            if (this.main.mode == Types.RUN) {
                this.buttonsHidden(true);
            }

        });

        this.txtRadio = document.getElementById('hideBack');
        this.txtRadio.addEventListener('click', () => {
            let message = document.getElementById("modal_message");
            message.style.visibility = 'hidden'
        })

        this.imageInput = document.getElementById('id_image_input') as HTMLInputElement;
        this.imageInput.addEventListener('change', () => {
            let message = document.getElementById("modal_message");
            message.style.visibility = 'hidden'
        })

        this.closeButton = document.getElementById('close_button');
        this.closeButton.hidden = true;
        this.closeButton.addEventListener('mouseup', () => {
            this.buttonsHidden(false);

            this.main.canvas.cards = []
            for (let card of this.tempCardList) {
                this.main.canvas.cards.push(card.clone())
            }

            this.main.mode = Types.MOVE;
            this.main.redraw();
        });

        this.checkButton = document.getElementById('check_answer_button');
        this.checkButton.hidden = true;
        this.checkButton.addEventListener('mouseup', () => {
            this.main.checkSolution();
        });


        this.saveButton = document.getElementById('save_button');
        this.saveButton.addEventListener('mouseup', () => {
            this.main.toJSON();
        });

        this.loadInput = document.getElementById('id_load') as HTMLInputElement;
        this.loadSubmitButton = document.getElementById('load_submit_button') as HTMLInputElement;

        this.loadSubmitButton.addEventListener('mouseup', () => {

            let jsonData;

            let jsonInput = document.getElementById('json_input') as HTMLInputElement;

            const files = jsonInput.files;
            if (files && files[0]) {
                const reader = new FileReader();
                reader.onload = () => {
                    jsonData = JSON.parse(reader.result as string);
                    this.main.fromJSON(jsonData)
                }
                reader.readAsText(files[0]);
            }
        });


        this.duplicateCardCtxBtn = document.getElementById('duplicate_card');
        this.duplicateCardCtxBtn.addEventListener('mouseup', () => {
            this.main.duplicateCard();
            this.contextMenu.style.display = 'none';

        });

        this.removeCardCtxBtn = document.getElementById('remove_card');
        this.removeCardCtxBtn.addEventListener('mouseup', () => {
            this.main.removeCard();
            this.contextMenu.style.display = 'none';

        });


        const changeTextCtxBtn = document.getElementById('change_text_button') as HTMLInputElement;
        changeTextCtxBtn.addEventListener('input', (event) => {
            this.main.updateCardText(changeTextCtxBtn.value)
        });

        const changeBgColorCtxBtn = document.getElementById('change_bg_color_button') as HTMLInputElement;
        changeBgColorCtxBtn.addEventListener('input', (event) => {
            this.main.updateCardBgColor((event.target as HTMLInputElement).value)
        });

        this.showGridBtn = document.getElementById('show_grid') as HTMLInputElement;
        this.showGridBtn.addEventListener('mouseup', () => {
            this.main.gridOn(!this.showGridBtn.checked);
        });
    }


    private buttonsHidden(hidden: boolean) {
        this.closeButton.hidden = !hidden
        this.checkButton.hidden = !hidden

        document.getElementById('left_panel_content').hidden = hidden;
        document.getElementById('right_panel_content').hidden = hidden;
    }


}


