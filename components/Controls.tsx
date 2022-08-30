import styles from './Controls.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlay,
    faPause,
    faCaretUp,
    faCaretDown,
    faCaretLeft,
    faCaretRight,
} from '@fortawesome/free-solid-svg-icons';
import { Collection, EControls, IControlButton, IControlButtonAction } from '../types';
import { useMemo, useState } from 'react';

const Controls = (props: { actions: { [key in EControls]: IControlButtonAction }; isPaused: boolean }) => {
    // Define available controls and hook up parent actions
    const buttons: Collection<IControlButton> = {
        [EControls.UP]: {
            id: EControls.UP,
            action: props.actions[EControls.UP],
            icon: faCaretUp,
        },
        [EControls.LEFT]: {
            id: EControls.LEFT,
            action: props.actions[EControls.LEFT],
            icon: faCaretLeft,
        },
        [EControls.PAUSE]: {
            id: EControls.PAUSE,
            action: props.actions[EControls.PAUSE],
            icon: faPause,
        },
        [EControls.PLAY]: {
            id: EControls.PLAY,
            action: props.actions[EControls.PLAY],
            icon: faPlay,
        },
        [EControls.RIGHT]: {
            id: EControls.RIGHT,
            action: props.actions[EControls.RIGHT],
            icon: faCaretRight,
        },
        [EControls.DOWN]: {
            id: EControls.DOWN,
            action: props.actions[EControls.DOWN],
            icon: faCaretDown,
        },
    };

    // Control which button goes where
    const rows = useMemo<IControlButton[][]>(() => {
        const playOrPauseButton = props.isPaused ? buttons[EControls.PLAY] : buttons[EControls.PAUSE];
        return [
            [buttons[EControls.UP]],
            [buttons[EControls.LEFT], playOrPauseButton, buttons[EControls.RIGHT]],
            [buttons[EControls.DOWN]],
        ];
    }, [props.isPaused]);

    return (
        <div className={styles.controls}>
            {rows.map((row, index) => (
                <div key={index} className={styles.row}>
                    {row.map((btn) => (
                        <div key={btn.id} className={styles.button}>
                            <button data-testid={btn.id} onClick={btn.action}>
                                <FontAwesomeIcon icon={btn.icon} />
                            </button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Controls;
