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

        this.canvas.canvas.addEventListener('contextmenu', (event: MouseEvent) => {
            event.preventDefault();
        });

        this.submitButton.addEventListener('click', (event: Event) => {
            const input = this.imageInput

            if (input.files && input.files[0]) {
                let c = new Card(this.x, this.y)

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


                let inputValue = (<HTMLInputElement>document.querySelector('input[name="movableCardRadio"]:checked')).id;
                if (inputValue == 'iCardRadio') c.movable = false; //todo kontanta

                let xsize = document.getElementById('xvalue') as HTMLInputElement;
                let x = '100'
                if (xsize.value) x = xsize.value
                c.half_size = +x / 2
                this.canvas.cards.push(c)
                this.redraw();
            }
        });


        this.bgSubmitButton.addEventListener('click', (event: Event) => {
            let image = new Image();
            const files = this.bgImageInput.files;

            if (files && files[0]) { //todo kontrola if checked text/obrazok
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
    }


    public setMode(mode: Types) {
        this.mode = mode
    }

    private onMouseDown(e) {
        let x = e.offsetX;
        let y = e.offsetY;

        if (this.mode == Types.ADD) {
            this.canvas.addCard(new MovableCard(e.offsetX, e.offsetY));
        }

        if (this.mode == Types.MOVE || this.mode == Types.SOLVE) {
            for (let card of this.canvas.cards) {
                if (card.isCLicked(x, y)) {
                    this.selected = card;
                }
            }
            this.x = e.offsetX;
            this.y = e.offsetY;
            this.redraw();
        }
    }

    private onMouseMove(e) {
        if (this.canvas.cards[0]) {
        }

        let x = e.offsetX - this.canvas.getViewX();
        let y = e.offsetY - this.canvas.getViewY();

        if (this.mode == Types.MOVE) {
            if (this.selected) {
                this.selected.move(x, y);
            }
        }

        if (this.mode == Types.SOLVE) {
            if (this.selected && this.selected.movable) {
                this.selected.move(x, y);
            }
        }

        this.x = e.offsetX;
        this.y = e.offsetY;
        this.redraw();
    }


    private onMouseUp(e) {
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
        this.canvas.redraw();
    }

    clearAll() {
        this.canvas.clear();
        this.homeCanvas.clear();
        this.finalCanvas.clear();
    }


    public checkSolution() {
        let ok = true;
        let cards = this.canvas.cards;
        let final = this.finalCanvas.cards;
        for (let i = 0; i < this.canvas.cards.length; i++) {
            if (Math.abs(cards[i].x - final[i].x) > 20 || Math.abs(cards[i].y - final[i].y) > 20) ok = false;
            if (cards[i].selected_image != final[i].selected_image) ok = false;

            // console.log(Math.abs(cards[i].x - final[i].x))
            // console.log(Math.abs(cards[i].y - final[i].y))
        }

        if (ok) {
            alert("riešenie je správne!")
        } else {
            alert("riešenie je nesprávne")
        }

    }

}


