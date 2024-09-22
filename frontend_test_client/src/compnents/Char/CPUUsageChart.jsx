import React, {useEffect, useState } from 'react';
import cl from "./CPUUsageChart.module.scss"
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip} from 'chart.js';

//Явно указываем элементы графика
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);


const CPUUsageChart = () => {
  const [cpuUsageData, setCpuUsageData] = useState({
    labels: Array(60).fill(''), // 60 знаений по оси x (60 сек)
    datasets: [
      {
        label: 'Используется %',
        borderColor: '#05c3de',
        borderWidth: 1,
        fill: false,
        tension: 0.1,
        data: [] //Точки на графике
      },
    ],
  });

  const options = {
    responsive: true, //График адаптивный, подстраивается под контейнер
    scales: {
      x: {
        display: false,  //Отлючаем вертикальные линии в сетке
      },
      y: {
        beginAtZero: true, // Начало с 0
        max: 100, // Ограничение до 100%
        ticks: {
          callback: (value) => `${value}%`, // Процентный формат
        },
      },
    },
    animation: {
      duration: 0, // Отключаем анимацию для старых точек
    }

  };

  //Запрос на сервер
  const fetchCPUUsage = async () => {
    try {
      const response = await fetch('http://localhost:8000/current_cpu_usage',
        {
          method: 'get'
        }
      );
      const data = await response.json()
      //Обновляем состояние с данными
      setCpuUsageData((prevData) => {
        const updateData = [...prevData.datasets[0].data, data.cpu_usage]
        //Если точек больше 60, то 1 элемент массива удаляется
        if (updateData.length > 60) {
          updateData.splice(0, 1);
        }
        return {
          labels: prevData.labels,
          datasets: [
            {
              ...prevData.datasets[0],
              
              data: updateData,
            },
          ],
        };
      });
      
    } catch (e) {
      console.log(`Ошибка при получении данных с CPU: ${e}`)
    }
  }

  //Запрос на сервер 1 раз в секунду, при размантировании интервал очищается
  useEffect(() => {const intervalId = setInterval(fetchCPUUsage, 1000);
    return () => clearInterval(intervalId); 
  },
  []
)

  return (
    <div className={cl.char}>
      <h2 className={cl.char__title}>Загрузка ЦП</h2>
      <Line data={cpuUsageData} options={options} />
    </div>
  );
};

export default CPUUsageChart;