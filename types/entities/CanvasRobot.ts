import { MutableRefObject } from "react";
import { CanvasImage, CanvasItem } from ".";
import { PIXEL_TO_METER_RATIO } from "../../lib/utils";
import { PosePayload } from "../../lib/stream";

export class CanvasRobot extends CanvasItem {
    img: CanvasImage;
    pose: MutableRefObject<PosePayload>;

    constructor(img: CanvasImage, pose: MutableRefObject<PosePayload>) {
        super();
        this.img = img;
        this.pose = pose;
    }

    getPositionOnCanvas(canvas: HTMLCanvasElement) {
        const boundries = this.img.getBoundriesOnCanvas(canvas);
        const ratio = this.img.getRatioOnCanvas(canvas);

        const trueX = this.pose.current.x * ratio * PIXEL_TO_METER_RATIO;
        const trueY = this.pose.current.y * ratio * PIXEL_TO_METER_RATIO;

        return {
            x: boundries.right - trueX,
            y: boundries.bottom - trueY,
        };
    }

    draw(context: CanvasRenderingContext2D): void {
        const position = this.getPositionOnCanvas(context.canvas);

        context.fillStyle = '#000000';
        context.beginPath();

        // const random = Math.random() * 100;
        // context.arc(x, y, 20 * Math.sin(random * 0.05) ** 2, 0, 2 * Math.PI);
        context.arc(position.x, position.y, 10, 0, 2 * Math.PI);
        context.fill();
    }
}