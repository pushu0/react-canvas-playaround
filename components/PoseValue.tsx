import mitt from 'next/dist/shared/lib/mitt';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { getPoseStream, IPosePayload, useStream } from '../lib/stream';
import styles from './RobotStatus.module.css';

const CopyToClipboard = dynamic(() => import('../components/CopyToClipboard'), { ssr: false });

const PoseValue = () => {
    const [pose, setPose] = useState<IPosePayload>();
    useStream(getPoseStream, (payload) => {
        if (pose?.x !== payload.x || pose?.y !== payload.y || pose?.angle !== payload.angle) {
            setPose(payload);
        }
    });

    return pose ? (
        <div className={[styles.chip, styles.coordinates].join(' ')}>
            <code>
                <strong>x:</strong> {formatNumber(pose.x)} / <strong>y:</strong> {formatNumber(pose.y)} /{' '}
                <strong>angle:</strong> {formatNumber(pose.angle)}
            </code>
            <CopyToClipboard position={pose} />
        </div>
    ) : null;
};

const formatNumber = (num: number) => +num.toFixed(2);

export default PoseValue;
