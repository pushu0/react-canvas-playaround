import styles from './BaseCanvas.module.css';

import { useEffect, useRef } from 'react';
import { getPoseStream, IPosePayload, useStream } from '../lib/stream';
import dynamic from 'next/dynamic';
import { handleImgClick } from '../lib/utils';
import { IPosition, Collection } from '../types';
import { CanvasMapImage, CanvasRobot } from '../types/entities';

const BaseCanvas = dynamic(() => import('../components/BaseCanvas'), { ssr: false });

// expect an image to be drawn as a map
const Canvas = (props: { assets: { map: HTMLImageElement } }) => {
    // pose as ref to skip re-rendering the whole component when it's updated
    const pose = useRef<IPosePayload>({
        x: 0,
        y: 0,
        angle: 0,
    });

    const map = new CanvasMapImage(props.assets.map);
    const robot = new CanvasRobot(map, pose);

    const { connected, stream: poseStream } = useStream(getPoseStream, (payload) => {
        pose.current = payload;
    });

    // Control the visibility layer
    // e.g. robot to be drawn on the map not the other way around
    const drawLayers = useRef<((ctx: CanvasRenderingContext2D) => void)[]>([]);
    const draw = (ctx: CanvasRenderingContext2D) => {
        const canvas = ctx.canvas;
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLayers.current.forEach((drawItem) => drawItem(ctx));
    };

    useEffect(() => {
        drawLayers.current = [];
        drawLayers.current.push((ctx) => map.draw(ctx));
        drawLayers.current.push((ctx) => robot.draw(ctx));
    }, []);

    // Change robot's position
    const handleOnClick = (canvas: HTMLCanvasElement, position: IPosition) => {
        const clickPosition = handleImgClick(map, canvas, position);

        if (!clickPosition) return;
        poseStream?.send({
            ...clickPosition,
            angle: pose.current?.angle ?? 0,
        });
    };

    return connected ? (
        <div>
            <BaseCanvas draw={draw} onClickCallback={handleOnClick} />
        </div>
    ) : (
        <div>Loading ...</div>
    );
};

export default Canvas;
