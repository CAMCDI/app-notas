# App Notas

Aplicación de notas con frontend en React y backend en PHP con SQLite.

---

## Requisitos Previos

Antes de empezar, asegúrese de tener instalados los siguientes componentes en su sistema.

### Frontend
- **Node.js** (v18 o superior)
- **npm** (v9 o superior)

### Backend (PHP y SQLite)
- **PHP** (v8.0 o superior recomendado)
- **Extensiones de PHP requeridas:**
  - `sqlite3`
  - `pdo_sqlite` (opcional, dependiendo de la implementación interna)
  - `json` (generalmente incluida por defecto)
  - `session` (generalmente incluida por defecto)

Para sistemas basados en Ubuntu/Debian, puede instalar los requerimientos del backend ejecutando el siguiente comando:

```bash
sudo apt update
sudo apt install php php-sqlite3 php-cli php-json php-mbstring
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/app-notas.git
cd app-notas
```

### 2. Instalar dependencias del Frontend

```bash
cd frontend
npm install
```
Esto instalará todas las dependencias necesarias definidas en el archivo `package.json` (como React, Vite, Tailwind CSS y Axios).

---

## Ejecución

Para iniciar el entorno de desarrollo completo, es necesario ejecutar tanto el backend como el frontend.

### 1. Iniciar el Backend

Abra una terminal, diríjase a la carpeta del backend y levante el servidor integrado de desarrollo de PHP:

```bash
cd backend
php -S localhost:8000 index.php
```
El backend estará escuchando peticiones en `http://localhost:8000`.

### 2. Iniciar el Frontend

Abra una nueva terminal independiente, diríjase a la carpeta del frontend y ejecute el servidor de desarrollo:

```bash
cd frontend
npm run dev
```
El frontend estará disponible típicamente en `http://localhost:5173`.

---

## Estructura del Proyecto

```text
app-notas/
├── frontend/              # Aplicación React + Vite
│   ├── src/               # Código fuente
│   ├── package.json       # Dependencias del frontend
│   └── vite.config.js     # Configuración de Vite
│
├── backend/               # API / Servidor (PHP)
│   ├── config/            # Configuración
│   ├── controllers/       # Controladores
│   ├── models/            # Modelos de datos
│   ├── routes/            # Rutas de la API
│   ├── index.php          # Punto de entrada de la API
│   └── database.sqlite    # Base de datos SQLite
│
└── README.md              # Documentación del proyecto
```

---

## Tecnologías Utilizadas

- **Frontend:** React 19, Vite, Tailwind CSS 4, Axios
- **Backend:** PHP nativo
- **Base de Datos:** SQLite
