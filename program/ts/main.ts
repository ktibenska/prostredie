class Main {
    x: number = -10;
    y: number = -10;

    mode: Types;
    canvas: Canvas;
    selected: Card;
    imageInput = document.getElementById('id_email') as HTMLInputElement;
    submitButton = document.getElementById('submit') as HTMLInputElement;

    finalcanvas: Canvas;
    homecanvas: Canvas;


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

        this.homecanvas = new Canvas('home_state_canvas');
        this.finalcanvas = new Canvas('final_state_canvas');

        this.clearAll()

        this.canvas.canvas.addEventListener('contextmenu', (event: MouseEvent) => {
            event.preventDefault();
        });

        this.submitButton.addEventListener('click', (event: Event) => {
            let image = new Image();
            const files = this.imageInput.files;

            let c = new Card(this.x, this.y)
            if (files && files[0]) { //todo kontrola if checked text/obrazok
                const reader = new FileReader();
                reader.onload = function (e) {
                    image.src = e.target.result as string;
                };
                reader.readAsDataURL(files[0]);

                c.image = image
                this.canvas.cards.push(c)
            }

            let xsize = document.getElementById('xvalue') as HTMLInputElement;
            let x = '100'
            if (xsize.value) x = xsize.value
            c.half_size = +x / 2
            this.canvas.cards.push(c)
            this.redraw();

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

        if (this.mode == Types.MOVE) {
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
        this.homecanvas.clear();
        this.finalcanvas.clear();
    }

}


