import React from 'react'
import Layout from '../layout/Layout'
import CPUUsageChart from '../../compnents/Char/CPUUsageChart'
import TableRecentEvents from '../../compnents/TableRecrentEvents/TableRecentEvents'

export default function HomePage() {
  //Главная страница состоит из графика и таблицы эвентов
  return (
    <Layout>    
        <CPUUsageChart></CPUUsageChart>
        <TableRecentEvents></TableRecentEvents>
    </Layout>
  )
}
