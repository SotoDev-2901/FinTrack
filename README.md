# FinTrack 💰

## Información del Proyecto

**Materia:** Electiva 1  
**Nombre del Proyecto:** FinTrack  
**Integrantes:**
- Luis Felipe Soto Palacios
- Juan Pablo Gómez Torres

---

## Descripción

FinTrack es una aplicación web moderna desarrollada con **React + TypeScript** para el seguimiento integral de finanzas personales. Permite a los usuarios gestionar sus ingresos, gastos, establecer metas financieras y visualizar estadísticas en tiempo real a través de una interfaz intuitiva y atractiva.

La aplicación está diseñada para facilitar el control financiero personal mediante herramientas de análisis, categorización y seguimiento de objetivos, todo sincronizado en la nube con **Firebase**.

---

## ✨ Funcionalidades Principales

### 📊 Panel de Control (Dashboard)
- Visualización del balance total
- Estadísticas de ingresos y gastos de los últimos 30 días
- Gráfico de barras por categorías (gastos e ingresos)
- Gráfico de evolución del saldo de los últimos 6 meses
- Actualización en tiempo real

### 💸 Gestión de Transacciones
- Registro de ingresos y gastos
- Asignación de categorías personalizadas
- Descripción y fecha de cada transacción
- Filtrado y búsqueda de transacciones
- Edición y eliminación de registros

### 🗂️ Categorías Personalizadas
- Creación de categorías de ingresos y gastos
- Personalización con nombre, icono y color
- Gestión completa (crear, editar, eliminar)
- Filtros por tipo (ingreso/gasto)

### 🎯 Metas Financieras
- Creación de objetivos de ahorro con título, monto y fecha límite
- Visualización del progreso con barra de avance
- Sistema de contribuciones con historial detallado
- **Colaboración en metas:** Invitar colaboradores por email
- Permisos diferenciados (dueño vs colaborador)
- Sincronización en tiempo real entre usuarios
- Notificación cuando se completa una meta

### 🔐 Autenticación de Usuarios
- Registro de nuevos usuarios
- Inicio de sesión seguro
- Rutas protegidas con validación de autenticación
- Persistencia de sesión
- Cierre de sesión

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento
- **Tailwind CSS** - Estilos y diseño responsive
- **Recharts** - Gráficos y visualizaciones

### Backend & Base de Datos
- **Firebase Authentication** - Autenticación de usuarios
- **Cloud Firestore** - Base de datos NoSQL en tiempo real
- **Firebase Security Rules** - Reglas de seguridad

### Arquitectura
- **Reducer Pattern** - Gestión de estado
- **Custom Hooks** - Lógica reutilizable
- **Context API** - Estado global de autenticación
- **Protected Routes** - Control de acceso

---

## 📋 Requerimientos

- **Node.js** versión 16 o superior
- **npm** o **yarn**
- Navegador web moderno (Google Chrome, Firefox, Edge)
- Conexión a Internet (para Firebase)

---

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/fintrack.git
cd fintrack
```
### 2. Instalar dependencias
```bash
npm install
# o
yarn install
```
### 3. Ejecutar en modo desarrollo
```bash
npm run dev
# o
yarn dev
```

### 4. Fuente real de tasas CDT

FinTrack consulta por defecto datos oficiales de Colombia desde `datos.gov.co` (dataset de tasas de captación/CDT de la Superintendencia Financiera).

Si quieres usar otra fuente (por ejemplo tu propio backend), puedes sobrescribirla con `.env.local`:

```bash
VITE_CDT_RATES_API_URL=https://tu-endpoint.com/cdt-rates
```

### 5. Formato esperado para endpoint personalizado

```bash
Si usas VITE_CDT_RATES_API_URL, el endpoint puede responder cualquiera de estos formatos JSON:
```

```json
[
	{ "bank": "Banco de Bogota", "rate": 11.2, "term": 360, "minAmount": 2000000 },
	{ "bank": "Davivienda", "rate": 11.0, "term": 360, "minAmount": 500000 }
]
```

```json
{
	"data": [
		{ "banco": "Bancolombia", "tasa": 10.5, "plazo": 360, "montoMinimo": 1000000 }
	]
}
```

Si la API no responde o devuelve datos inválidos, FinTrack mostrará tasas de referencia para no afectar la experiencia.
