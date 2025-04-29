class Main {
    x: number = -10;
    y: number = -10;

    mode: Types;
    canvas: Canvas;
    selected: Card;
    imageInput = document.getElementById('id_image_input') as HTMLInputElement;
    submitButton = document.getElementById('submit') as HTMLInputElement;

    bgImageInput = document.getElementById('id_bg') as HTMLInputElement;
    bgSubmitButton = document.getElementById('bg_submit') as HTMLInputElement;
    shuffleButton = document.getElementById('shuffle_cards') as HTMLInputElement;
    outlineButton = document.getElementById('outline_cards') as HTMLInputElement;

    finalCanvas: Canvas;
    homeCanvas: Canvas;

    constructor() {
        this.canvas = new Canvas('sketchpad_main')
        this.mode = Types.MOVE;
        this.canvas.addEventListeners(
            e => this.onMouseDown(e),
            e => this.onMouseMove(e),
            e => this.onMouseUp(e),
            e => this.onMouseEnter(e),
            e => this.onMouseLeave(e)
        );

        this.homeCanvas = new Canvas('home_state_canvas');
        this.finalCanvas = new Canvas('final_state_canvas');

        this.clearAll()

        this.submitButton.addEventListener('click', (event: Event) => {
            const message = document.getElementById("modal_message");
            const input = this.imageInput
            let c: Card;

            const selectedOption = (<HTMLInputElement>document.querySelector('input[name="txtorImageRadio"]:checked')).id;

            if (selectedOption == 'reveal') {

                if (!(input.files && input.files[0])) {
                    message.style.visibility = 'visible'
                    return;
                }

                c = new ImageCard(this.x, this.y, this.generateID())
                const filesArray: File[] = [];
                for (let i = 0; i < input.files.length; i++) {
                    filesArray.push(input.files[i]);
                }

                const imageFiles: File[] = [];
                filesArray.forEach(file => {
                    imageFiles.push(file);
                });

                console.log(imageFiles);

                imageFiles.forEach((file, index) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        // console.log(`Image ${index + 1}:`, reader.result);

                        let image = new Image();
                        image.src = reader.result as string;

                        c.images.push(image)
                    };
                    reader.readAsDataURL(file);
                });

            } else {
                c = new TextCard(this.x, this.y, this.generateID())
                let text = document.getElementById('text_value') as HTMLInputElement
                c.text = ' '
                if (text.value) c.text = text.value

                let textColorSelector = document.getElementById('color_selector_text') as HTMLInputElement
                c.text_color = textColorSelector.value;

                let bgColorSelector = document.getElementById('color_selector_bg') as HTMLInputElement
                c.bg_color = bgColorSelector.value;
            }

            let immovable = (<HTMLInputElement>document.querySelector('input[name="movableCardRadio"]:checked')).id;
            if (immovable == 'iCardRadio') c.setMovable(false); //todo kontrola


            let width = document.getElementById('width') as HTMLInputElement;
            let height = document.getElementById('height') as HTMLInputElement;

            if (width.value) c.width = +width.value;
            if (height.value) c.height = +height.value;

            this.canvas.cards.push(c)
            if (!c.movable) {
                this.addImmovableCard(c)
            }

            message.style.visibility = 'hidden'
            document.getElementById('hiddenSubmit').click();
            this.redrawAll();
        });


        this.bgSubmitButton.addEventListener('click', (event: Event) => {
            let image = new Image();
            const files = this.bgImageInput.files;

            if (files && files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    image.src = e.target.result as string;
                };
                reader.readAsDataURL(files[0]);

                this.canvas.setBg(image)
                this.homeCanvas.setBg(image)
                this.finalCanvas.setBg(image)
            }


            let bgColorSelector = document.getElementById('bg_color') as HTMLInputElement
            this.canvas.bgColor = bgColorSelector.value;
            this.homeCanvas.bgColor = bgColorSelector.value;
            this.finalCanvas.bgColor = bgColorSelector.value;


            this.redrawAll();

        });


        this.canvas.canvas.addEventListener('contextmenu', (event: MouseEvent) => {
            event.preventDefault();
            const contextMenu = document.getElementById('contextMenu');


            if (this.mode == Types.RUN) return;

            let x = event.offsetX;
            let y = event.offsetY;

            for (let card of this.canvas.cards) {
                if (card.isCLicked(x, y)) {
                    this.selected = card;

                    // button color
                    if (this.selected.category) {
                        document.querySelectorAll('.color-btn').forEach((btn) => {
                            const button = btn as HTMLButtonElement;
                            const matches = button.style.backgroundColor === this.selected.category
                            button.classList.toggle('selected-color', matches);
                        });
                    }

                    contextMenu.style.display = 'block';
                    contextMenu.style.left = `${event.pageX - 15}px`;
                    contextMenu.style.top = `${event.pageY - 15}px`;
                }
            }

            contextMenu.addEventListener("mouseleave", () => {
                contextMenu.style.display = "none";
                this.selected = null;
            });

        });


    }


    public toJSON() {
        let data = "{"

        data += '\"bgcolor\":' + JSON.stringify(this.canvas.bgColor) + ','
        if (this.canvas.image != null) {
            data += '\"bg\":' + JSON.stringify(this.canvas.image.src) + ','
        }
        data += '\"shuffle\":' + JSON.stringify(this.shuffleButton.checked) + ','
        data += '\"outline\":' + JSON.stringify(this.outlineButton.checked) + ','

        let cardDataString = ""
        for (let card of this.homeCanvas.cards) {
            cardDataString += JSON.stringify(card) + ","
        }
        for (let card of this.finalCanvas.cards) {
            cardDataString += JSON.stringify(card) + ","
        }

        const downloadFile = () => { //todo
            const link = document.createElement("a");
            const content = data + '\"cards\":[' + cardDataString.slice(0, -1) + ']}';
            const file = new Blob([content], {type: 'application/json'});
            link.href = URL.createObjectURL(file);
            link.download = "test.json";
            link.click();
            URL.revokeObjectURL(link.href);
        };

        downloadFile()

    }

    public fromJSON(json) {
        this.clearAll();

        this.canvas.bgColor = json.bgcolor
        this.homeCanvas.bgColor = json.bgcolor
        this.finalCanvas.bgColor = json.bgcolor

        if (json.bg) {
            let bgimage = new Image()
            bgimage.src = json.bg
            this.canvas.setBg(bgimage)
            this.homeCanvas.setBg(bgimage)
            this.finalCanvas.setBg(bgimage)
        }

        this.shuffleButton.checked = json.shuffle
        this.outlineButton.checked = json.outline


        for (let x of json.cards) {
            let card: Card;
            if (x.text) {
                card = TextCard.fromJSON(x)
            } else {
                card = ImageCard.fromJSON(x)
            }

            if (x.home) {
                this.homeCanvas.cards.push(card)
            } else {
                this.finalCanvas.cards.push(card)
            }
        }


        this.sortCards();
        this.redrawAll()
    }


    public setMode(mode: Types) {
        this.mode = mode
    }

    private onMouseDown(e) {
        if (e.button !== 0) return;


        let x = e.offsetX;
        let y = e.offsetY;

        if (this.mode == Types.ADD) {
            this.canvas.addCard(new TextCard(e.offsetX - 50, e.offsetY - 50, this.generateID())); //?
        }

        if (this.mode == Types.MOVE || this.mode == Types.RUN) {
            for (let card of this.canvas.cards) {
                if (card.isCLicked(x, y)) {
                    this.selected = card;
                }
            }
            this.x = e.offsetX;
            this.y = e.offsetY;
            this.redraw();
        }


        if (this.mode == Types.RESIZE) {
            for (let card of this.canvas.cards) {
                if (card.getClickedHandle(x, y)) {
                    this.selected = card;
                    break;
                }
            }
        }

    }

    private onMouseMove(e) {
        if (this.canvas.cards[0]) { // todo ?
        }

        let x = e.offsetX - this.canvas.getViewX();
        let y = e.offsetY - this.canvas.getViewY();


        if (this.mode == Types.RESIZE && this.selected) {
            switch (this.selected.getClickedHandle(x, y)) {
                case Sides.TL:
                    this.selected.width += this.selected.x - x;
                    this.selected.height += this.selected.y - y;
                    this.selected.x = x;
                    this.selected.y = y;
                    break;
                case Sides.TR:
                    this.selected.width = x - this.selected.x;
                    this.selected.height += this.selected.y - y;
                    this.selected.y = y;
                    break;
                case Sides.BL:
                    this.selected.width += this.selected.x - x;
                    this.selected.x = x;
                    this.selected.height = y - this.selected.y;
                    break;
                case Sides.BR:
                    this.selected.width = x - this.selected.x;
                    this.selected.height = y - this.selected.y;
                    break;
            }
        }

        if (this.selected) {
            if (this.mode == Types.MOVE || (this.mode == Types.RUN && this.selected.isMovable())) {
                let mx = this.selected.x + (x - this.x);
                let my = this.selected.y + (y - this.y);

                this.selected.setCoordinates(mx, my);

                if (!this.selected.movable) {
                    this.homeCanvas.getCardByID(this.selected.id).setCoordinates(mx, my)
                    this.finalCanvas.getCardByID(this.selected.id).setCoordinates(mx, my)

                    this.redrawAll();
                }
            }
        }

        this.x = e.offsetX;
        this.y = e.offsetY;
        this.redraw();
    }


    private onMouseUp(e) {
        if (e.button !== 0) return;

        if (this.selected != null) {
            this.selected.x -= (this.selected.x %= 10)
            this.selected.y -= (this.selected.y %= 10)
        }
        this.selected = null

        this.x = e.offsetX;
        this.y = e.offsetY;
        this.redraw();
    }

    private onMouseLeave(e) {
        this.redraw();
    }

    private onMouseEnter(e) {
        this.x = e.offsetX;
        this.y = e.offsetY;
        this.redraw();
    }


    public redraw() {
        this.canvas.bg();

        if (this.mode == Types.RUN && this.outlineButton.checked) {
            this.canvas.redraw(this.finalCanvas)
        } else {
            this.canvas.redraw()
        }

        if (this.mode == Types.RESIZE) {
            this.canvas.redrawResize()
        }

    }

    clearAll() {
        this.canvas.clear();
        this.homeCanvas.clear();
        this.finalCanvas.clear();
    }

    // funkcie pri tlacidlach

    public runApplication() {
        if (!this.checkCards()) {
            window.alert("nesprávne položené kartičky"); //todo change message
            return;
        }

        this.canvas.cards = [];
        this.sortCards();

        this.mode = Types.RUN;
        this.redraw();
    }


    public gridOn(grid: boolean) {
        this.canvas.grid = grid
        this.homeCanvas.grid = grid
        this.finalCanvas.grid = grid

        this.redrawAll()
    }


    public updateCardCategory(color: string): void {
        this.selected.category = color
        let homeCard = this.homeCanvas.getCardByID(this.selected.id)
        if (homeCard) homeCard.category = color

        let finalCard = this.finalCanvas.getCardByID(this.selected.id)
        if (finalCard) finalCard.category = color

        this.selected = null
    }


    //


    private checkCards(): boolean {
        if (this.homeCanvas.cards.length != this.finalCanvas.cards.length) {
            return false;
        }

        // console.log(this.homeCanvas.cards.length)
        // console.log(this.finalCanvas.cards.length)

        for (let i = 0; i < this.homeCanvas.cards.length; i++) {
            let homeCard = this.homeCanvas.cards[i]
            if (homeCard.isMovable()) {
                continue;
            }

            let finalcard = this.finalCanvas.getCardByID(homeCard.id)

            if (!this.isSamePosition(homeCard, finalcard)) {
                return false;
            }
        }

        return true;
    }

    //adds cards from homestate to canvas, sorts all movable cards
    private sortCards() {

        for (let card of this.homeCanvas.cards) {
            this.canvas.cards.push(card.clone())
        }

        if (this.shuffleButton.checked) {
            for (let card of this.canvas.cards) {
                if (!card.movable) {
                    continue;
                }
                let randomCard = this.canvas.cards[Math.floor(Math.random() * this.canvas.cards.length)];
                if (!randomCard.movable) continue
                let randomCardCoords = randomCard.getCoordinates();
                randomCard.setCoordinates(...card.getCoordinates())
                card.setCoordinates(...randomCardCoords)
            }
        }

    }

    private isSamePosition(card1: Card, card2: Card): boolean {
        return !(Math.abs(card1.x - card2.x) > 20 || Math.abs(card1.y - card2.y) > 20);
    }

    public checkSolution() {
        let ok = true;

        for (let card of this.finalCanvas.cards) {

            // podla id
            if (card.category == 'white') {

                let idcard = this.canvas.getCardByID(card.id)
                if (!this.isSamePosition(card, idcard)) {
                    ok = false;
                    break;
                }

                if (card.images.length > 1) {
                    if (card.selected_image != idcard.selected_image) {
                        ok = false;
                        break;
                    }
                }

            } else //ma nastavenu kategoriu
            {
                let categorycards = this.canvas.cards.filter(c => c.category === card.category)
                let okCategorycards = false
                for (let c of categorycards) {
                    if (this.isSamePosition(card, c)) {
                        okCategorycards = true;
                        break;
                    }
                }

                if (!okCategorycards) {
                    ok = false;
                    break;
                }
            }
        }

        if (ok) {
            alert("riešenie je správne!")
        } else {
            alert("riešenie je nesprávne")
        }

    }


    public duplicateCard() {
        let duplicate = this.selected.clone()
        duplicate.id = this.generateID()

        this.canvas.cards.push(duplicate)
        if (!duplicate.movable) {
            this.addImmovableCard(duplicate)
        }

        this.redrawAll();
        this.selected = null;
    }


    // adds immovable card to home and final canvas
    private addImmovableCard(card: Card): void {
        this.homeCanvas.cards.push(card.clone())

        let finalDuplicate = card.clone()
        finalDuplicate.home = false
        this.finalCanvas.cards.push(finalDuplicate)
    }


    public removeCard() {
        let id = this.selected.id;

        this.canvas.cards = this.canvas.cards.filter(item => item.id !== id)
        this.homeCanvas.cards = this.homeCanvas.cards.filter(item => item.id !== id)
        this.finalCanvas.cards = this.finalCanvas.cards.filter(item => item.id !== id)

        this.redrawAll();

        this.selected = null;
    }


    private generateID(): number {
        if (this.canvas.cards.length > 0) {
            return this.canvas.cards.slice(-1)[0].id + 1;
        }
        return 1;
    }

    private redrawAll() {
        this.redraw();
        this.homeCanvas.redraw();
        this.finalCanvas.redraw();
    }


}


