import styles from './BaseCanvas.module.css';

import { useEffect, useRef } from 'react';

const BaseCanvas = (props: { draw: (ctx: CanvasRenderingContext2D) => void }) => {
    const { draw } = props;

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement;

        // higher resolution canvas
        canvas.height = document.documentElement.clientHeight * 2;
        canvas.width = document.documentElement.clientWidth * 2;
    }, []);


    const requestRef = useRef(0);

    const tick = (time: number) => {
        // Change the state according to the animation
        draw(canvasRef.current?.getContext('2d')!);
        requestRef.current = requestAnimationFrame(tick);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return (
        <>
            <canvas className={styles.canvas} ref={canvasRef} />
        </>
    );
};

export default BaseCanvas;
