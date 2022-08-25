import styles from './BaseCanvas.module.css';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getPoseStream, PosePayload, useStream } from '../lib/stream';
import { useImage } from '../lib/canvas.utils';
import { IDimensions, IPosition } from '../types';

const PIXEL_TO_METER_RATIO = 10;

const BaseCanvas = () => {
    const [pose, setPose] = useState<PosePayload>({
        x: 0,
        y: 0,
        angle: 0,
    });
    useStream(getPoseStream, (payload) => {
        setPose(payload);
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ratio = useRef(1);
    const imgPosition = useRef<IPosition>();
    const imgDimensions = useRef<IDimensions>();

    // compute Robot position
    const getRobotPosition = (context: CanvasRenderingContext2D) => {
        const ratio = mapImage.getRatio(context.canvas);
        const { x, y } = mapImage.getTopLeftPositionOnCanvas(context.canvas, ratio);
        const { width, height } = mapImage.getDimensionsToFitOnCanvas(context.canvas, ratio);

        const startingPointX = x + width;
        const startingPointY = y + height;

        const poseXWithRatio = (pose?.x ?? 0) * PIXEL_TO_METER_RATIO * ratio;
        const poseYWithRatio = (pose?.y ?? 0) * PIXEL_TO_METER_RATIO * ratio;

        return {
            x: startingPointX - poseXWithRatio,
            y: startingPointY - poseYWithRatio,
        };
    };

    const drawRobot = (ctx: CanvasRenderingContext2D) => {
        const { x, y } = getRobotPosition(ctx);

        ctx.fillStyle = '#000000';
        ctx.beginPath();

        const random = Math.random() * 100;
        ctx.arc(x, y, 20 * Math.sin(random * 0.05) ** 2, 0, 2 * Math.PI);
        ctx.fill();
    };

    const drawLayers = useRef<((ctx: CanvasRenderingContext2D) => void)[]>([]);

    const draw = (ctx: CanvasRenderingContext2D) => {
        ctx.save();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        drawLayers.current.forEach((drawItem) => drawItem(ctx));
    };

    const mapImage = useImage('/images/map.png');

    const drawMap = (img: HTMLImageElement) => (context: CanvasRenderingContext2D) => {
        const ratio = mapImage.getRatio(context.canvas);
        const { x, y } = mapImage.getTopLeftPositionOnCanvas(context.canvas, ratio);
        const { width, height } = mapImage.getDimensionsToFitOnCanvas(context.canvas, ratio);

        context.drawImage(img, x, y, width, height);
    };

    // on mounted
    useEffect(() => {
        mapImage.loadImage((img) => {
            drawLayers.current.push(drawMap(img));
            drawLayers.current.push(drawRobot);
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

export default BaseCanvas;
