import React, { useState } from 'react';
import cl from './ObjectForm.module.scss';

export default function ObjectForm({ objectData, fetchObjects, setServerResponse, setIsResponseVisible, closeUpdateForm }) {
    // Инициализация состояния формы с данными переданного объекта
    const [formData, setFormData] = useState(objectData);

    // Состояние для отслеживания ошибок в полях формы
    const [errors, setErrors] = useState({
        object_name: false,
        object_description: false,
    });

    // Обработчик изменения полей формы
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value  // Обновляем соответствующее поле в состоянии
        }));

        // Сбрасываем ошибку для конкретного поля при изменении его значения
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: false
        }));
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы при отправке

        // Проверка на наличие ошибок в полях "Имя" и "Описание"
        const newErrors = {
            object_name: formData.object_name === '',  // Имя объекта не должно быть пустым
            object_description: formData.object_description === '', // Описание объекта не должно быть пустым
        };

        // Если есть ошибки, устанавливаем их и останавливаем отправку
        if (newErrors.object_name || newErrors.object_description) {
            setErrors(newErrors);
            return;
        }

        // Собираем только измененные поля для отправки на сервер
        const updatedFields = {};

        if (formData.object_name !== objectData.object_name) {
            updatedFields.object_name = formData.object_name;
        }
        if (formData.object_type !== objectData.object_type) {
            updatedFields.object_type = formData.object_type;
        }
        if (formData.object_description !== objectData.object_description) {
            updatedFields.object_description = formData.object_description;
        }

        // Если нет изменений, просто закрываем форму
        if (Object.keys(updatedFields).length === 0) {
            closeUpdateForm();
            return;
        }

        // Формируем тело запроса для обновления объекта
        const requestBody = {
            operation_type: "update", 
            data: {
                object_id: formData.object_id,  
                ...updatedFields  // О
            }
        };

        try {
            // Отправляем запрос на сервер
            const response = await fetch('http://localhost:8000/manage_object', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody) 
            });

            const result = await response.json();  // Получаем ответ от сервера
            setServerResponse(result);  // Сохраняем ответ от сервера
            setIsResponseVisible(true); // Показываем пользователю окно с результатом
            closeUpdateForm(); // Закрываем форму обновления после завершения операции

            fetchObjects();  // Обновляем список объектов после успешного обновления
        } catch (error) {
            console.log('Ошибка при обновлении объекта:', error);
        }
    };

    // Обработчик для удаления объекта
    const handleDelete = async () => {
        const requestBody = {
            operation_type: "delete", 
            data: {
                object_id: formData.object_id 
            }
        };

        try {
            // Отправляем запрос на сервер для удаления объекта
            const response = await fetch('http://localhost:8000/manage_object', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody) 
            });

            const result = await response.json();  // Получаем ответ от сервера
            setServerResponse(result);  // Сохраняем ответ сервера
            setIsResponseVisible(true); // Показываем окно с ответом
            closeUpdateForm();  // Закрываем форму обновления

            fetchObjects();  // Обновляем список объектов после удаления
        } catch (error) {
            console.log('Ошибка при удалении объекта:', error); 
        }
    };
    return (
        <form className={cl.form} onSubmit={handleSubmit}>
            <h3>Редактирование объекта</h3>
            <div className={cl.form__field}>
                <label>ID: </label>
                <input
                    className={cl.field__number}
                    type='number'
                    name="object_id"
                    value={formData.object_id}
                    readOnly
                />
            </div>
            <div className={cl.form__field}>
                <label>Имя: </label>
                <input
                    className={`${cl.field__name} ${errors.object_name ? cl.error : ''}`}
                    type='text'
                    name="object_name"
                    value={formData.object_name}
                    onChange={handleChange}
                />
            </div>
            <div className={cl.form__field}>
                <label>Тип: </label>
                <select
                    className={cl.field__select}
                    name="object_type"
                    value={formData.object_type}
                    onChange={handleChange}
                >
                    {["EMS", "Network node", "Data Element SNMP"].map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>
            <div className={cl.form__field_text}>
                <label>Описание: </label>
                <textarea
                    className={`${cl.field__description} ${errors.object_description ? cl.error : ''}`}
                    name="object_description"
                    value={formData.object_description}
                    onChange={handleChange}
                />
            </div>
            <div className={cl.form__buttons}>
                <button type="submit" className={cl.button__save}>Сохранить</button>
                <button type="button" className={cl.button__delete} onClick={handleDelete}>Удалить</button>
            </div>
        </form>
    );
}
