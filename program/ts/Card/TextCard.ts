class TextCard extends Card {

    text: string = "test";
    text_color: string = "#000000";
    bg_color: string = "#8ea2ec";

    public clone(): TextCard {
        let clone = new TextCard(this.x, this.y, this.id);

        clone.width = this.width
        clone.height = this.height
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
            bg_color: this.bg_color,

            width: this.width,
            height: this.height
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
        card.width = json.width;
        card.height = json.height;

        return card;
    }


    public draw(ctx: any): void {
        ctx.fillStyle = this.bg_color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = this.text_color;

        ctx.font = "24px Arial";

        const padding = 5

        const maxFontSize = 24
        const minFontSize = 10

        let fontSize = maxFontSize;
        let textWidth = ctx.measureText(this.text).width;

        while (textWidth > Math.abs(this.width - 2 * padding) && fontSize > minFontSize) {
            fontSize--;
            ctx.font = fontSize + 'px Arial';
            textWidth = Math.abs(ctx.measureText(this.text).width);
        }

        ctx.font = fontSize + 'px Arial';

        const x = this.x + this.width / 2;
        const y = this.y + this.height / 2;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle"
        ctx.fillText(this.text, x, y);
    }

    public drawResize(ctx: any): void {
        this.drawHandle(ctx, this.x, this.y); // TL
        this.drawHandle(ctx, this.x + this.width, this.y); // TR
        this.drawHandle(ctx, this.x, this.y + this.height); // BL
        this.drawHandle(ctx, this.x + this.width, this.y + this.height); //BR
    }

    private drawHandle(ctx: any, x: number, y: number): void {
        ctx.fillStyle = "#000"
        ctx.fillRect(x - this.handleSize / 2, y - this.handleSize / 2, this.handleSize, this.handleSize);
    }

    public getClickedHandle(x: number, y: number): Sides {
        if (this.isHandleClicked(x, y, this.x, this.y)) return Sides.TL;
        if (this.isHandleClicked(x, y, this.x + this.width, this.y)) return Sides.TR;
        if (this.isHandleClicked(x, y, this.x, this.y + this.height)) return Sides.BL;
        if (this.isHandleClicked(x, y, this.x + this.width, this.y + this.height)) return Sides.BR;
        return null;
    }

    private isHandleClicked(mx: number, my: number, x: number, y: number): boolean {
        let handleBorder = 10;
        return (
            (mx >= x - handleBorder - this.handleSize / 2) && (mx <= x + handleBorder + this.handleSize / 2) &&
            (my >= y - handleBorder - this.handleSize / 2) && (my <= y + handleBorder + this.handleSize / 2)
        );
    }


    public drawOutline(ctx: any): void {
        ctx.fillStyle = "lightgray";
        ctx.strokeStyle = "black";

        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }


    public isCLicked(x: number, y: number): boolean {
        return (x >= this.x && x <= this.x + this.width) && (y >= this.y && y <= this.y + this.height)
    }


}