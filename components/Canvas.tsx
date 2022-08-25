import styles from './BaseCanvas.module.css';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getPoseStream, PosePayload, useStream } from '../lib/stream';

const PIXEL_TO_METER_RATIO = 10;

const Canvas = () => {
    const [pose, setPose] = useState<PosePayload>({
        x: 0,
        y: 0,
        angle: 0,
    });
    useStream(getPoseStream, (payload) => {
        setPose(payload);
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestIdRef = useRef(0);

    const map = useRef({
        img: new Image(),
        x: 0,
        y: 0,
        height: 0,
        width: 0,
    });
    const ratio = useRef(0);

    // compute Robot position
    const robotPosition = useMemo<IPosition>(() => {
        const startingPointX = map.current.x + map.current.width;
        const startingPointY = map.current.y + map.current.height;

        const poseXWithRatio = (pose?.x ?? 0) * PIXEL_TO_METER_RATIO * ratio.current;
        const poseYWithRatio = (pose?.y ?? 0) * PIXEL_TO_METER_RATIO * ratio.current;
        return {
            x: startingPointX - poseXWithRatio,
            y: startingPointY - poseYWithRatio,
        };
    }, [pose, map.current, requestIdRef]);

    const drawMap = (ctx: CanvasRenderingContext2D) => {
        ctx?.drawImage(map.current.img, map.current.x, map.current.y, map.current.width, map.current.height);
    };
    const drawRobot = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = '#000000';
        ctx.beginPath();

        const random = Math.random() * 100;
        ctx.arc(robotPosition.x, robotPosition.y, 20 * Math.sin(random * 0.05) ** 2, 0, 2 * Math.PI);
        ctx.fill();
    };

    const drawQueue: ((ctx: CanvasRenderingContext2D) => void)[] = [];
    drawQueue.push(drawMap);
    drawQueue.push(drawRobot);

    const draw = (ctx: CanvasRenderingContext2D) => {
        ctx.save();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        drawQueue.forEach((drawItem) => drawItem(ctx));
    };

    // on mounted
    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement;

        // higher resolution canvas
        canvas.height = document.documentElement.clientHeight * 2;
        canvas.width = document.documentElement.clientWidth * 2;

        loadImage('/images/map.png', (img) => {
            // init ratio
            ratio.current = getRatio(canvas, img);

            const { x, y } = getImageCenterPositionOnCanvas(img, canvas, ratio.current);
            const { height, width } = getImageDimensionsToFitOnCanvas(img, canvas, ratio.current);
            // init image props
            map.current = {
                x: x,
                y: y,
                height: height,
                width: width,
                img: img,
            };
        });
    }, []);

    useEffect(() => {
        draw(canvasRef.current?.getContext('2d')!);
    }, [pose]);

    return (
        <>
            <canvas className={styles.canvas} ref={canvasRef} />
        </>
    );
};

export default Canvas;

function loadImage(url: string, callback: (img: HTMLImageElement) => void) {
    var img = new Image();

    img.onload = function () {
        callback(img);
    };
    img.src = url;
}

// calculate ratio
const getRatio = (img1: { width: number; height: number }, img2: { width: number; height: number }): number => {
    const hRatio = img1.width / img2.width;
    const vRatio = img1.height / img2.height;
    const ratio = Math.min(hRatio, vRatio);
    return ratio;
};

interface IPosition {
    x: number;
    y: number;
}

interface IDimensions {
    width: number;
    height: number;
}

// calculate position / dimensions of image to be drawn on canvas
const getImageCenterPositionOnCanvas = (img: HTMLImageElement, canvas: HTMLCanvasElement, ratio: number): IPosition => {
    const x = (canvas.width - img.width * ratio) / 2;
    const y = (canvas.height - img.height * ratio) / 2;

    return {
        x,
        y,
    };
};

const getImageDimensionsToFitOnCanvas = (
    img: HTMLImageElement,
    canvas: HTMLCanvasElement,
    ratio: number,
): IDimensions => {
    const imageHeight = img.height * ratio;
    const imageWidth = img.width * ratio;

    return {
        height: imageHeight,
        width: imageWidth,
    };
};
