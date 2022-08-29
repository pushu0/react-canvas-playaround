import { useRef, useCallback, useMemo } from 'react';
import { PosePayload, useStream, getPoseStream, getPausedStream } from './stream';

const INCREMENT_BY = 0.5;

export const usePoseControls = () => {
    // Current pose
    const pose = useRef<PosePayload>();

    const { stream: poseStream } = useStream(getPoseStream, (payload) => {
        pose.current = payload;
    });

    // Pause state
    const { stream: pausedStream } = useStream(getPausedStream);

    // Controls
    const goUp = useCallback(() => {
        if (!pose.current || !poseStream) return;
        poseStream.send({
            ...pose.current,
            y: pose.current.y + INCREMENT_BY,
        });
    }, [poseStream, pose.current]);
    const goDown = useCallback(() => {
        if (!pose.current || !poseStream) return;
        poseStream.send({
            ...pose.current,
            y: pose.current.y - INCREMENT_BY,
        });
    }, [poseStream, pose.current]);
    const goLeft = useCallback(() => {
        if (!pose.current || !poseStream) return;
        poseStream.send({
            ...pose.current,
            x: pose.current.x + INCREMENT_BY,
        });
    }, [poseStream, pose.current]);
    const goRight = useCallback(() => {
        if (!pose.current || !poseStream) return;
        const position = {
            ...pose.current,
            x: pose.current.x - INCREMENT_BY,
        };
        poseStream.send(position);
    }, [pose.current, poseStream]);

    // Pause and unpause buttons
    const pause = useCallback(() => pausedStream?.send({ paused: true }), [pausedStream]);
    const play = useCallback(() => pausedStream?.send({ paused: false }), [pausedStream]);

    //
    const actions = {
        up: goUp,
        down: goDown,
        left: goLeft,
        right: goRight,
        pause: pause,
        play: play,
    };

    return {
        actions,
    };
};
