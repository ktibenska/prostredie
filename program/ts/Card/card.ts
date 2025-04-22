class Card {
    x: number
    y: number

    half_size: number = 50

    movable: boolean = true;

    home = true;
    //todo home t/f nech sa meni podla umiestnenia, pripadne zmenit ze si pamata obe polohy - lahsie ukladanie?

    images = []
    selected_image = 0
    text: string;
    text_color: string;
    bg_color: string;

    category: string = 'white'

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    public clone(): Card {
        return new Card(this.x, this.y);
    }


    public toJSON() {
        return {
            x: this.x,
            y: this.y
        }
    }

    public static fromJSON(json: any): Card {
        return new TextCard(json.x, json.y);
    }


    public getCoordinates(): [number, number] {
        return [this.x, this.y];
    }

    public setCoordinates(x: number, y: number): void {
        this.x = x
        this.y = y
    }

    public isMovable(): boolean {
        return this.movable;
    }

    setMovable(movable: boolean): void {
        this.movable = movable;
    }

    public draw(ctx: any): void {
    }


    public drawOutline(ctx: any): void {
    }

    public isCLicked(x: number, y: number): boolean {
        let clicked = (x >= this.x - this.half_size && x <= this.x + this.half_size) && (y >= this.y - this.half_size && y <= this.y + this.half_size);

        if (clicked && this.images.length > 1) { //todo zmenit pre imagecard
            this.selected_image++;
            this.selected_image %= (this.images.length)

        }
        return clicked;
    }
}