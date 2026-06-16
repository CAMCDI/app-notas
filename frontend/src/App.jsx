import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Notas from './pages/Notas'
import Pago from './pages/Pago'

const App = () => {
  return (
    <>
      <Toaster position="bottom-left" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/notas" element={<Notas />} />
        <Route path="/pago" element={<Pago />} />
      </Routes>
    </>
  )
}

export default App