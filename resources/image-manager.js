class ImageManager {

    static images = new Map();

    static Load(src) {
        let img = new Image();
        img.src = src;
        this.images.set(src, img);
    }

    static Get(src) {
        return this.images.get(src);
    }


}

export { ImageManager }