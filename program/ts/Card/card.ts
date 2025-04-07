class Card {
    x: number
    y: number

    half_size: number = 50

    images = []
    selected_image = 0

    movable: boolean = true;

    text: string;
    text_color: string;
    bg_color: string;

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    public clone(): Card {
        let clone = new Card(this.x, this.y);
        clone.half_size = this.half_size
        clone.images = this.images
        clone.selected_image = this.selected_image
        clone.movable = this.movable;


        clone.text = this.text;
        clone.text_color = this.text_color;
        clone.bg_color = this.bg_color;


        return clone;
    }

    public move(x: number, y: number): void {
        this.x = x
        this.y = y
    }

    public draw(ctx): void {

        if (this.images[0]) {
            let img = this.images[this.selected_image]
            ctx.drawImage(img, this.x, this.y, img.width, img.height)

        } else {
            ctx.fillStyle = this.bg_color;
            ctx.fillRect(this.x - this.half_size, this.y - this.half_size, this.half_size * 2, this.half_size * 2);

            ctx.fillStyle = this.text_color;
            ctx.font = "20px Arial";

            ctx.fillText(this.text, this.x - this.half_size, this.y);
        }
    }


    public drawOutline(ctx): void {
        ctx.fillStyle = "lightgray";
        ctx.strokeStyle = "black";

        let w = this.half_size * 2;
        let h = this.half_size * 2;
        if (this.images[0]) {
            w = this.images[0].width;
            h = this.images[0].height;
        }

        ctx.rect(this.x, this.y, w, h)
        ctx.stroke();
    }

    public isCLicked(x: number, y: number): boolean {
        let clicked = (x >= this.x - this.half_size && x <= this.x + this.half_size) && (y >= this.y - this.half_size && y <= this.y + this.half_size);

        if (clicked && this.images.length > 1) {
            this.selected_image++;
            this.selected_image %= (this.images.length)

        }
        return clicked;
    }
}