import {IconDefinition} from '@fortawesome/free-solid-svg-icons';
export * from './canvas';

export type Collection<Type> = {
    [id in string | number | keyof Type]: Type;
};

export const enum EAsset {
    MAP = 'map',
}
export interface IAsset {
    id: EAsset;
    url: string;
}

export type IControlButtonAction = () => void;

export enum EControls {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right',
    PAUSE = 'pause',
    PLAY = 'play',
}

export interface IControlButton {
    id: EControls;
    action: IControlButtonAction;
    icon: IconDefinition;
}
