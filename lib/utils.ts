import { IDimensions, IPosition } from '../types';
import { CanvasImage } from '../types/entities/CanvasImage';

export const CANVAS_SCALE = 2;
export const PIXEL_TO_METER_RATIO = 10;

// calculate ratio
export const getRatio = (img1: { width: number; height: number }, img2: { width: number; height: number }): number => {
    const hRatio = img1.width / img2.width;
    const vRatio = img1.height / img2.height;
    const ratio = Math.min(hRatio, vRatio);
    return ratio;
};

// calculate position / dimensions of image to be drawn on canvas
export const getImageCenterPositionOnCanvas = (
    img: { width: number; height: number },
    canvas: { width: number; height: number },
    ratio: number,
): IPosition => {
    const x = (canvas.width - img.width * ratio) / 2;
    const y = (canvas.height - img.height * ratio) / 2;

    return {
        x,
        y,
    };
};

export const getScaledImageDimensions = (img: { width: number; height: number }, ratio: number): IDimensions => {
    const imageHeight = img.height * ratio;
    const imageWidth = img.width * ratio;

    return {
        height: imageHeight,
        width: imageWidth,
    };
};

export const handleImgClick = (img: CanvasImage, canvas: HTMLCanvasElement, position: IPosition): IPosition | null => {  
    const rect = canvas.getBoundingClientRect();

    const ratio = img.getRatioOnCanvas(canvas);
    const boundries = img.getBoundriesOnCanvas(canvas);
    const imgPosition = img.getPositionOnCanvas(canvas);

    const trueX = (position.x - rect.x) * CANVAS_SCALE;
    const trueY = (position.y - rect.y) * CANVAS_SCALE;

    const gotoPosition = {
        x: (boundries.right - trueX) / ratio / PIXEL_TO_METER_RATIO,
        y: (boundries.bottom - trueY) / ratio / PIXEL_TO_METER_RATIO,
    };

    const isWithinImageBounds =
        trueX > imgPosition.x && trueX < boundries.right && trueY > imgPosition.y && trueY < boundries.bottom;    

    return isWithinImageBounds ? gotoPosition : null;
};
