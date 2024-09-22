import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useTable } from 'react-table';
import cl from './TableObjects.module.scss';
import ObjectForm from '../ObjectForms/ObjectFrom/ObjectForm';
import CreateObjectForm from '../ObjectForms/CreateObjectForm/CreateObjectForm';

export default function TableObjects() {
    const columns = useMemo(() => [
        {
            Header: 'ID',
            accessor: 'object_id',
            width: 44
        },
        {
            Header: 'Имя',
            accessor: 'object_name',
            width: 120
        },
        {
            Header: 'Тип',
            accessor: 'object_type',
            width: 155
        },
        {
            Header: 'Описание',
            accessor: 'object_description',
            width: 244
        }
    ], []); 

    const [data, setData] = useState([]);
    const [isUpdateVisible, setIsUpdateVisible] = useState(false); //  Для отображения окна обвновления
    const [isResponseVisible, setIsResponseVisible] = useState(false); // Для отображения окна ответа
    const [selectedObject, setSelectedObject] = useState(null); // Новое состояние для выбранного объекта
    const [serverResponse, setServerResponse] = useState(null); // Для хранения ответа от сервера

    const tableInstance = useTable({
        columns,
        data
    });
    
    // Запрос на сервер для получения объкетов
    const fetchObjects = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8000/objects_list', {
                method: 'get'
            });
            const fetchObjects = await response.json();

            setData(fetchObjects.objects);
        } catch (e) {
            console.log(`Ошибка при получении данных: ${e}`);
        }
    }, []);

    // При загрузке страницы загружаем объекты
    useEffect(() => {
        fetchObjects();
    }, [fetchObjects]);

    // Функция для показа модального окна и передачи данных объекта
    const handleRowClick = (row) => {
        setSelectedObject(row.original); // Передаем объект в состояние
        setIsUpdateVisible(true);
    };

    // Функция для закрытия модального окна обновления
    const handleCloseUpdate = () => {
        setIsUpdateVisible(false);
        setSelectedObject(null); // Сбрасываем выбранный объект
    };

    // Функция для закрытия модального окна с ответом от сервера
    const handleCloseResponse = () => {
        setIsResponseVisible(false);
    };

    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = tableInstance;

    return (
        <div className={cl.table}>
            <h2 className={cl.table__title}>Таблица объектов</h2>
            <div className={cl.table__body}>
                <div className={cl.table__body_container}>
                    <table {...getTableProps()}>
                        <thead>
                            {headerGroups.map((headerGroup) => {
                                const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
                                return (
                                    <tr key={key} {...restHeaderGroupProps}>
                                        {headerGroup.headers.map((column) => {
                                            const { key: columnKey, ...restColumnProps } = column.getHeaderProps();
                                            return (
                                                <th key={columnKey} {...restColumnProps}
                                                style={{ width: `${column.width}px` }}>
                                                    {column.render('Header')}
                                                </th>
                                            );
                                        })} 
                                    </tr>
                                );
                            })}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map((row) => {
                                prepareRow(row);
                                const { key: rowKey, ...restRowProps } = row.getRowProps();
                                return (
                                    <tr key={rowKey} {...restRowProps} onClick={() => handleRowClick(row)}>
                                        {row.cells.map((cell) => {
                                            const { key: cellKey, ...restCellProps } = cell.getCellProps();
                                            return (
                                                <td key={cellKey} {...restCellProps}
                                                style={{
                                                    width: `${cell.column.width}px`,
                                                    maxWidth: `${cell.column.width}px`
                                                }}>
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div>
                        <div className={`${cl.table__overlay} ${isUpdateVisible ? cl['table__overlay--visible'] : ''}`} onClick={handleCloseUpdate}></div>
                        <div className={`${cl.table__update} ${isUpdateVisible ? cl['table__update--visible'] : ''}`}>
                            {selectedObject && <ObjectForm objectData={selectedObject} fetchObjects={fetchObjects} setServerResponse={setServerResponse} setIsResponseVisible={setIsResponseVisible} closeUpdateForm={handleCloseUpdate} />}
                        </div>

                        <div className={`${cl.table__overlay} ${isResponseVisible ? cl['table__overlay--visible'] : ''}`} onClick={handleCloseResponse}></div>
                        <div className={`${cl.table__response} ${isResponseVisible ? cl['table__response--visible'] : ''}`}>
                            <h3>Ответ от сервера</h3>
                            <pre>{JSON.stringify(serverResponse, null, 2)}</pre>
                            <button onClick={handleCloseResponse}>OK</button>
                        </div>
                    </div>
                </div>
                <div className={cl.table__create}>
                    <CreateObjectForm fetchObjects={fetchObjects} setServerResponse={setServerResponse} setIsResponseVisible={setIsResponseVisible} />
                </div>
            </div>  
        </div>
    );
}
