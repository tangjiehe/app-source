import { useRefHook } from '../../hooks/useRefHook';
import './Popover.scss';

interface IProps {
    target: HTMLElement;
    children?: any;
    unmount?: () => void;
    placement?: 'top' | 'bottom' | 'left' | 'right'
}

export function Popover({ children, target, unmount }: IProps) {
    const [ref] = useRefHook(target);

    return (
        <div
            tabIndex={-1}
            ref={ref}
            className="component-popover"
            onBlur={unmount}>
            <div>
                {children}
            </div>
        </ div>
    )
}