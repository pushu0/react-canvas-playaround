import styles from './BaseCanvas.module.css';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getPoseStream, PosePayload, useStream } from '../lib/stream';
import dynamic from 'next/dynamic';
import {
    useImage,
    getRatio,
    getImageCenterPositionOnCanvas,
    getImageDimensionsToFitOnCanvas,
    getPositionFromBottomRight,
    CANVAS_SCALE,
} from '../lib/canvas.utils';
import { IPosition, IDimensions } from '../types';

const BaseCanvas = dynamic(() => import('../components/BaseCanvas'), { ssr: false });

const PIXEL_TO_METER_RATIO = 10;

const Canvas = () => {
    const [isReady, setIsReady] = useState(false);
    const { stream: poseStream } = useStream(getPoseStream);

    // pose as ref to skip re-rendering the whole component when it's updated
    const pose = useRef<PosePayload>({
        x: 0,
        y: 0,
        angle: 0,
    });
    useStream(getPoseStream, (payload) => {
        pose.current = payload;
    });

    const ratio = useRef(1);
    const imgPosition = useRef<IPosition>();
    const imgDimensions = useRef<IDimensions>();

    const { image, loadImage } = useImage('/images/map.png');

    // compute Robot position


    const drawRobot = (img: HTMLImageElement) => (ctx: CanvasRenderingContext2D) => {
        const startingPoint = getPositionFromBottomRight(img, ctx);

        const trueX = pose.current.x * PIXEL_TO_METER_RATIO * ratio.current;
        const trueY = pose.current.y * PIXEL_TO_METER_RATIO * ratio.current;

        const gotoPosition = {
            x: startingPoint.x - trueX,
            y: startingPoint.y - trueY,
        };

        ctx.fillStyle = '#000000';
        ctx.beginPath();

        // const random = Math.random() * 100;
        // ctx.arc(x, y, 20 * Math.sin(random * 0.05) ** 2, 0, 2 * Math.PI);
        ctx.arc(gotoPosition.x, gotoPosition.y, 10, 0, 2 * Math.PI);
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
            return;
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
            console.log('image loaded');
            image.current = img;
            setIsReady(true);

            drawLayers.current = [];
            drawLayers.current.push(drawMap(img));
            drawLayers.current.push(drawRobot(img));
        });
    }, []);

    const handleOnClick = (canvas: HTMLCanvasElement, position: IPosition) => {
        if (!image.current) {
            console.error('Image not loaded');
            return;
        }
        const context = canvas.getContext('2d')!;

        const rect = canvas.getBoundingClientRect();

        const startingPoint = getPositionFromBottomRight(image.current, context);
        const imgPosition = getImageCenterPositionOnCanvas(image.current, canvas, ratio.current);
        // const imgDimensions = getImageDimensionsToFitOnCanvas(image.current, canvas, ratio.current);

        const trueX = (position.x - rect.x) * CANVAS_SCALE;
        const trueY = (position.y - rect.y) * CANVAS_SCALE;

        const gotoPosition = {
            x: (startingPoint.x - trueX) / ratio.current / PIXEL_TO_METER_RATIO,
            y: (startingPoint.y - trueY) / ratio.current / PIXEL_TO_METER_RATIO,
        };

        const isWithinImageBounds =
            trueX > imgPosition.x && trueX < startingPoint.x && trueY > imgPosition.y && trueY < startingPoint.y;

        if (!isWithinImageBounds) {
            console.error('Click outside map, position will not change');
            return;
        }

        poseStream?.send({
            ...gotoPosition,
            angle: pose.current?.angle ?? 0,
        });
    };

    return isReady ? (
        <>
            <BaseCanvas draw={draw} onClickCallback={handleOnClick} />
        </>
    ) : (
        <>
            <div> Loading ... </div>
        </>
    );
};

export default Canvas;
