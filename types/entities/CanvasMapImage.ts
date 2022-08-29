import { getRatio, getImageCenterPositionOnCanvas, getScaledImageDimensions } from "../../lib/utils";
import { CanvasImage } from "./CanvasImage";

export class CanvasMapImage extends CanvasImage {
    constructor(img: HTMLImageElement) {
        super(img);
    }

    getRatioOnCanvas(canvas: HTMLCanvasElement) {
        return getRatio(canvas, this.img);
    }

    getPositionOnCanvas(canvas: HTMLCanvasElement) {
        return getImageCenterPositionOnCanvas(this.img, canvas, this.getRatioOnCanvas(canvas));
    }

    getDimensionsOnCanvas(canvas: HTMLCanvasElement) {
        return getScaledImageDimensions(this.img, this.getRatioOnCanvas(canvas));
    }

    getBoundriesOnCanvas(canvas: HTMLCanvasElement) {
        const imgPosition = this.getPositionOnCanvas(canvas);
        const imgDimensions = this.getDimensionsOnCanvas(canvas);

        return {
            top: imgPosition.x,
            left: imgPosition.y,
            right: imgPosition.x + imgDimensions.width,
            bottom: imgPosition.y + imgDimensions.height,
        };
    }

    draw(context: CanvasRenderingContext2D) {        
        const imgPosition = this.getPositionOnCanvas(context.canvas);
        const imgDimensions = this.getDimensionsOnCanvas(context.canvas);

        context.drawImage(this.img, imgPosition.x, imgPosition.y, imgDimensions.width, imgDimensions.height);
    }
}