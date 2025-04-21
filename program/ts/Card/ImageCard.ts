class ImageCard extends Card {

    images = []
    selected_image = 0


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
            images: images,

            // images: this.images[0].src,
            selected_image: this.selected_image
        }
    }


    public static fromJSON(json: any): ImageCard {
        let card = new ImageCard(json.x, json.y);
        card.movable = json.movable;
        card.home = json.home;

        card.images = []
        // console.log(json.images)

        for (let i of json.images) {
            // console.log(i)
            let im = new Image()
            im.src = i
            card.images.push(im)
        }



        // let im = new Image()
        // im.src = json.images
        // card.images.push(im)

        // card.images = [json.images];
        card.selected_image = json.selected_image;

        return card;
    }

    public clone(): ImageCard {
        let clone = new ImageCard(this.x, this.y);
        clone.half_size = this.half_size
        clone.images = this.images
        clone.selected_image = this.selected_image
        // clone.setMovable(this.isMovable);
        clone.movable = this.movable
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

        ctx.strokeRect(this.x, this.y, w, h)
    }
}