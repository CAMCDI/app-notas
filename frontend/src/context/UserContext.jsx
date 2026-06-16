import { createContext, useContext, useState } from 'react'
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [esPremium, setEsPremium] = useState(false);

  return (
    <UserContext.Provider value={{ usuario, setUsuario, esPremium, setEsPremium }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)