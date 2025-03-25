class Card {
    x: number
    y: number

    half_size: number = 50

    images = []
    selected_image = 0

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    public clone(): Card {
        let clone = new Card(this.x, this.y);
        clone.half_size = this.half_size
        clone.images = this.images
        clone.selected_image = this.selected_image
        return clone;
    }

    public move(x: number, y: number): void {
        this.x = x
        this.y = y
    }

    public draw(ctx): void {

        if (this.images) {

            let img = this.images[this.selected_image]
            ctx.drawImage(img, this.x, this.y, img.width, img.height)

            // ctx.drawImage(this.images[this.selected_image], this.x, this.y, this.half_size * 2, this.half_size * 2)

        } else {
            ctx.fillStyle = "lightgray";
            // ctx.strokeStyle = "black";
            ctx.rect(this.x - this.half_size, this.y - this.half_size, this.half_size * 2, this.half_size * 2)
            ctx.fill();
            // ctx.stroke();
        }
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