class Main {
    x: number = -10;
    y: number = -10;

    mode: Types;
    canvas: Canvas;
    selected: Card;
    imageInput = document.getElementById('id_email') as HTMLInputElement;
    submitButton = document.getElementById('submit') as HTMLInputElement;

    bgImageInput = document.getElementById('id_bg') as HTMLInputElement;
    bgSubmitButton = document.getElementById('bg_submit') as HTMLInputElement;

    shuffleButton = document.getElementById('shuffle_cards') as HTMLInputElement;

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
        this.redraw();

        this.homeCanvas = new Canvas('home_state_canvas');
        this.finalCanvas = new Canvas('final_state_canvas');

        this.clearAll()

        this.submitButton.addEventListener('click', (event: Event) => {
            const input = this.imageInput
            let c: Card;

            if (input.files && input.files[0]) {

                //todo check aj podla toho ci je zakliknuty checkbox text/obrazok!
                // ked je pridany obrazok a kliknuty text, vykresli sa obrazok aj tak - text naopak

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

            let inputValue = (<HTMLInputElement>document.querySelector('input[name="movableCardRadio"]:checked')).id;
            if (inputValue == 'iCardRadio') c.setMovable(false); //todo kontanta


            let xsize = document.getElementById('xvalue') as HTMLInputElement;
            let ysize = document.getElementById('yvalue') as HTMLInputElement;

            if (xsize.value) c.xsize = +xsize.value;
            if (ysize.value) c.ysize = +ysize.value;
            this.canvas.cards.push(c)
            this.redraw();
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

            this.redraw();
            this.homeCanvas.redraw();
            this.finalCanvas.redraw();
        });


        this.canvas.canvas.addEventListener('contextmenu', (event: MouseEvent) => {
            event.preventDefault();
            const contextMenu = document.getElementById('contextMenu');

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

        if (this.canvas.image != null) {
            data += '\"bg\":' + JSON.stringify(this.canvas.image.src) + ','
        }
        data += '\"shuffle\":' + JSON.stringify(this.shuffleButton.checked) + ','

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

        if (json.bg) {
            let bgimage = new Image()
            bgimage.src = json.bg
            this.canvas.setBg(bgimage)
            this.homeCanvas.setBg(bgimage)
            this.finalCanvas.setBg(bgimage)
        }

        this.shuffleButton.checked = json.shuffle

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
        this.homeCanvas.redraw();
        this.finalCanvas.redraw();
        this.redraw();
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


        if (this.mode == Types.MOVE) {
            if (this.selected) {

                let mx = this.selected.x + (x - this.x);
                let my = this.selected.y + (y - this.y);

                this.selected.setCoordinates(mx, my);
            }
        }


        if (this.mode == Types.RESIZE && this.selected) {
            switch (this.selected.getClickedHandle(x, y)) {
                case Sides.TL:
                    this.selected.xsize += this.selected.x - x;
                    this.selected.ysize += this.selected.y - y;
                    this.selected.x = x;
                    this.selected.y = y;
                    break;
                case Sides.TR:
                    this.selected.xsize = x - this.selected.x;
                    this.selected.ysize += this.selected.y - y;
                    this.selected.y = y;
                    break;
                case Sides.BL:
                    this.selected.xsize += this.selected.x - x;
                    this.selected.x = x;
                    this.selected.ysize = y - this.selected.y;
                    break;
                case Sides.BR:
                    this.selected.xsize = x - this.selected.x;
                    this.selected.ysize = y - this.selected.y;
                    break;
            }
        }


        if (this.mode == Types.RUN) {
            if (this.selected && this.selected.isMovable()) {
                this.selected.setCoordinates(x, y);
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

        if (this.mode == Types.RUN) {
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


    private checkCards(): boolean {
        if (this.homeCanvas.cards.length != this.finalCanvas.cards.length) {
            return false;
        }

        console.log(this.homeCanvas.cards.length)
        console.log(this.finalCanvas.cards.length)

        for (let i = 0; i < this.homeCanvas.cards.length; i++) {
            let homeCard = this.homeCanvas.cards[i]
            if (homeCard.isMovable()) {
                continue;
            }

            if (homeCard.getCoordinates() != this.finalCanvas.cards[i].getCoordinates()) {
                console.log("?")
                console.log(homeCard.isMovable())
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
                let randomCard = this.canvas.cards[Math.floor(Math.random() * this.canvas.cards.length)];
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
        let cards = this.canvas.cards;
        let final = this.finalCanvas.cards;

        for (let card of final) {

            // podla id
            if (card.category == 'white') {

                let idcard = cards.filter(c => c.id === card.id)
                if (!this.isSamePosition(card, idcard[0])) {
                    ok = false;
                    break;
                }

            } else //ma nastavenu kategoriu
            {
                let categorycards = cards.filter(c => c.category === card.category)
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


    public removeCard() {
        let id = this.selected.id;

        this.canvas.cards = this.canvas.cards.filter(item => item.id !== id)
        this.homeCanvas.cards = this.homeCanvas.cards.filter(item => item.id !== id)
        this.finalCanvas.cards = this.finalCanvas.cards.filter(item => item.id !== id)

        this.redraw()
        this.finalCanvas.redraw()
        this.homeCanvas.redraw()

        this.selected = null;
    }


    public updateCardCategory(color: string) {
        this.selected.category = color

        this.finalCanvas.cards.filter(item => item.id === this.selected.id)[0].category = color
        this.homeCanvas.cards.filter(item => item.id === this.selected.id)[0].category = color

        this.selected = null
    }


    private generateID(): number {
        if (this.canvas.cards.length > 0) {
            return this.canvas.cards.slice(-1)[0].id + 1;
        }
        return 1;
    }

}


