
import './Popover.scss';

interface IProps {
    target: HTMLElement;
    children?: any;
}

export function Popover({ children, target }: IProps) {

    const getTargetPosition = (target: HTMLElement) => {
        const rect = target.getBoundingClientRect();
        const left = rect.left, top = rect.top;
        return {
            positionX: left + window.pageXOffset,
            positionY: top + window.pageYOffset + target.offsetHeight
        }
    };

    const { positionX, positionY } = getTargetPosition(target);

    return (
        <div className="component-popover" style={{ left: positionX, top: positionY }}>
            {children}
        </div>
    )
}