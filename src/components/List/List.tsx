import cssClassName from '../../utility/cssClassName';
import './List.scss';

interface Item {
    value: string;
    label: string;
    active: boolean;
}

interface IProps {
    items: Array<Item>;
    onSelect: (item: string) => void;
}

export function List({ items, onSelect }: IProps) {
    return (
        <div className="component-list">
            <ul className="list">
                {items.map(({ value, label, active }) => {
                    return <li
                        key={value}
                        className={cssClassName('list-item', { active })}
                        onClick={() => { if (!active) { onSelect(value) } }}>
                        {label}
                    </li>
                })}
            </ul>
        </div>
    )
}