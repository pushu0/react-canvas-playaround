import { useMemo, useRef } from 'react';
import { IDimensions, IPosition } from '../types';

export const CANVAS_SCALE = 2

export const useImage = (url: string) => {
    const image = useRef<HTMLImageElement | null>(null);
    const isImageLoaded = useRef(false);

    const loadImage = function (callback: (img: HTMLImageElement) => void) {
        var img = new Image();
        img.onload = function () {
            isImageLoaded.current = true;
            image.current = img;
            callback(img);
        };
        img.src = url;
    };

    return {
        loadImage,
        image,
    };
};

// calculate ratio
export const getRatio =
    (img1: { width: number; height: number }, img2: { width: number; height: number }): number => {
        const hRatio = img1.width / img2.width;
        const vRatio = img1.height / img2.height;
        const ratio = Math.min(hRatio, vRatio);
        return ratio;
    };

// calculate position / dimensions of image to be drawn on canvas
export const getImageCenterPositionOnCanvas =
    (img: HTMLImageElement, canvas: HTMLCanvasElement, ratio: number): IPosition => {
        const x = (canvas.width - img.width * ratio) / 2;
        const y = (canvas.height - img.height * ratio) / 2;

        return {
            x,
            y,
        };
    };

export const getImageDimensionsToFitOnCanvas =
    (img: HTMLImageElement, canvas: HTMLCanvasElement, ratio: number): IDimensions => {
        const imageHeight = img.height * ratio;
        const imageWidth = img.width * ratio;

        return {
            height: imageHeight,
            width: imageWidth,
        };
    };
