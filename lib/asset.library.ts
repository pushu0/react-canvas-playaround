import { IAsset, Collection } from "../types";

export const library: Collection<HTMLImageElement> = {};
export const loadAssets = async (assets: IAsset[]): Promise<Collection<HTMLImageElement>> => {
    try {
        const assetPromises = assets.map((asset) => {
            return new Promise(function (resolve, reject) {
                const img = new Image();
                img.onload = () => {
                    library[asset.id] = img;
                    resolve(img);
                };
                img.onerror = () => reject();
                img.src = asset.url;
            });
        });

        await Promise.all(assetPromises);
    } catch (e) {
        console.error('Error caching images', e);
    } finally {
        return library;
    }
};