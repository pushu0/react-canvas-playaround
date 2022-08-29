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
