/**
 * @jest-environment jsdom
 */

import { render, screen, cleanup } from '@testing-library/react';
import Controls from '../components/Controls';
import userEvent from '@testing-library/user-event';
import { EControls } from '../types';

const left = jest.fn();
const right = jest.fn();
const up = jest.fn();
const down = jest.fn();
const play = jest.fn();
const pause = jest.fn();

const isPaused = true;

const actions = {
    left,
    right,
    up,
    down,
    play,
    pause,
};

afterEach(() => {
    cleanup();
});

describe('', () => {
    it('shows play button if is paused', async () => {
        render(<Controls actions={actions} isPaused={isPaused} />);
        const divElement = screen.getByTestId('play');
        await userEvent.click(divElement);

        const pauseElement = screen.queryByTestId('pause');
        expect(pauseElement).toBe(null);

        expect(divElement).toBeDefined();
        expect(play).toHaveBeenCalled();
    });

    it('shows paused button if is not paused', async () => {
        render(<Controls actions={actions} isPaused={false} />);
        const divElement = screen.getByTestId('pause');
        await userEvent.click(divElement);

        const playElement = screen.queryByTestId('play');
        expect(playElement).toBe(null);

        expect(divElement).toBeDefined();
        expect(pause).toHaveBeenCalled();
    });

    it('triggers correct control action', async () => {
        render(<Controls actions={actions} isPaused={isPaused} />);
        Object.values(EControls)
            .filter((control) => control !== EControls.PLAY && control !== EControls.PAUSE)
            .forEach(async (control) => {
                const divElement = screen.getByTestId(control);
                await userEvent.click(divElement);

                expect(divElement).toBeDefined();
                expect(actions[control]).toHaveBeenCalled();
            });
    });
});
