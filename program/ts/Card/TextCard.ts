class TextCard extends Card {

    text: string = "";
    text_color: string = "#000000";
    bg_color: string = "#ffffff";

    public clone(): TextCard {
        let clone = new TextCard(this.x, this.y);
        clone.half_size = this.half_size
        clone.selected_image = this.selected_image
        clone.movable = this.movable;

        clone.text = this.text;
        clone.text_color = this.text_color;
        clone.bg_color = this.bg_color;
        return clone;
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