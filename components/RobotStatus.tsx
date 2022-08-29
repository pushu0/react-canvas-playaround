import styles from './RobotStatus.module.css';

import { useMemo, useCallback, useState, useRef } from 'react';
import { getPoseStream, useStream, IPosePayload, getPausedStream } from '../lib/stream';
import dynamic from 'next/dynamic';
import { PIXEL_TO_METER_RATIO } from '../lib/utils';
import { usePoseControls } from '../lib/poseControls';

const PoseValue = dynamic(() => import('../components/PoseValue'), { ssr: false });
const Controls = dynamic(() => import('../components/Controls'), { ssr: false });

const RobotStatus = () => {
    // Pause state
    const [isPaused, setIsPaused] = useState(false);
    useStream(getPausedStream, ({ paused }) => setIsPaused(paused));

    const { connected: poseConnected } = useStream(getPoseStream);

    // Connection status
    const status = (
        <div className={styles.chip}>
            <div className={[styles.dot, poseConnected ? styles.connected : styles.disconnected].join(' ')}></div>
            <div>{poseConnected ? 'Online' : 'Offline'}</div>
        </div>
    );

    // Pose control actions
    const { actions } = usePoseControls();

    // Component content
    return (
        <>
            <div className={styles.toolbar}>
                {status}
                <PoseValue />
            </div>
            <Controls actions={actions} isPaused={isPaused} />
        </>
    );
};

export default RobotStatus;
