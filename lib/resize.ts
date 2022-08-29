import { useEffect, useState } from 'react';

// Debounce function
const debounce = function (fn: Function, ms: number) {
    let timerId: ReturnType<typeof setTimeout> | null;
    return () => {
        clearTimeout(timerId ?? 0);
        timerId = setTimeout(() => {
            timerId = null;
            fn();
        }, ms);
    };
};

const useResize = () => {
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    });

    useEffect(() => {
        const debouncedHandleResize = debounce(() => {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth,
            });
        }, 500);

        // Change state on resize
        window.addEventListener('resize', debouncedHandleResize);
        return () => {
            window.removeEventListener('resize', debouncedHandleResize);
        };
    }, []);

    return {
        dimensions,
    };
};

export default useResize;
