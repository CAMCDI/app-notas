
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { API_URL } from '../config';

export const useNotas = (setEsPremium) => {
  const [notas, setNotas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const cargarNotas = async () => {
    try {
      const res = await fetch(`${API_URL}/notas`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setNotas(data);
      }
    } catch (error) {
      toast.error('Error al cargar notas');
    }
  };

  const cargarPremium = async () => {
    try {
      const res = await fetch(`${API_URL}/es-premium`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setEsPremium(data.premium);
      }
    } catch (error) {
      toast.error('Error al verificar premium');
    }
  };

  useEffect(() => {
    cargarPremium();
    cargarNotas();
  }, []);

  const crearNota = async (datos) => {
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/nota/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(datos)
      });
      const data = await res.json();
      if (res.status === 402) {
        toast.error('Límite de 5 notas. Hazte premium.');
        navigate('/pago');
        return false;
      }
      if (!res.ok) {
        toast.error(data.error || 'Error al crear');
        return false;
      }
      toast.success('Nota creada');
      await cargarNotas();
      return true;
    } catch (error) {
      toast.error('Error al crear');
      return false;
    } finally {
      setCargando(false);
    }
  };

  const actualizarNota = async (id, campos) => {
    try {
      const res = await fetch(`${API_URL}/nota/actualizar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, ...campos })
      });
      if (res.ok) {
        toast.success('Nota actualizada');
        await cargarNotas();
        return true;
      }
      toast.error('Error al actualizar');
      return false;
    } catch (error) {
      toast.error('Error al actualizar');
      return false;
    }
  };

  const eliminarNota = async (id) => {
    try {
      const res = await fetch(`${API_URL}/nota/eliminar`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        toast.success('Nota eliminada');
        await cargarNotas();
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Error al eliminar');
      return false;
    }
  };

  const toggleFavorito = async (nota) => {
    const nuevoEstado = !nota.es_favorito;
    try {
      const res = await fetch(`${API_URL}/nota/actualizar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: nota.id, es_favorito: nuevoEstado ? 1 : 0 })
      });
      if (res.ok) {
        if (nuevoEstado) {
          toast.success('Nota agregada a favoritos');
        } else {
          toast.success('Nota eliminada de favoritos');
        }
        await cargarNotas();
        return true;
      }
      toast.error('Error al actualizar favorito');
      return false;
    } catch (error) {
      toast.error('Error al actualizar favorito');
      return false;
    }
  };

  return {
    notas,
    cargando,
    crearNota,
    actualizarNota,
    eliminarNota,
    toggleFavorito,
    cargarNotas
  };
};
