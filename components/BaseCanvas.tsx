import styles from './BaseCanvas.module.css';

import { useEffect, useRef } from 'react';
import { IPosition } from '../types';
import { CANVAS_SCALE, getCursorPosition } from '../lib/utils';
import useResize from '../lib/resize';

const BaseCanvas = (props: {
    draw: (ctx: CanvasRenderingContext2D) => void;
    onClickCallback?: (ctx: HTMLCanvasElement, position: IPosition) => void;
}) => {
    const { draw } = props;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef(0);

    // Change the state according to the browser animation frame
    const tick = (time: number) => {
        draw(canvasRef.current?.getContext('2d')!);
        requestRef.current = requestAnimationFrame(tick);
    };

    // Get position of click on the canvas and callback
    const handleClick = (e: MouseEvent) => {
        const canvas = canvasRef.current as HTMLCanvasElement;

        e.stopImmediatePropagation();
        const { x, y } = getCursorPosition(e);
        props.onClickCallback?.(canvas, { x, y });
    };

    const { dimensions } = useResize();

    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement;

        // higher resolution canvas
        canvas.height = document.documentElement.clientHeight * CANVAS_SCALE;
        canvas.width = document.documentElement.clientWidth * CANVAS_SCALE;

        if (!!props.onClickCallback && typeof props.onClickCallback === 'function') {
            // click event listener
            canvas.addEventListener('mousedown', handleClick);
        }

        requestRef.current = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(requestRef.current);
            canvas.removeEventListener('mousedown', handleClick);
        };
    }, [dimensions]); // force re-render when page is resized

    return (
        <>
            <canvas className={styles.canvas} ref={canvasRef} />
        </>
    );
};

export default BaseCanvas;
