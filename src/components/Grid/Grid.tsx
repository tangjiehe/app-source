import { useReducer } from 'react';
import ReactDOM from 'react-dom';
import { List, Popover } from '../';
import cssClassName from '../../utility/cssClassName';
import './Grid.scss';

interface Header {
    name: string;
    label: string;
    sortable?: boolean;
}

interface Column {
    name: string;
    value: string;
    sortValue?: string;
}

interface IProps {
    gridHeaders: Array<Header>
    gridRows: Array<Array<Column>>
}

enum ACTION_TYPE {
    UPATE_PAGINATION_DATA = 'UPATE PAGINATION DATA',
    CHANGE_CUR_PAGE_INPUT = 'CHANGE_CUR_PAGE_INPUT',
    SET_POPOVER = 'SET_POPOVER',
    SET_SORTING = 'SET_SORTING'
}

const initialState = {
    popover: null,
    sorting: {}
}

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case ACTION_TYPE.UPATE_PAGINATION_DATA:
            return { ...state, ...action.paginationData };
        case ACTION_TYPE.CHANGE_CUR_PAGE_INPUT:
            return { ...state, curPageInput: action.curPageInput };
        case ACTION_TYPE.SET_POPOVER:
            return { ...state, popover: action.popover };
        case ACTION_TYPE.SET_SORTING:
            return { ...state, sorting: action.sorting }
        default:
            return { ...state };
    }
}

const getPaginationData = (curPage: number, rowPerPage: number, gridRows: Array<Array<Column>>) => {
    const totalPage = Math.ceil(gridRows.length / rowPerPage);
    const rowStart = (curPage - 1) * rowPerPage + 1;
    const rowEnd = Math.min(rowStart + rowPerPage - 1, gridRows.length);
    return {
        ...initialState,
        curPage,
        rowStart,
        rowEnd,
        rowPerPage,
        totalPage,
        curPageInput: curPage
    }
};

export function Grid({ gridHeaders, gridRows }: IProps) {
    const [{ curPage, curPageInput, popover, rowPerPage, rowStart, rowEnd, sorting, totalPage }, dispatch] = useReducer(reducer, getPaginationData(1, 5, gridRows));

    const goTo = (page: number) => {
        dispatch({
            type: ACTION_TYPE.UPATE_PAGINATION_DATA,
            paginationData: getPaginationData(page, rowPerPage, gridRows)
        });
    };

    const onChangeCurPage = (event: React.FormEvent<HTMLInputElement>): void => {
        const value = (event.target as HTMLInputElement).value;
        const curPage = parseInt(value);
        if (curPage && !isNaN(curPage) && curPage >= 1 && curPage <= totalPage) {
            dispatch({
                type: ACTION_TYPE.UPATE_PAGINATION_DATA,
                paginationData: getPaginationData(curPage, rowPerPage, gridRows)
            });
        } else {
            dispatch({
                type: ACTION_TYPE.CHANGE_CUR_PAGE_INPUT,
                curPageInput: value
            });
        }
    };

    const rowPerPageOptions = [
        { value: '5', label: '5 per page', active: rowPerPage === 5 },
        { value: '10', label: '10 per page', active: rowPerPage === 10 },
        { value: '25', label: '25 per page', active: rowPerPage === 25 },
        { value: '50', label: '50 per page', active: rowPerPage === 50 }
    ];

    const onChangeRowPerPage = (value: string) => {
        dispatch({
            type: ACTION_TYPE.UPATE_PAGINATION_DATA,
            paginationData: getPaginationData(1, +value, gridRows)
        });
    };

    const unmount = () => {
        dispatch({
            type: ACTION_TYPE.UPATE_PAGINATION_DATA,
            paginationData: getPaginationData(curPage, rowPerPage, gridRows)
        });
    };

    const triggerPopover = (event: any) => {
        const pp = popover ? null : ReactDOM.createPortal(<Popover target={event.target} unmount={unmount}>
            <List items={rowPerPageOptions} onSelect={onChangeRowPerPage} />
        </Popover>, document.body)
        dispatch({
            type: ACTION_TYPE.SET_POPOVER,
            popover: pp
        });
    };

    const getPagination = () => {
        return (
            <div className="pagination">
                <div className="action-item">
                    <span>
                        {`${rowStart}-${rowEnd} of ${gridRows.length}`}
                        <span>&nbsp;&nbsp;</span>
                        <i style={{ fontSize: '20px' }} className={cssClassName('fa', 'fa-caret-down', 'rowPerPageActn')} onClick={triggerPopover}></i>
                        {popover}
                    </span>
                    <span>&nbsp;&nbsp;</span>
                    <i style={{ fontSize: '20px' }}
                        className={cssClassName('fa', 'fa-angle-double-left', 'goTo', 'goToBeginning', { disabled: curPage === 1 })}
                        onClick={() => goTo(1)}></i>
                    <span>&nbsp;&nbsp;</span>
                    <i style={{ fontSize: '20px' }}
                        className={cssClassName('fa', 'fa-angle-left', 'goTo', 'goToPrevious', { disabled: curPage === 1 })}
                        onClick={() => goTo(Math.max(1, curPage - 1))}></i>
                    <span>&nbsp;&nbsp;</span>
                    <span><input className="curPage" type="text" value={curPageInput} onChange={onChangeCurPage}></input>{` of ${totalPage}`}</span>
                    <span>&nbsp;&nbsp;</span>
                    <i style={{ fontSize: '20px' }}
                        className={cssClassName('fa', 'fa-angle-right', 'goTo', 'goToNext', { disabled: curPage === totalPage })}
                        onClick={() => goTo(Math.min(curPage + 1, totalPage))} ></i>
                    <span>&nbsp;&nbsp;</span>
                    <i style={{ fontSize: '20px' }}
                        className={cssClassName('fa', 'fa-angle-double-right', 'goTo', 'goToEnd', { disabled: curPage === totalPage })}
                        onClick={() => goTo(totalPage)}></i>
                </div>
            </div>
        )
    };

    const getColumn = (columns: Array<Column>, rowIdx: number) => (header: Header, colIdx: number) => {
        const gridItem: any = columns.find(column => column['name'] === header.name);
        return <div
            className="grid-cell gird-row-cell"
            key={`grid-column-${rowIdx * gridHeaders.length + colIdx}`}>{gridItem?.value ?? '-'}
        </div>
    };

    const getRows = (columns: Array<Column>, rowIdx: number) => (<div className="grid-column-row" key={`grid-row-${rowIdx}`}>
        {
            gridHeaders.map(getColumn(columns, rowIdx))
        }
    </div>);

    const getGridHeaders = () => (
        <div className="grid-header-row">
            {gridHeaders.map((header, index) => {
                return (<div className="grid-cell grid-header-cell" key={`grid-header-${index}`}>
                    <div className='grid-header'>
                        <span>{header.label}</span>
                        {header.sortable
                            ? <div className="sort-container">
                                {sorting['method'] !== 'ascending' && <i style={{ fontSize: '16px' }}
                                    className={cssClassName('fa', 'fa-long-arrow-down', 'sort', 'sort-ascending', { active: header.name === sorting['column'] && sorting['method'] === 'ascending' })}
                                    onClick={() => dispatch({ type: ACTION_TYPE.SET_SORTING, sorting: { column: header.name, method: 'ascending' } })}></i>}
                                {sorting['method'] === 'ascending' && <i style={{ fontSize: '16px' }}
                                    className={cssClassName('fa', 'fa-long-arrow-up', 'sort', 'sort-descending', { active: header.name === sorting['column'] && sorting['method'] === 'descending' })}
                                    onClick={() => dispatch({ type: ACTION_TYPE.SET_SORTING, sorting: { column: header.name, method: 'descending' } })}></i>}
                            </div>
                            : null}
                    </div>
                </div>);
            })}
        </div >
    );

    const predicate = (columns: any, index: number) => {
        return index >= rowStart - 1 && index <= rowEnd - 1;
    };

    const comparator = (rowA: Array<Column>, rowB: Array<Column>) => {
        const column: string = sorting['column'];
        const method: string = sorting['method'];
        const columnA = rowA.find(col => col.name === column);
        const columnB = rowB.find(col => col.name === column);
        if (column && columnA?.['sortValue'] && columnB?.['sortValue']) {
            if (method === 'ascending') {
                return columnA['sortValue'] < columnB['sortValue'] ? -1 : 1;
            } else {
                return columnB['sortValue'] < columnA['sortValue'] ? -1 : 1;
            }
        }
        return 0;
    };

    const getGrid = () => (<div className="grid">
        {getGridHeaders()}
        {gridRows
            .filter(predicate)
            .sort(comparator)
            .map(getRows)}
    </div>);

    return (
        <div className="component-grid">
            {getGrid()}
            {getPagination()}
        </div>
    );
};