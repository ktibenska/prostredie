class TextCard extends Card {

    text: string = "test";
    text_color: string = "#000000";
    bg_color: string = "#ffff00";

    public clone(): TextCard {
        let clone = new TextCard(this.x, this.y, this.id);

        clone.xsize = this.xsize
        clone.ysize = this.ysize
        clone.movable = this.movable
        clone.category = this.category;

        clone.text = this.text;
        clone.text_color = this.text_color;
        clone.bg_color = this.bg_color;
        return clone;
    }

    public toJSON() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            movable: this.movable,
            home: this.home,
            category: this.category,

            text: this.text,
            text_color: this.text_color,
            bg_color: this.bg_color
        }
    }

    public static fromJSON(json: any): TextCard {
        let card = new TextCard(json.x, json.y, json.id);

        card.movable = json.movable;
        card.home = json.home;
        card.category = json.category;

        card.text = json.text;
        card.text_color = json.text_color;
        card.bg_color = json.bg_color;

        return card;
    }


    public draw(ctx: any): void {
        ctx.fillStyle = this.bg_color;
        ctx.fillRect(this.x, this.y, this.xsize, this.ysize);

        ctx.fillStyle = this.text_color;
        ctx.font = "20px Arial";

        ctx.fillText(this.text, this.x, this.y + this.ysize / 2);
    }

    public drawResize(ctx: any): void {
        this.drawHandle(ctx, this.x, this.y); // TL
        this.drawHandle(ctx, this.x + this.xsize, this.y); // TR
        this.drawHandle(ctx, this.x, this.y + this.ysize); // BL
        this.drawHandle(ctx, this.x + this.xsize, this.y + this.ysize); //BR
    }

    private drawHandle(ctx: any, x: number, y: number): void {
        ctx.fillRect(x - this.handleSize / 2, y - this.handleSize / 2, this.handleSize, this.handleSize);
    }

    public getClickedHandle(x: number, y: number): Sides {
        if (this.isHandleClicked(x, y, this.x, this.y)) return Sides.TL;
        if (this.isHandleClicked(x, y, this.x + this.xsize, this.y)) return Sides.TR;
        if (this.isHandleClicked(x, y, this.x, this.y + this.ysize)) return Sides.BL;
        if (this.isHandleClicked(x, y, this.x + this.xsize, this.y + this.ysize)) return Sides.BR;
        return null;
    }

    private isHandleClicked(mx: number, my: number, x: number, y: number): boolean {
        let handleBorder = 5;
        return (
            (mx >= x - handleBorder - this.handleSize / 2) && (mx <= x + handleBorder + this.handleSize / 2) &&
            (my >= y - handleBorder - this.handleSize / 2) && (my <= y + handleBorder + this.handleSize / 2)
        );
    }


    public drawOutline(ctx: any): void {
        ctx.fillStyle = "lightgray";
        ctx.strokeStyle = "black";

        ctx.strokeRect(this.x, this.y, this.xsize, this.ysize)
    }


    public isCLicked(x: number, y: number): boolean {
        return (x >= this.x && x <= this.x + this.xsize) && (y >= this.y && y <= this.y + this.ysize)
    }


}