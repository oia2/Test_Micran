import React, { useState, useEffect, useMemo, useCallback } from 'react'; 
import { useTable, usePagination, useSortBy } from 'react-table';
import cl from './TableRecentEvents.module.scss';

//Функция для парсинга даты
const parseDate = dateString => {
    const parts = dateString.split('-');
    return new Date(parts[2], parts[1] - 1, parts[0]);
};

export default function TableRecentEvents() {
    const columns = useMemo(() => [
        {
            Header: 'Дата',
            accessor: 'date',
            width: 101
        },
        {
            Header: 'Время',
            accessor: 'time',
            width: 70,
        },
        {
            Header: 'Событие',
            accessor: 'event',
            width: 300,
        },
        {
            Header: 'Тип события',
            accessor: 'type',
            width: 122,
        }
    ], []); 

    const [data, setData] = useState([]); //Состояние с данными
    const [eventTypeFilter, setEventTypeFilter] = useState(''); // Состояние для фильтра по типу события
    const [dateFrom, setDateFrom] = useState(''); // Состояние для фильтра "Дата с"
    const [dateTo, setDateTo] = useState('');   // Состояние для фильтра "Дата по"
    const [pageIndex, setPageIndex] = useState(0); // Сохраняем текущий индекс страницы


    //Запрос на сервер
    const fetchRecentEvents = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8000/recent_events', {
                method: 'get'
            });
            const recentEvents = await response.json();

            //Проверка на новые данные
            if (JSON.stringify(recentEvents.events) !== JSON.stringify(data)) {
                setData(recentEvents.events);
            }
        } catch (e) {
            console.log(`Ошибка при получении данных: ${e}`);
        }
    }, [data]);  // Используем useCallback, чтобы мемоизировать функцию

    //Запрос на сервер 1 раз в 3 секунды, при размантировании интервал очищается, при загрузке страницы, функция вызывается сразу
    useEffect(() => {
        fetchRecentEvents();
        const intervalId = setInterval(fetchRecentEvents, 3000);
        return () => clearInterval(intervalId);
    }, [fetchRecentEvents]);

    // Фильтрация данных на основе типа события и диапазона дат
    const filteredData = useMemo(() => {
        return data.filter(event => {
            const eventDate = parseDate(event.date);

            // Фильтрация по типу события
            if (eventTypeFilter && event.type !== eventTypeFilter) return false;

            // Фильтрация по диапазону дат
            if (dateFrom && eventDate < new Date(dateFrom)) return false;
            if (dateTo && eventDate > new Date(dateTo)) return false;

            return true;
        });
    }, [data, eventTypeFilter, dateFrom, dateTo]);


    //Инициализация таблицы
    const tableInstance = useTable({
        columns,
        data: filteredData,
        initialState: { pageSize: 10, pageIndex }, //количество строк на 1 странице и текущий индекс
        autoResetSortBy: false
    },
        useSortBy,
        usePagination);

    const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow,
        canPreviousPage, canNextPage, pageCount, gotoPage, nextPage, previousPage,
        setPageSize, state } = tableInstance;

    // Сохраняем текущую страницу при её изменении
    useEffect(() => {
        setPageIndex(state.pageIndex);
    }, [state.pageIndex]);

    return (
        <div className={cl.table}>
            <h2 className={cl.table__title}>Таблица событий</h2>
            <div className={cl.table__body}>
                <div className={cl.table__body_container} >
                    <table {...getTableProps()}>
                        <thead>
                            {headerGroups.map((headerGroup) => {
                                const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
                                return (
                                    <tr key={key} {...restHeaderGroupProps}>
                                        {headerGroup.headers.map((column) => {
                                            const { key: columnKey, ...restColumnProps } = column.getHeaderProps(column.getSortByToggleProps());
                                            return (
                                                <th 
                                                key={columnKey} 
                                                {...restColumnProps}
                                                style={{ width: column.width }}
                                                >
                                                    {column.render('Header')}
                                                </th>
                                            )
                                        })}
                                    </tr>
                                )})}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map((row, i) => {
                                prepareRow(row);
                                const { key: rowKey, ...restRowProps } = row.getRowProps(); 
                                return (
                                    <tr key={rowKey} {...restRowProps}>
                                        {row.cells.map((cell) => {
                                            const { key: cellKey, ...restCellProps } = cell.getCellProps(); 
                                            return (
                                                <td 
                                                    key={cellKey} 
                                                    {...restCellProps} 
                                                    style={{ width: cell.column.width }}
                                                >
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className={cl.table__pagination}>
                        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        {"<<"}
                        </button>
                        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {"<"}
                        </button>
                        <span>
                        Страница {" "}
                        <strong>
                            {state.pageIndex + 1}
                            </strong> {" "}
                            из
                            {" "} <strong>
                            {pageCount}
                            </strong>
                        </span>
                        <button onClick={() => nextPage()} disabled={!canNextPage}>
                        {">"}
                        </button>
                        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        {">>"}
                        </button> 
                        <span>
                        | Перейти на:
                        </span>
                        <input
                            min="1" max={pageCount}
                            className={cl.table__pagination_input}
                            type="number"
                            defaultValue={state.pageIndex + 1}
                            onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(page);
                            }}
                        />
                    </div>
                </div>
                <div className={cl.table__filters}>
                    <h3>Фильтры</h3>
                    <div className={cl.filters__show}>
                        <span>Показать:</span>
                        <select
                            value={state.pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                            }}
                        >
                        {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                            {pageSize}
                            </option>
                        ))}
                        </select>
                    </div>
                    <div className={cl.filters__show}>
                        <span>Тип события:</span>
                        <select
                            value={eventTypeFilter}
                            onChange={(e) => setEventTypeFilter(e.target.value)}
                        >
                        <option value=''>все</option>
                        {["info", "warning", "critical"].map((type) => (
                            <option key={type} value={type}>
                            {type}
                            </option>
                        ))}
                        </select>
                    </div>
                    <div className={cl.filters__show}>
                        <span>Дата с:</span>
                        <input 
                            type="date" 
                            value={dateFrom} 
                            onChange={(e) => setDateFrom(e.target.value)} 
                        />
                    </div>
                    <div className={cl.filters__show}>
                        <span>Дата по:</span>
                        <input 
                            type="date" 
                            value={dateTo} 
                            onChange={(e) => setDateTo(e.target.value)} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
