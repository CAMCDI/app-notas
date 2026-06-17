import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Star, Calendar, Palette } from 'lucide-react';
import Header from '../components/Header';
import { useUser } from '../context/UserContext';
import { useNotas } from '../hooks/useNotas';
import toast from 'react-hot-toast';

const Notas = () => {
  const { usuario, setUsuario, esPremium, setEsPremium, tema } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titulo: '',
    contenido: '',
    color: '#ffffff',
    plantilla: 'apuntes',
    fecha_evento: '',
    es_favorito: false
  });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [editForm, setEditForm] = useState({});
  const { notas, cargando, crearNota, actualizarNota, eliminarNota, toggleFavorito } = useNotas(setEsPremium);

  const handleCrear = async (e) => {
    e.preventDefault();
    const datos = { ...form, es_favorito: form.es_favorito ? 1 : 0 };
    if (!esPremium) {
      delete datos.color;
      delete datos.plantilla;
      delete datos.fecha_evento;
    }
    const ok = await crearNota(datos);
    if (ok) {
      setForm({ titulo: '', contenido: '', color: '#ffffff', plantilla: 'apuntes', fecha_evento: '', es_favorito: false });
      setMostrarForm(false);
    }
  };

  const handleActualizar = async (id) => {
    const datos = { ...editForm, es_favorito: editForm.es_favorito ? 1 : 0 };
    if (!esPremium) {
      delete datos.color;
      delete datos.plantilla;
      delete datos.fecha_evento;
    }
    const ok = await actualizarNota(id, datos);
    if (ok) setEditando(null);
  };

  const cerrarSesion = async () => {
    await fetch('http://localhost:8000/logout', { method: 'POST', credentials: 'include' });
    setUsuario(null);
    navigate('/');
  };

  const getCardStyle = (color) => {
    if (!color || color === '#ffffff') {
      return tema === 'oscuro' ? {} : { backgroundColor: '#ffffff' };
    }
    if (tema === 'oscuro') {
      const darkColors = {
        '#fef08a': '#713f12',
        '#bfdbfe': '#1e3a5f',
      };
      return { backgroundColor: darkColors[color] || color };
    }
    return { backgroundColor: color };
  };

  const inputClasses = "rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 outline-none focus:border-amber-600 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:placeholder-neutral-400";

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 dark:bg-neutral-600">
      <Header onCerrarSesion={cerrarSesion} premium={esPremium} />
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
            Mis notas {esPremium && <span className="ml-2 text-amber-500 text-sm">⭐ Premium</span>}
          </h2>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700">
            <Plus size={16} /> Nueva nota
          </button>
        </div>

        {mostrarForm && (
          <form onSubmit={handleCrear} className="mb-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col gap-3 dark:bg-neutral-800 dark:border-neutral-700">
            <input
              type="text"
              placeholder="Título"
              value={form.titulo}
              onChange={e => setForm({ ...form, titulo: e.target.value })}
              className={inputClasses}
              required
            />
            <textarea
              placeholder="Contenido"
              value={form.contenido}
              onChange={e => setForm({ ...form, contenido: e.target.value })}
              rows={4}
              className={`${inputClasses} resize-none`}
              required
            />
            <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
              <input type="checkbox" checked={form.es_favorito} onChange={e => setForm({ ...form, es_favorito: e.target.checked })} className="accent-amber-600" />
              <Star size={16} className="text-amber-500" /> Favorito
            </label>
            {esPremium && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className={inputClasses}>
                  <option value="#ffffff">Blanco</option>
                  <option value="#fef08a">Amarillo</option>
                  <option value="#bfdbfe">Azul</option>
                </select>
                <select value={form.plantilla} onChange={e => setForm({ ...form, plantilla: e.target.value })} className={inputClasses}>
                  <option value="apuntes">Apuntes</option>
                  <option value="diario">Diario</option>
                  <option value="tareas">Tareas</option>
                  <option value="proyectos">Proyecto</option>
                </select>
                <input type="date" value={form.fecha_evento} onChange={e => setForm({ ...form, fecha_evento: e.target.value })} className={inputClasses} />
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setMostrarForm(false)} className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700">Cancelar</button>
              <button type="submit" disabled={cargando} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60">
                {cargando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        )}
        {notas.length === 0 ? (
          <p className="text-center text-neutral-400 mt-12">No tienes notas. ¡Crea una!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notas.map(nota => (
              <div
                key={nota.id}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm flex flex-col gap-2 dark:border-neutral-700 dark:bg-neutral-800"
                style={getCardStyle(nota.color)}>
                {editando === nota.id ? (
                  <>
                    <input type="text" value={editForm.titulo} onChange={e => setEditForm({ ...editForm, titulo: e.target.value })} className={inputClasses} />
                    <textarea value={editForm.contenido} onChange={e => setEditForm({ ...editForm, contenido: e.target.value })} rows={4} className={`${inputClasses} resize-none`} />
                    {esPremium && (
                      <div className="flex flex-col gap-2">
                        <select value={editForm.color} onChange={e => setEditForm({ ...editForm, color: e.target.value })} className="rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-white">
                          <option value="#f5f5f5d8">Blanco</option>
                          <option value="#fef08a">Amarillo</option>
                          <option value="#bfdbfe">Azul</option>
                        </select>
                        <select value={editForm.plantilla} onChange={e => setEditForm({ ...editForm, plantilla: e.target.value })} className="rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-white">
                          <option value="apuntes">Apuntes</option>
                          <option value="diario">Diario</option>
                          <option value="tareas">Tareas</option>
                          <option value="proyectos">Proyecto</option>
                        </select>
                        <input type="date" value={editForm.fecha_evento} onChange={e => setEditForm({ ...editForm, fecha_evento: e.target.value })} className="rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-white" />
                      </div>
                    )}
                    <div className="flex gap-2 justify-end mt-1">
                      <button onClick={() => setEditando(null)} className="rounded-lg border border-neutral-300 px-3 py-1 text-sm text-neutral-600 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700">Cancelar</button>
                      <button onClick={() => handleActualizar(nota.id)} className="rounded-lg bg-amber-600 px-3 py-1 text-sm font-semibold text-white hover:bg-amber-700">Guardar</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-neutral-800 dark:text-neutral-100">{nota.titulo}</h3>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => toggleFavorito(nota)} className="text-amber-400">
                          <Star size={18} className={nota.es_favorito ? 'fill-amber-500 text-amber-500' : ''} />
                        </button>
                        <button onClick={() => { setEditando(nota.id); setEditForm({ ...nota, es_favorito: !!nota.es_favorito }); }} className="text-neutral-600 dark:text-white hover:text-amber-600 text-sm">Editar</button>
                        <button onClick={() => eliminarNota(nota.id)} className="text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 whitespace-pre-wrap dark:text-neutral-300">{nota.contenido}</p>
                    {nota.plantilla && <div className="text-xs text-neutral-500 flex items-center gap-1 dark:text-neutral-400"><Palette size={12} /> {nota.plantilla}</div>}
                    {nota.fecha_evento && <div className="text-xs text-neutral-500 flex items-center gap-1 dark:text-neutral-400"><Calendar size={12} /> {nota.fecha_evento}</div>}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notas;