import styles from './BaseCanvas.module.css';

import { useEffect, useRef } from 'react';
import { IPosition } from '../types';
import { CANVAS_SCALE } from '../lib/canvas.utils';

const BaseCanvas = (props: {
    draw: (ctx: CanvasRenderingContext2D) => void;
    onClickCallback?: (ctx: HTMLCanvasElement, position: IPosition) => void;
}) => {
    const { draw } = props;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef(0);

    const tick = (time: number) => {
        // Change the state according to the animation
        draw(canvasRef.current?.getContext('2d')!);
        requestRef.current = requestAnimationFrame(tick);
    };

    const handleClick = (e: MouseEvent) => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        
        e.stopImmediatePropagation()
        const { x, y } = getCursorPosition(e);
        props.onClickCallback?.(canvas, { x, y });                
    }

    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement;

        // higher resolution canvas
        canvas.height = document.documentElement.clientHeight * CANVAS_SCALE;
        canvas.width = document.documentElement.clientWidth * CANVAS_SCALE;

        if (!!props.onClickCallback && typeof props.onClickCallback === 'function') {
            // click event listener
            console.log('triggering callback');
            canvas.addEventListener('mousedown', handleClick);
        }

        requestRef.current = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(requestRef.current);
            canvas.removeEventListener('mousedown', handleClick)
        }
    }, []); 

    return (
        <>
            <canvas className={styles.canvas} ref={canvasRef} />
        </>
    );
};

export default BaseCanvas;

const getCursorPosition = (event: MouseEvent) => {    
    const x = event.clientX;
    const y = event.clientY;
    return {
        x,
        y,
    };
};
