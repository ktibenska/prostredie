class Canvas {
    public canvas;
    ctx;
    public cards: Card[] = [];

    private image = null;

    private viewX: number = 0;
    private viewY: number = 0;

    constructor(id: string) {
        this.canvas = document.getElementById(id);
        this.canvas.width = document.getElementById('canvas-row').offsetWidth;
        this.canvas.height = document.getElementById('canvas-row').offsetHeight;

        this.ctx = this.canvas.getContext('2d');
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 5;
        this.ctx.lineCap = 'round';
    }

    public addCard(card: Card) {
        this.cards.push(card)
    }

    public bg() {

        this.canvas.width = document.getElementById('canvas-row').offsetWidth;
        this.canvas.height = document.getElementById('canvas-row').offsetHeight;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        function mod(n, m) {
            return ((n % m) + m) % m;
        }

        let w = this.canvas.width;
        let h = this.canvas.height;


        if (this.image) {
            this.ctx.drawImage(this.image, 0, 0, w, h)
            return
        }


        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, w, h);
        this.ctx.lineWidth = 0.3;
        this.ctx.strokeStyle = 'gray';
        this.ctx.fillStyle = 'black';


        for (let i = 0; i < w; i++) {
            this.ctx.lineWidth = 0.3;

            let x = i - this.viewX;

            if (mod(x, 10) != 0) continue;
            if (mod(x, 50) == 0) this.ctx.lineWidth = 1;

            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, h);
            this.ctx.stroke();
        }


        for (let i = 0; i < h; i++) {
            this.ctx.lineWidth = 0.3;

            let y = i - this.viewY;

            if (mod(y, 10) != 0) continue;
            if (mod(y, 50) == 0) this.ctx.lineWidth = 1;

            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(w, i);
            this.ctx.stroke();
        }

        this.ctx.lineWidth = 2;
    }

    public addEventListeners(onMouseDown, onMouseMove, onMouseUp, onMouseEnter, onMouseLeave) {
        this.canvas.addEventListener('mousedown', onMouseDown);
        this.canvas.addEventListener('mousemove', onMouseMove);
        this.canvas.addEventListener('mouseup', onMouseUp);
        this.canvas.addEventListener('mouseenter', onMouseEnter);
        this.canvas.addEventListener('mouseleave', onMouseLeave);
    }

    public getViewX() {
        return this.viewX;
    }

    public getViewY() {
        return this.viewY;
    }

    public redraw(finalCanvas = null) {
        this.bg();

        if (finalCanvas) {
            for (let card of finalCanvas.cards) {
                if (card.isMovable()) {
                    card.drawOutline(this.ctx)
                }
            }
        }
        this.cards.map(o => o.draw(this.ctx));
    }

    public redrawResize() {
        this.cards.map(o => o.drawResize(this.ctx));
    }


    public clear(): void {
        this.image = null;
        this.bg();
        this.cards = [];
    }


    public setBg(image) {
        this.image = image
    }

}

