export * from './canvas';

export type Collection<Type> = {
    [id in string | number | keyof Type]: Type;
};

export interface IAsset {
    id: string;
    url: string;
}
