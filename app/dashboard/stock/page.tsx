import { StockOverview } from '@/components/stock/StockOverview'
import React from 'react'

const stock = () => {
  return (
    <div className='p-6'>
      <h1 className='text-xl font-semibold mb-4'>แสดงภาพรวม</h1>
      <StockOverview />
    </div>
  )
}

export default stock
