import { IPosition } from '../canvas';

export abstract class CanvasItem {
    abstract getPositionOnCanvas(canvas: HTMLCanvasElement): IPosition;
    abstract draw(context: CanvasRenderingContext2D): void;
}
