import { useRef } from 'react';
import { IDimensions, IPosition } from '../types';

export const useImage = (url: string) => {
    const image = useRef<HTMLImageElement | null>(null);
    const isImageLoaded = image.current?.complete && image.current.naturalHeight !== 0;

    const loadImage = function (callback: (img: HTMLImageElement) => void) {
        var img = new Image();
        img.onload = function () {
            callback(img);
        };
        img.src = url;
    };

    return {
        loadImage,
        getRatio: isImageLoaded
            ? getRatio(image.current!)
            : (_: any) => {
                  console.error('Image not loadded yet', url);
                  return 1;
              },
        getTopLeftPositionOnCanvas: isImageLoaded
            ? getImageCenterPositionOnCanvas(image.current!)
            : (_: any) => {
                  console.error('Image not loadded yet', url);
                  return {
                      x: 0,
                      y: 0,
                  };
              },
        getDimensionsToFitOnCanvas: isImageLoaded
            ? getImageDimensionsToFitOnCanvas(image.current!)
            : (_: any) => {
                  console.error('Image not loadded yet', url);
                  return {
                      width: 0,
                      height: 0,
                  };
              },
    };
};

// calculate ratio
export const getRatio =
    (img1: { width: number; height: number }) =>
    (img2: { width: number; height: number }): number => {
        const hRatio = img1.width / img2.width;
        const vRatio = img1.height / img2.height;
        const ratio = Math.min(hRatio, vRatio);
        return ratio;
    };

// calculate position / dimensions of image to be drawn on canvas
export const getImageCenterPositionOnCanvas =
    (img: HTMLImageElement) =>
    (canvas: HTMLCanvasElement, ratio: number): IPosition => {
        const x = (canvas.width - img.width * ratio) / 2;
        const y = (canvas.height - img.height * ratio) / 2;

        return {
            x,
            y,
        };
    };

export const getImageDimensionsToFitOnCanvas =
    (img: HTMLImageElement) =>
    (canvas: HTMLCanvasElement, ratio: number): IDimensions => {
        const imageHeight = img.height * ratio;
        const imageWidth = img.width * ratio;

        return {
            height: imageHeight,
            width: imageWidth,
        };
    };
