import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Test from '../pages/test'



function Routing() {
  return (
    <Routes>

      <Route path="/" element={<Test />} />
      
    </Routes>
  )
}

export default Routing
