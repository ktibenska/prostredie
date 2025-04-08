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
        return new Card(this.x, this.y);
    }

    public move(x: number, y: number): void {
        this.x = x
        this.y = y
    }

    public draw(ctx): void {
    }


    public drawOutline(ctx): void {
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