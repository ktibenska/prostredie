class TextCard extends Card {

    text: string = "test";
    text_color: string = "#000000";
    bg_color: string = "#ffff00";

    public clone(): TextCard {
        let clone = new TextCard(this.x, this.y);
        clone.half_size = this.half_size
        // clone.setMovable(this.isMovable); //robi problem pri json?
        clone.movable = this.movable
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
            text: this.text,
            text_color: this.text_color,
            bg_color: this.bg_color
        }
    }

    public static fromJSON(json: any): TextCard {
        console.log(json.movable)

        let card = new TextCard(json.x, json.y);
        console.log(card.movable)

        card.movable = json.movable;
        card.home = json.home;
        card.text = json.text;

        card.text_color = json.text_color;
        card.bg_color = json.bg_color;

        return card;
    }


    public draw(ctx): void {
        ctx.fillStyle = this.bg_color;
        ctx.fillRect(this.x - this.half_size, this.y - this.half_size, this.half_size * 2, this.half_size * 2);

        ctx.fillStyle = this.text_color;
        ctx.font = "20px Arial";

        ctx.fillText(this.text, this.x - this.half_size, this.y);
    }


    public drawOutline(ctx): void {
        ctx.fillStyle = "lightgray";
        ctx.strokeStyle = "black";
        let w = this.half_size * 2;
        let h = this.half_size * 2;

        ctx.rect(this.x - this.half_size, this.y - this.half_size, this.half_size * 2, this.half_size * 2)
        ctx.stroke();
    }

}