import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import Home from '@/pages/Home'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/register' element={<Register/>} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App