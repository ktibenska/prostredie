class Card {
    x: number
    y: number

    id: number;

    xsize: number = 100;
    ysize: number = 100;

    handleSize: number = 10;

    movable: boolean = true;

    home = true;
    //todo home t/f nech sa meni podla umiestnenia, pripadne zmenit ze si pamata obe polohy - lahsie ukladanie?

    images = []
    selected_image = 0
    text: string;
    text_color: string;
    bg_color: string;

    category: string = 'white'

    constructor(x: number, y: number, id: number) {
        this.x = x
        this.y = y
        this.id = id
    }

    public clone(): Card {
        return new Card(this.x, this.y, this.id);
    }


    public toJSON() {
        return {
            x: this.x,
            y: this.y
        }
    }

    public static fromJSON(json: any): Card {
        return new TextCard(json.x, json.y, json.id);
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
        return true;
    }

    public drawResize(ctx: any) {
    }

    public getClickedHandle(x: number, y: number): Sides {
        return null;
    }
}