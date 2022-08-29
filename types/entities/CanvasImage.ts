import { IDimensions, IBoundries } from "../canvas";
import { CanvasItem } from "./CanvasItem";

export abstract class CanvasImage extends CanvasItem {
    img: any;

    constructor(item: any) {
        super();
        this.img = item;
    }

    abstract getRatioOnCanvas(canvas: HTMLCanvasElement): number;
    abstract getDimensionsOnCanvas(canvas: HTMLCanvasElement): IDimensions;
    abstract getBoundriesOnCanvas(canvas: HTMLCanvasElement): IBoundries;
}