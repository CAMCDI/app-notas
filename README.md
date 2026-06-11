# 📋 App notas

Aplicación de notas con frontend en **React** y backend con **SQLite**.

---

## 📌 Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

| Herramienta | Versión mínima | Cómo verificar |
|-------------|---------------|-----------------|
| **Node.js**  | v18 o superior | `node --version` |
| **npm**      | v9 o superior  | `npm --version`  |
| **Git**      | cualquiera     | `git --version`  |

> Si no tienes Node.js instalado, descárgalo desde: https://nodejs.org/

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/app-agenda.git
cd app-agenda
```

### 2. Instalar dependencias del Frontend

```bash
cd frontend
npm install
```

> Esto instalará automáticamente todas las dependencias necesarias (React, Vite, Tailwind CSS, Axios, etc.) que están listadas en el archivo `package.json`.

---

## ▶️ Ejecución

### Iniciar el Frontend (modo desarrollo)

```bash
cd frontend
npm run dev
```

Esto abrirá la aplicación en: **http://localhost:5173**

---

## 📁 Estructura del Proyecto

```
app-notas/
├── frontend/              # Aplicación React + Vite
│   ├── src/               # Código fuente
│   │   ├── App.jsx        # Componente principal
│   │   ├── main.jsx       # Punto de entrada
│   │   └── index.css      # Estilos globales
│   ├── package.json       # Dependencias del frontend
│   ├── vite.config.js     # Configuración de Vite
│   └── index.html         # HTML principal
│
├── backend/               # API / Servidor
│   ├── config/            # Configuración
│   ├── controllers/       # Controladores
│   ├── models/            # Modelos de datos
│   ├── routes/            # Rutas de la API
│   └── database.sqlite    # Base de datos SQLite
│
└── README.md              # Este archivo
```

---

## 🛠️ Tecnologías Utilizadas

- **React 19** — Librería de interfaces de usuario
- **Vite** — Bundler rápido para desarrollo
- **Tailwind CSS 4** — Framework de estilos utilitarios
- **Axios** — Cliente HTTP para peticiones a la API
- **SQLite** — Base de datos ligera

---


