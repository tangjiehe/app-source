import { useState } from 'react';
import cssClassName from '../../utility/cssClassName';
import './Accordion.scss';

interface IProps {
    defaultExpanded?: boolean;
    header: string;
    children?: any;
}


export function Accordion({ defaultExpanded, header, children }: IProps) {
    const [expanded, setExpanded] = useState(defaultExpanded);

    const onToggleAccordion = () => setExpanded(prev => !prev);

    return <div className={'component-accordion'}>
        <div className='header' onClick={onToggleAccordion}>
            <span className='header-text'>{header}</span>
            <div className='toggle'>
                <i style={{ fontSize: '24px' }} className={cssClassName('fa', 'fa-angle-right', 'toggle', { expanded })} ></i>
            </div>
        </div>
        <div className={cssClassName('collapsible-content', { expanded })}>
            {children}
        </div>
    </div>
};