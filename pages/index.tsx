import Head from 'next/head';
import dynamic from 'next/dynamic';

import styles from '../styles/index.module.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Collection, EAsset, IAsset } from '../types';
import { loadAssets } from '../lib/asset.library';

const RobotStatus = dynamic(() => import('../components/RobotStatus'), { ssr: false });
const Canvas = dynamic(() => import('../components/Canvas'), { ssr: false });

const Home = () => {
    const [isLoading, setIsLoading] = useState(true);
    const library = useRef<Record<EAsset, HTMLImageElement>>();

    const assets: IAsset[] = [
        {
            id: EAsset.MAP,
            url: '/images/map.png',
        },
    ];

    useEffect(() => {
        loadAssets(assets).then((data) => {
            library.current = data;
            setIsLoading(false);
        });
    }, []);

    const canvas = isLoading || !library.current ? <div> Loading ...</div> : <Canvas assets={library.current!} />;

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                {canvas}
                <RobotStatus />
            </main>
        </div>
    );
};

export default Home;
