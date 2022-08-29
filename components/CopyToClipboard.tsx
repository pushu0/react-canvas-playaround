import styles from './CopyToClipboard.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { IPosePayload } from '../lib/stream';
import { useState } from 'react';

const CLEAR_ICON_TIMEOUT = 750;

const copyToClipboard = (props: { position: IPosePayload }) => {
    const [icon, setIcon] = useState(faCopy);

    const clearIcon = () =>
        setTimeout(() => {
            setIcon(faCopy);
        }, CLEAR_ICON_TIMEOUT);

    // Copy to clipboard
    const copyToClipboard = () =>
        navigator.clipboard
            .writeText(JSON.stringify(props.position))
            .then(
                () => {
                    setIcon(faCheck);
                },
                (err) => {
                    setIcon(faTriangleExclamation);
                },
            )
            .finally(() => {
                clearIcon();
            });

    return (
        <button className={styles.button} onClick={copyToClipboard}>
            <FontAwesomeIcon icon={icon} />
        </button>
    );
};

export default copyToClipboard;
