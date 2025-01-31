class Card {
    x: number
    y: number

    half_size: number = 50

    image = null

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    public clone(): Card {
        let clone = new Card(this.x, this.y);
        clone.half_size = this.half_size
        clone.image = this.image
        return clone;
    }

    public move(x: number, y: number): void {
        this.x = x
        this.y = y
    }

    public draw(ctx): void {

        if (this.image) {
            ctx.drawImage(this.image, this.x, this.y, this.half_size * 2, this.half_size * 2)

        } else {
            ctx.fillStyle = "lightgray";
            // ctx.strokeStyle = "black";
            ctx.rect(this.x - this.half_size, this.y - this.half_size, this.half_size * 2, this.half_size * 2)
            ctx.fill();
            // ctx.stroke();
        }
    }

    public isCLicked(x: number, y: number): boolean {
        return (x >= this.x - this.half_size && x <= this.x + this.half_size) && (y >= this.y - this.half_size && y <= this.y + this.half_size);

    }
}