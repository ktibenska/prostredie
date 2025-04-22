class TextCard extends Card {

    text: string = "test";
    text_color: string = "#000000";
    bg_color: string = "#ffff00";

    public clone(): TextCard {
        let clone = new TextCard(this.x, this.y);
        clone.half_size = this.half_size
        clone.movable = this.movable
        clone.category = this.category;

        clone.text = this.text;
        clone.text_color = this.text_color;
        clone.bg_color = this.bg_color;
        return clone;
    }

    public toJSON() {
        return {
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
        let card = new TextCard(json.x, json.y);

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
        ctx.fillRect(this.x - this.half_size, this.y - this.half_size, this.half_size * 2, this.half_size * 2);

        ctx.fillStyle = this.text_color;
        ctx.font = "20px Arial";

        ctx.fillText(this.text, this.x - this.half_size, this.y);
    }


    public drawOutline(ctx: any): void {
        ctx.fillStyle = "lightgray";
        ctx.strokeStyle = "black";
        // let w = this.half_size * 2;
        // let h = this.half_size * 2;

        ctx.strokeRect(this.x - this.half_size, this.y - this.half_size, this.half_size * 2, this.half_size * 2)
    }

}