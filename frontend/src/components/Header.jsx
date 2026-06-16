import { NotebookPen, Star} from 'lucide-react'
import { useNavigate } from 'react-router-dom'


const Header = ({ onCerrarSesion, premium}) => {
  const navigate = useNavigate()

  return (
    <header className="flex items-center justify-between p-4 bg-neutral-900 border-b border-neutral-600">
      <div className="flex items-center gap-2">
        <NotebookPen size={38} strokeWidth={1.75} className="text-amber-600"/>
        <h1 className="text-2xl font-bold text-amber-600">Note App</h1>
        {premium && <span className="text-amber-500 fill-amber-500"><Star size={20} strokeWidth={1.75} />Premium</span>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/pago')}
          className="text-md text-neutral-300 bg-neutral-700 border border-neutral-500 rounded-xl px-3 py-1
                     hover:bg-amber-600 hover:border-amber-600 transition-colors flex items-center gap-2">
          <Star size={15} strokeWidth={1.75} className="text-amber-500 fill-amber-500" /> Premium
        </button>

        {/* Botón cerrar sesión — se pone rojo al pasar el cursor */}
        <button
          onClick={onCerrarSesion}
          className="text-md text-neutral-300 bg-amber-700 border border-transparent rounded-xl px-3 py-1
                     hover:bg-red-600 hover:border-red-600 transition-colors">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Header;