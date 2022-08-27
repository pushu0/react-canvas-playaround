import styles from './BaseCanvas.module.css';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getPoseStream, PosePayload, useStream } from '../lib/stream';
import dynamic from 'next/dynamic';
import {
    useImage,
    getRatio,
    getImageCenterPositionOnCanvas,
    getImageDimensionsToFitOnCanvas,
} from '../lib/canvas.utils';
import { IPosition, IDimensions } from '../types';

const BaseCanvas = dynamic(() => import('../components/BaseCanvas'), { ssr: false });

const PIXEL_TO_METER_RATIO = 10;

const Canvas = () => {
    const [isReady, setIsReady] = useState(false);

    // pose as ref to skip re-rendering the whole component when it's updated
    const pose = useRef<IPosition>();
    useStream(getPoseStream, (payload) => {
        pose.current = payload;
    });
    
    const ratio = useRef(1);
    const imgPosition = useRef<IPosition>();
    const imgDimensions = useRef<IDimensions>();

    const {image, loadImage} = useImage('/images/map.png');

    // compute Robot position
    const getRobotPosition = (img: HTMLImageElement, context: CanvasRenderingContext2D) => {
        const ratio = getRatio(context.canvas, img);
        const { x, y } = getImageCenterPositionOnCanvas(img, context.canvas, ratio);
        const { width, height } = getImageDimensionsToFitOnCanvas(img, context.canvas, ratio);

        const startingPointX = x + width;
        const startingPointY = y + height;

        const poseXWithRatio = (pose.current?.x ?? 0) * PIXEL_TO_METER_RATIO * ratio;
        const poseYWithRatio = (pose.current?.y ?? 0) * PIXEL_TO_METER_RATIO * ratio;

        return {
            x: startingPointX - poseXWithRatio,
            y: startingPointY - poseYWithRatio,
        };
    };

    const drawRobot = (img: HTMLImageElement) => (ctx: CanvasRenderingContext2D) => {
        const { x, y } = getRobotPosition(img, ctx);

        ctx.fillStyle = '#000000';
        ctx.beginPath();

        const random = Math.random() * 100;
        ctx.arc(x, y, 20 * Math.sin(random * 0.05) ** 2, 0, 2 * Math.PI);
        ctx.fill();
    };

    const drawLayers = useRef<((ctx: CanvasRenderingContext2D) => void)[]>([]);

    const draw = (ctx: CanvasRenderingContext2D) => {
        const canvas = ctx.canvas;
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);    
        drawLayers.current.forEach((drawItem) => drawItem(ctx));
    };

    const drawMap = (img: HTMLImageElement) => (context: CanvasRenderingContext2D) => {
        if (!image.current) {
            console.error('image not loaded');
            return
        }
        ratio.current = getRatio(context.canvas, image.current);
        imgPosition.current = getImageCenterPositionOnCanvas(image.current, context.canvas, ratio.current);
        imgDimensions.current = getImageDimensionsToFitOnCanvas(image.current, context.canvas, ratio.current);


        context.drawImage(
            img,
            imgPosition.current?.x ?? 0,
            imgPosition.current?.y ?? 0,
            imgDimensions.current?.width ?? 0,
            imgDimensions.current?.height ?? 0,
        );
    };

    // on mounted
    useEffect(() => {
        loadImage((img) => {
            setIsReady(true);
            image.current = img;

            drawLayers.current = [];
            drawLayers.current.push(drawMap(img));
            drawLayers.current.push(drawRobot(img));
        });
    }, []);    

    return isReady ? (
        <>
            <BaseCanvas draw={draw} />
        </>
    ) : (
        <>
            <div> assets not ready yet </div>
        </>
    );
};

export default Canvas;
