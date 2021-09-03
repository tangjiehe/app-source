import { useReducer } from 'react';
import ReactDOM from 'react-dom';
import { List, Popover } from '../';
import cssClassName from '../../utility/cssClassName';
import './Grid.scss';

interface Header {
    name: string;
    label: string;
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
    SET_POPOVER = 'SET_POPOVER'
}

const initialState = {
    popover: null
}

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case ACTION_TYPE.UPATE_PAGINATION_DATA:
            return { ...state, ...action.paginationData };
        case ACTION_TYPE.CHANGE_CUR_PAGE_INPUT:
            return { ...state, curPageInput: action.curPageInput };
        case ACTION_TYPE.SET_POPOVER:
            return { ...state, popover: action.popover };
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
    const [{ curPage, curPageInput, popover, rowPerPage, rowStart, rowEnd, totalPage }, dispatch] = useReducer(reducer, getPaginationData(1, 5, gridRows));
    const getGridHeaders = () => (
        <div className="grid-header-row">
            {gridHeaders.map(header => {
                return (<div className="grid-cell grid-header-cell">
                    {header.label}
                </div>);
            })}
        </div>
    );

    const predicate = (columns: any, index: number) => {
        return index >= rowStart - 1 && index <= rowEnd - 1;
    }

    const comparator = (rowA: Array<Column>, rowB: Array<Column>) => {
        return 0;
    }

    const getgridRows = () => {
        return (<>
            {
                gridRows
                    .filter(predicate)
                    .sort(comparator)
                    .map(columns => {
                        return (<div className="grid-column-row">
                            {
                                gridHeaders.map(header => {
                                    const gridItem: any = columns.find(column => column['name'] === header.name);
                                    return <div className="grid-cell gird-row-cell">{gridItem?.value}</div>
                                })
                            }
                        </div>);
                    })
            }
        </>)
    };

    const goPrevious = () => {
        dispatch({
            type: ACTION_TYPE.UPATE_PAGINATION_DATA,
            paginationData: getPaginationData(Math.max(1, curPage - 1), rowPerPage, gridRows)
        });
    };

    const goNext = () => {
        dispatch({
            type: ACTION_TYPE.UPATE_PAGINATION_DATA,
            paginationData: getPaginationData(Math.min(curPage + 1, totalPage), rowPerPage, gridRows)
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
            paginationData: getPaginationData(1, parseInt(value), gridRows)
        })
    };

    const triggerPopover = (event: any) => {
        const pp = popover ? null : ReactDOM.createPortal(<Popover target={event.target}>
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
                    <i style={{ fontSize: '20px' }} className={cssClassName('fa', 'fa-angle-double-left')} ></i>
                    <span>&nbsp;&nbsp;</span>
                    <i style={{ fontSize: '20px' }} className={cssClassName('fa', 'fa-angle-left', 'goPrevious')} onClick={goPrevious}></i>
                    <span>&nbsp;&nbsp;</span>
                    <span><input className="curPage" type="text" value={curPageInput} onChange={onChangeCurPage}></input>{` of ${totalPage}`}</span>
                    <span>&nbsp;&nbsp;</span>
                    <i style={{ fontSize: '20px' }} className={cssClassName('fa', 'fa-angle-right', 'goNext')} onClick={goNext} ></i>
                    <span>&nbsp;&nbsp;</span>
                    <i style={{ fontSize: '20px' }} className={cssClassName('fa', 'fa-angle-double-right')} ></i>
                </div>
            </div>
        )
    };

    const getGrid = () => (<div className="grid">
        {getGridHeaders()}
        {getgridRows()}
    </div>);

    return (
        <div className="component-grid">
            {getGrid()}
            {getPagination()}
        </div>
    );
};