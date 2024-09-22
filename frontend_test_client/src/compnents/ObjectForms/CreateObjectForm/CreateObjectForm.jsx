import React, { useState } from 'react';
import cl from '../ObjectFrom/ObjectForm.module.scss';

export default function CreateObjectForm({ fetchObjects, setServerResponse, setIsResponseVisible }) {
    // Состояния для управления формой и ошибками валидации
    const [formData, setFormData] = useState({
        object_name: '',
        object_type: 'EMS',
        object_description: ''
    });

    const [errors, setErrors] = useState({
        object_name: false,
        object_description: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));

        // Сбрасываем ошибку при изменении данных
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: false
        }));
    };

    //Отправка запроса на сервер
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверяем поля на пустоту
        const newErrors = {
            object_name: formData.object_name === '',
            object_description: formData.object_description === '',
        };

        if (newErrors.object_name || newErrors.object_description) {
            setErrors(newErrors);
            return; // Останавливаем отправку, если есть ошибки
        }
        
        //Тело запроса
        const requestBody = {
            operation_type: "insert",
            data: {
                object_name: formData.object_name,
                object_type: formData.object_type,
                object_description: formData.object_description
            }
        };

        try {
            const response = await fetch('http://localhost:8000/manage_object', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();
            setServerResponse(result);
            setIsResponseVisible(true);

            fetchObjects();
        } catch (error) {
            console.log('Ошибка при создании объекта:', error);
        }
    };

    return (
        <form className={cl.form} onSubmit={handleSubmit}>
            <h3>Создание нового объекта</h3>
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
                <button type="submit" className={cl.button__save}>Принять</button>
            </div>
        </form>
    );
}
