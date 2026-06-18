import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [esPremium, setEsPremium] = useState(false);
  const [tema, setTema] = useState('claro');

  useEffect(() => {
    if (tema === 'oscuro') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [tema]);
  const toggleTema = () => setTema(t => t === 'claro' ? 'oscuro' : 'claro');
  return (
    <UserContext.Provider value={{ usuario, setUsuario, esPremium, setEsPremium, tema, toggleTema }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)