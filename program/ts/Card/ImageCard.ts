class ImageCard extends Card {

    images = []
    selected_image = 0


    public clone(): ImageCard {
        let clone = new ImageCard(this.x, this.y);
        clone.half_size = this.half_size
        clone.images = this.images
        clone.selected_image = this.selected_image
        clone.movable = this.movable;
        return clone;
    }

    public draw(ctx): void {
        let img = this.images[this.selected_image]
        ctx.drawImage(img, this.x, this.y, img.width, img.height)
    }


    public drawOutline(ctx): void {
        ctx.fillStyle = "lightgray";
        ctx.strokeStyle = "black";
        let w = this.images[0].width;
        let h = this.images[0].height;

        ctx.rect(this.x, this.y, w, h)
        ctx.stroke();
    }
}