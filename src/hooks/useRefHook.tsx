import { useRef, useCallback } from 'react';

export function useRefHook(target: HTMLElement) {
    const ref = useRef(null)
    const setRef = useCallback(node => {
        if (node) {
            const documentHeight = Math.max(
                document.body.scrollHeight, document.documentElement.scrollHeight,
                document.body.offsetHeight, document.documentElement.offsetHeight,
                document.body.clientHeight, document.documentElement.clientHeight
            );
            const nodeHeight = node.offsetHeight;
            node.focus();
            const rect = target.getBoundingClientRect();
            const left = rect.left, top = rect.top;
            const positionX = left + window.pageXOffset;
            let positionY = top + window.pageYOffset + target.offsetHeight;

            const flip = positionY + nodeHeight > documentHeight;

            if (flip) {
                positionY -= target.offsetHeight + nodeHeight;
                node.style.transform = 'translate(-50%, 50%) scale(0)';
            }
            node.style.left = positionX + 'px';
            node.style.top = positionY + 'px';
        };
        ref.current = node;
    }, [target]);

    return [setRef];
}