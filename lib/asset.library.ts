import { IAsset, Collection, EAsset } from '../types';

// Library to store loaded assets
const library: any = {};

export const loadAssets = async <T extends IAsset>(assets: T[]): Promise<Record<IAsset['id'], HTMLImageElement>> => {
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
        return library as Record<IAsset['id'], HTMLImageElement>;
    }
};
