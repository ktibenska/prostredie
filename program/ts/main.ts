class Main {
    x: number = -10;
    y: number = -10;

    mode: Types = Types.MOVE;
    canvas: Canvas;
    selected: Card;
    imageInput = document.getElementById('id_image_input') as HTMLInputElement;
    submitButton = document.getElementById('submit') as HTMLInputElement;

    bgImageInput = document.getElementById('id_bg') as HTMLInputElement;
    bgSubmitButton = document.getElementById('bg_submit') as HTMLInputElement;
    shuffleButton = document.getElementById('shuffle_cards') as HTMLInputElement;
    outlineButton = document.getElementById('outline_cards') as HTMLInputElement;
    gridButton = document.getElementById('show_grid') as HTMLInputElement;

    finalCanvas: Canvas;
    homeCanvas: Canvas;

    constructor() {
        this.canvas = new Canvas('main_canvas');
        this.canvas.addEventListeners(
            e => this.onMouseDown(e),
            e => this.onMouseMove(e),
            e => this.onMouseUp(e),
            e => this.onMouseEnter(e),
            () => this.onMouseLeave()
        );

        this.homeCanvas = new Canvas('home_state_canvas');
        this.finalCanvas = new Canvas('final_state_canvas');

        this.clearAll();

        this.initSubmitButton();
        this.initBgSubmitButton();
        this.initContextMenu();
    }


    public toJSON(): void {
        let data = "{"

        data += '\"bgcolor\":' + JSON.stringify(this.canvas.bgColor) + ','
        if (this.canvas.image != null) {
            data += '\"bg\":' + JSON.stringify(this.canvas.image.src) + ','
        }
        data += '\"shuffle\":' + JSON.stringify(this.shuffleButton.checked) + ','
        data += '\"outline\":' + JSON.stringify(this.outlineButton.checked) + ','
        data += '\"grid\":' + JSON.stringify(this.gridButton.checked) + ','

        let cardDataString = ""
        for (let card of this.homeCanvas.cards) {
            cardDataString += JSON.stringify(card) + ","
        }
        for (let card of this.finalCanvas.cards) {
            cardDataString += JSON.stringify(card) + ","
        }

        const downloadFile = () => {
            const link = document.createElement("a");
            const content = data + '\"cards\":[' + cardDataString.slice(0, -1) + ']}';
            const file = new Blob([content], {type: 'application/json'});
            link.href = URL.createObjectURL(file);
            link.download = "aktivita.json";
            link.click();
            URL.revokeObjectURL(link.href);
        };

        downloadFile();

    }

    public fromJSON(json) {
        this.clearAll();

        this.canvas.bgColor = json.bgcolor;
        this.homeCanvas.bgColor = json.bgcolor;
        this.finalCanvas.bgColor = json.bgcolor;

        if (json.bg) {
            let bgimage = new Image();
            bgimage.src = json.bg;
            this.canvas.setBg(bgimage);
            this.homeCanvas.setBg(bgimage);
            this.finalCanvas.setBg(bgimage);
        }

        this.shuffleButton.checked = json.shuffle;
        this.outlineButton.checked = json.outline;
        this.gridButton.checked = json.grid;
        this.gridOn(json.grid);


        for (let x of json.cards) {
            let card: Card;
            if (x.text) {
                card = TextCard.fromJSON(x);
            } else {
                card = ImageCard.fromJSON(x);
            }

            if (x.home) {
                this.homeCanvas.addCard(card);
            } else {
                this.finalCanvas.addCard(card);
            }
        }


        this.sortCards();
        this.redrawAll();
    }


    private onMouseDown(e): void {
        if (e.button !== 0) return;

        let x = e.offsetX;
        let y = e.offsetY;

        if (this.mode == Types.MOVE || this.mode == Types.RUN) {

            let card = this.getClicked(x, y);

            if (card != null) {
                card = card.clone();
                this.canvas.cards = this.canvas.cards.filter(item => item.id !== card.id);

                this.canvas.addCard(card);
                this.selected = card;

                if (this.selected instanceof ImageCard) {
                    this.selected.nextImage();
                }

                this.x = e.offsetX;
                this.y = e.offsetY;
                this.redraw();
            }
        }

        if (this.mode != Types.RUN) {
            if (this.selected != null) return;


            for (let card of this.canvas.cards) {
                if (card.getClickedHandle(x, y)) {
                    this.selected = card;
                    this.mode = Types.RESIZE;
                    break;
                }
            }
        }

    }


    private onMouseMove(e): void {
        let x = e.offsetX - this.canvas.getViewX();
        let y = e.offsetY - this.canvas.getViewY();
        document.body.style.cursor = "auto";

        if (this.canvas.cards[0]) {
            if (this.getClicked(x, y)) {
                document.body.style.cursor = "pointer";
            }
        }

        if (this.selected) {
            document.body.style.cursor = "grab";
            if (this.mode == Types.RESIZE) {
                let xbefore = this.selected.x;
                let ybefore = this.selected.y;

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

                this.updateCardHF(xbefore, ybefore);
                this.redrawAll();
            }


            if (this.mode == Types.MOVE || (this.mode == Types.RUN && this.selected.isMovable())) {
                let mx = this.selected.x + (x - this.x);
                let my = this.selected.y + (y - this.y);

                this.selected.setCoordinates(mx, my);

                if (!this.selected.movable) {
                    this.homeCanvas.getCardByID(this.selected.id).setCoordinates(mx, my);
                    this.finalCanvas.getCardByID(this.selected.id).setCoordinates(mx, my);

                    this.redrawAll();
                }
            }
        }

        this.x = e.offsetX;
        this.y = e.offsetY;
        this.redraw();
    }


    private onMouseUp(e): void {
        if (e.button !== 0) return;

        if (this.selected != null) {
            let x = this.roundToGrid(this.selected.x);
            let y = this.roundToGrid(this.selected.y);

            this.selected.setCoordinates(x, y);
        }
        this.selected = null;
        this.x = e.offsetX;
        this.y = e.offsetY;
        this.redraw();

        if (this.mode == Types.RESIZE) {
            this.mode = Types.MOVE;
        }
    }

    private onMouseLeave(): void {
        this.redrawAll();
        document.body.style.cursor = "auto";
    }

    private onMouseEnter(e): void {
        this.selected = null

        this.x = e.offsetX;
        this.y = e.offsetY;
        this.redraw();
    }


    public redraw(): void {
        this.canvas.bg();

        if (this.mode == Types.RUN && this.outlineButton.checked) {
            this.canvas.redraw(this.finalCanvas);
        } else {
            this.canvas.redraw();
        }

        if (this.mode != Types.RUN) {
            this.canvas.redrawResize();
        }
    }

    public clearAll(): void {
        this.canvas.clear();
        this.homeCanvas.clear();
        this.finalCanvas.clear();
    }

    private roundToGrid(number: number): number {
        let grid = 10;
        return Math.round(number / grid) * grid;
    }


    // functions for buttons
    public runApplication(): void {
        if (!this.checkCards()) {
            return;
        }

        this.canvas.cards = [];
        this.sortCards();

        this.mode = Types.RUN;
        this.redraw();
    }


    public gridOn(grid: boolean): void {
        this.canvas.grid = grid;
        this.homeCanvas.grid = grid;
        this.finalCanvas.grid = grid;

        this.redrawAll();
    }


    public updateCardCategory(color: string): void {
        this.selected.category = color;
        let homeCard = this.homeCanvas.getCardByID(this.selected.id);
        if (homeCard) {
            homeCard.category = color;
        }

        let finalCard = this.finalCanvas.getCardByID(this.selected.id);
        if (finalCard) {
            finalCard.category = color;
        }

        this.selected = null;
    }

    public updateCardText(text: string): void {
        if (this.selected && this.selected instanceof TextCard) {

            this.selected.text = text;

            this.updateCardHF();
            this.redrawAll();
        }
    }

    public updateCardBgColor(color: string): void {
        if (this.selected && this.selected instanceof TextCard) {

            this.selected.bg_color = color;

            this.updateCardHF();
            this.redrawAll();
        }
    }

    //updates card parameters by id both in home and final state
    private updateCardHF(x: number = null, y: number = null): void {

        for (let c of [this.homeCanvas, this.finalCanvas]) {
            let card = c.getCardByID(this.selected.id);

            if (card) {
                card.text = this.selected.text;
                card.bg_color = this.selected.bg_color;

                if (!card.movable) {
                    card.x = this.selected.x;
                    card.y = this.selected.y;

                    card.width = this.selected.width;
                    card.height = this.selected.height;
                } else {
                    if (x && x != this.selected.x) {
                        card.x += (this.selected.x - x);
                    }
                    card.width = this.selected.width;

                    if (y && y != this.selected.y) {
                        card.y += (this.selected.y - y);
                    }
                    card.height = this.selected.height;

                }
            }

        }
    }


    private checkCards(): boolean {
        if (this.homeCanvas.cards.length != this.finalCanvas.cards.length) {
            window.alert("V domovskom a finálnom stave nie je rovnaký počet kartičiek.");
            return false;
        }

        for (let i = 0; i < this.homeCanvas.cards.length; i++) {
            let homeCard = this.homeCanvas.cards[i];

            let finalcard = this.finalCanvas.getCardByID(homeCard.id);

            if ((homeCard.bg_color != finalcard.bg_color) || (homeCard.text != finalcard.text)) {
                window.alert("Farba alebo text kartičiek sa nezhoduje.");
                return false;
            }

            if ((homeCard.width != finalcard.width) || (homeCard.height != finalcard.height)) {
                window.alert("Rozmery kartičiek sa nezhodujú.");
                return false;
            }

            if (!homeCard.isMovable() && !this.isSamePosition(homeCard, finalcard)) {
                window.alert("Nesprávne položené kartičky.");
                return false;
            }

        }
        return true;
    }

    //moves cards on canvas into home(t) or final(f) state positions
    public moveCardsToState(home: boolean): void {
        let stateCanvas = this.homeCanvas;
        if (!home) {
            stateCanvas = this.finalCanvas;
        }
        for (let c of this.canvas.cards) {
            let card = stateCanvas.getCardByID(c.id);

            if (card != null) {
                c.setCoordinates(card.x, card.y);

                if (card instanceof ImageCard){
                    c.selected_image = card.selected_image;
                }

            }
        }
    }

    // adds cards from home state to canvas, sorts all movable cards
    private sortCards(): void {

        for (let card of this.homeCanvas.cards) {
            this.canvas.addCard(card.clone());
        }

        if (this.shuffleButton.checked) {
            for (let card of this.canvas.cards) {

                if (card.images.length > 1) {
                    card.selected_image = Math.floor(Math.random() * card.images.length);
                }

                if (!card.movable) {
                    continue;
                }
                let randomCard = this.canvas.cards[Math.floor(Math.random() * this.canvas.cards.length)];
                if (!randomCard.movable) {
                    continue;
                }
                let randomCardCoords = randomCard.getCoordinates();
                randomCard.setCoordinates(...card.getCoordinates());
                card.setCoordinates(...randomCardCoords);
            }
        }

    }

    private isSamePosition(card1: Card, card2: Card): boolean {
        return !(Math.abs(card1.x - card2.x) > 5 || Math.abs(card1.y - card2.y) > 5);
    }

    public checkSolution(): void {
        let ok = true;

        for (let card of this.finalCanvas.cards) {

            // podla id
            if (card.category == 'white') {

                let idcard = this.canvas.getCardByID(card.id);
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

            } else //if category is set
            {
                let categoryCards = this.canvas.cards.filter(c => c.category === card.category);
                let okCategoryCards = false;
                for (let c of categoryCards) {
                    if (this.isSamePosition(card, c)) {
                        okCategoryCards = true;
                        break;
                    }
                }

                if (!okCategoryCards) {
                    ok = false;
                    break;
                }
            }
        }

        if (ok) {
            alert("Riešenie je správne!");
        } else {
            alert("Riešenie je nesprávne.");
        }

    }


    public duplicateCard(): void {
        let duplicate = this.selected.clone();
        duplicate.id = this.generateID();
        duplicate.setCoordinates(this.selected.x + 10, this.selected.y + 10);
        this.canvas.addCard(duplicate);
        if (!duplicate.movable) {
            this.addImmovableCard(duplicate);
        }

        this.redrawAll();
        this.selected = null;
    }


    // adds immovable card to home and final canvas
    private addImmovableCard(card: Card): void {
        this.homeCanvas.addCard(card.clone());

        let finalDuplicate = card.clone();
        finalDuplicate.home = false;
        this.finalCanvas.addCard(finalDuplicate);
    }


    public removeCard(): void {
        let id = this.selected.id;

        this.canvas.cards = this.canvas.cards.filter(item => item.id !== id);
        this.homeCanvas.cards = this.homeCanvas.cards.filter(item => item.id !== id);
        this.finalCanvas.cards = this.finalCanvas.cards.filter(item => item.id !== id);

        this.redrawAll();

        this.selected = null;
    }


    private generateID(): number {
        if (this.canvas.cards.length > 0) {
            return Math.max(...this.canvas.cards.map(card => card.id)) + 1;
        }
        return 1;
    }

    private redrawAll(): void {
        this.redraw();
        this.homeCanvas.redraw();
        this.finalCanvas.redraw();
    }


    private getClicked(x: number, y: number): Card {
        for (let c of this.canvas.cards.slice().reverse()) {
            if (c.isCLicked(x, y)) {
                return c;
            }
        }
        return null;
    }

    private startCoordinate(x: boolean) {
        if (x) {
            return this.roundToGrid(this.canvas.canvas.width / 3);
        }
        return this.roundToGrid(this.canvas.canvas.height / 3);
    }


    private initSubmitButton(): void {
        this.submitButton.addEventListener('click', () => {
            const message = document.getElementById("modal_message");
            const input = this.imageInput;
            let c: Card;

            const selectedOption = (<HTMLInputElement>document.querySelector('input[name="txtorImageRadio"]:checked')).id;

            if (selectedOption == 'reveal') {

                if (!(input.files && input.files[0])) {
                    message.style.visibility = 'visible';
                    return;
                }

                c = new ImageCard(this.startCoordinate(true), this.startCoordinate(false), this.generateID());
                const filesArray: File[] = [];
                for (let i = 0; i < input.files.length; i++) {
                    filesArray.push(input.files[i]);
                }

                const imageFiles: File[] = [];
                filesArray.forEach(file => {
                    imageFiles.push(file);
                });

                imageFiles.forEach((file) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        let image = new Image();
                        image.src = reader.result as string;

                        c.images.push(image);
                    };
                    reader.readAsDataURL(file);
                });

            } else {
                c = new TextCard(this.startCoordinate(true), this.startCoordinate(false), this.generateID());
                let text = document.getElementById('text_value') as HTMLInputElement;
                c.text = ' '
                if (text.value) c.text = text.value;

                let textColorSelector = document.getElementById('color_selector_text') as HTMLInputElement
                c.text_color = textColorSelector.value;

                let bgColorSelector = document.getElementById('color_selector_bg') as HTMLInputElement
                c.bg_color = bgColorSelector.value;
            }

            let immovable = (<HTMLInputElement>document.querySelector('input[name="movableCardRadio"]:checked')).id;
            if (immovable == 'iCardRadio') c.setMovable(false);


            let width = document.getElementById('width') as HTMLInputElement;
            let height = document.getElementById('height') as HTMLInputElement;

            if (width.value) c.width = +width.value;
            if (height.value) c.height = +height.value;

            this.canvas.addCard(c);
            if (!c.movable) {
                this.addImmovableCard(c);
            }

            message.style.visibility = 'hidden';
            document.getElementById('hiddenSubmit').click();
            this.redrawAll();
        });
    }

    private initBgSubmitButton(): void {
        this.bgSubmitButton.addEventListener('click', () => {
            let image = null;
            const files = this.bgImageInput.files;

            if (files && files[0]) {
                image = new Image();
                const reader = new FileReader();
                reader.onload = function (e) {
                    image.src = e.target.result as string;
                };
                reader.readAsDataURL(files[0]);

                this.bgImageInput.value = null;
            }

            this.canvas.setBg(image);
            this.homeCanvas.setBg(image);
            this.finalCanvas.setBg(image);

            let bgColorSelector = document.getElementById('bg_color') as HTMLInputElement;
            this.canvas.bgColor = bgColorSelector.value;
            this.homeCanvas.bgColor = bgColorSelector.value;
            this.finalCanvas.bgColor = bgColorSelector.value;


            this.redrawAll();

        });
    }

    private initContextMenu(): void {
        this.canvas.canvas.addEventListener('contextmenu', (event: MouseEvent) => {
            event.preventDefault();
            const contextMenu = document.getElementById('contextMenu');

            if (this.mode == Types.RUN) return;

            let x = event.offsetX;
            let y = event.offsetY;


            let card = this.getClicked(x, y);
            if (card == null) return;

            this.selected = card;

            // button color
            if (this.selected.category) {
                document.querySelectorAll('.color-btn').forEach((btn) => {
                    const button = btn as HTMLButtonElement;
                    const matches = button.style.backgroundColor == this.selected.category;
                    button.classList.toggle('selected-color', matches);
                });
            }

            contextMenu.style.display = 'block';
            contextMenu.style.left = `${event.pageX - 15}px`;
            contextMenu.style.top = `${event.pageY - 15}px`;

            let change_text = document.getElementById('change_text') as HTMLInputElement;
            let change_bg_color = document.getElementById('change_bg_color') as HTMLInputElement;

            let change_text_button = document.getElementById('change_text_button') as HTMLInputElement;
            let change_bg_color_button = document.getElementById('change_bg_color_button') as HTMLInputElement;


            if (this.selected instanceof ImageCard) {
                change_text.style.display = 'none';
                change_bg_color.style.display = 'none';

            } else {
                change_text_button.value = this.selected.text;
                change_text.style.display = 'block';

                change_bg_color_button.value = this.selected.bg_color;
                change_text.style.display = 'block';
            }

            contextMenu.addEventListener("mouseleave", () => {
                contextMenu.style.display = "none";
                this.selected = null;
            });

        });

    }
}


