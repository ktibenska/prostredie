class ImageCard extends Card {

    images = []
    selected_image: number = 0

    public clone(): ImageCard {
        let clone = new ImageCard(this.x, this.y);
        clone.half_size = this.half_size
        clone.movable = this.movable
        clone.category = this.category;

        clone.images = this.images
        clone.selected_image = this.selected_image
        return clone;
    }


    public toJSON() {
        let images = []
        for (let i of this.images) {
            images.push(i.src)
        }

        return {
            x: this.x,
            y: this.y,
            movable: this.movable,
            home: this.home,
            category: this.category,

            images: images,
            selected_image: this.selected_image
        }
    }


    public static fromJSON(json: any): ImageCard {
        let card = new ImageCard(json.x, json.y);

        card.movable = json.movable;
        card.home = json.home;
        card.category = json.category;

        card.images = []

        for (let i of json.images) {
            let im = new Image()
            im.src = i
            card.images.push(im)
        }

        card.selected_image = json.selected_image;

        return card;
    }


    public draw(ctx: any): void {
        let img = this.images[this.selected_image]
        ctx.drawImage(img, this.x, this.y, img.width, img.height)
    }


    public drawOutline(ctx: any): void {
        ctx.fillStyle = "lightgray";
        ctx.strokeStyle = "black";
        let w = this.images[this.selected_image].width;
        let h = this.images[this.selected_image].height;

        ctx.strokeRect(this.x, this.y, w, h)
    }


    public isCLicked(x: number, y: number): boolean {
        let w = this.images[this.selected_image].width;
        let h = this.images[this.selected_image].height;

        let clicked = (x >= this.x && x <= this.x + w) && (y >= this.y&& y <= this.y + h);

        if (clicked) {
            this.selected_image++;
            this.selected_image %= (this.images.length)
        }
        return clicked;
    }
}