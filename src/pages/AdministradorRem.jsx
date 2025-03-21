import React, { useState, useEffect } from "react";
import "../styles/AdministradorInformesRem.css";

const API_URL = import.meta.env.VITE_API_URL; // URL base del backend

const AdministradorRem = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    establecimiento: "",
    nombre: "",
    email: "",
    clave: "",
    rol: "usuario", // Rol predeterminado
  });

  const [adminParams, setAdminParams] = useState({
    serie: "",
    version: "",
  });

  const [parametros, setParametros] = useState([]); // Para almacenar los parámetros obtenidos

  // Cargar usuarios y parámetros al montar el componente
  useEffect(() => {
    cargarUsuarios();
    cargarParametros();
  }, []);

  // Obtener lista de usuarios
  const cargarUsuarios = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/usuarios`);
      if (!response.ok) throw new Error("Error al cargar usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar usuarios");
    }
  };

  // Obtener lista de parámetros
  const cargarParametros = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/params`);
      if (!response.ok) throw new Error("Error al cargar parámetros");
      const data = await response.json();
      setParametros(data);
    } catch (error) {
      console.error("Error al cargar parámetros:", error);
    }
  };

  // Manejar cambios en el formulario de nuevo usuario
  const handleNuevoUsuarioChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  // Manejar cambios en el formulario de parámetros
  const handleAdminParamsChange = (e) => {
    setAdminParams({ ...adminParams, [e.target.name]: e.target.value });
  };

  // Agregar un nuevo usuario
  const agregarUsuario = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });
      if (!response.ok) {
        const error = await response.json();
        alert(error.error);
        return;
      }

      const data = await response.json();
      alert(data.message);
      cargarUsuarios();
    } catch (error) {
      console.error(error);
      alert("Error al agregar usuario");
    }
  };

  // Eliminar un usuario
  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      const response = await fetch(`${API_URL}/auth/usuarios/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar el usuario");
      alert("Usuario eliminado con éxito");
      cargarUsuarios(); // Recargar la lista de usuarios
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error al eliminar el usuario");
    }
  };

  // Modificar la versión de un parámetro existente
  const modificarParametro = async () => {
    console.log("Enviando datos:", adminParams);
    try {
      const response = await fetch(`${API_URL}/auth/admin/params`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminParams),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error en la respuesta:", error);
        throw new Error("Error al modificar el parámetro");
      }

      const data = await response.json();
      alert("Parámetro actualizado con éxito: " + data.message);

      // Actualizar lista de parámetros en el estado con los datos recibidos
      if (data.parametros) {
        setParametros(data.parametros); // Actualizar la lista en el frontend
      }
    } catch (error) {
      console.error("Error al modificar parámetro desde React:", error);
      alert("Error al modificar el parámetro");
    }
  };

  return (
    <div className="container-informes">
      <h1>Panel de Administración</h1>

      {/* Modificar Parámetros de administrador_rem */}
      <section>
        <h2>Modificar Parámetros del Administrador</h2>
        <div className="form-grid">
          <select
            name="serie"
            value={adminParams.serie}
            onChange={handleAdminParamsChange}
          >
            <option value="">Seleccione una serie</option>
            <option value="SERIE A">SERIE A</option>
            <option value="SERIE BS">SERIE BS</option>
            <option value="SERIE BM">SERIE BM</option>
            <option value="SERIE D">SERIE D</option>
            <option value="SERIE P">SERIE P</option>
          </select>
          <input
            name="version"
            placeholder="Nueva Versión"
            value={adminParams.version}
            onChange={handleAdminParamsChange}
          />
          <button onClick={modificarParametro}>Modificar Parámetro</button>
        </div>

        <h3>Lista de Parámetros</h3>
        <ul>
          {parametros.map((param, index) => (
            <li key={index}>
              {param.serie} - {param.version}
            </li>
          ))}
        </ul>
      </section>

      {/* Agregar Usuario */}
      <section>
        <h2>Agregar Usuario</h2>
        <form>
          <input
            name="establecimiento"
            placeholder="Establecimiento"
            onChange={handleNuevoUsuarioChange}
          />
          <input
            name="nombre"
            placeholder="Nombre"
            onChange={handleNuevoUsuarioChange}
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleNuevoUsuarioChange}
          />
          <input
            name="clave"
            placeholder="Clave"
            type="password"
            onChange={handleNuevoUsuarioChange}
          />
          <select
            name="rol"
            value={nuevoUsuario.rol}
            onChange={handleNuevoUsuarioChange}
          >
            <option value="usuario">Usuario</option>
            <option value="lector">Revisa informes REM</option>
            <option value="dashboard">Modifica Dashboard</option>
            <option value="administrador">Administrador</option>
          </select>
          <button onClick={agregarUsuario} type="button">
            Agregar Usuario
          </button>
        </form>
      </section>

      {/* Listado de Usuarios */}
      <section>
        <h2>Lista de Usuarios</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Establecimiento</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.establecimiento}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>{new Date(usuario.fecha_creacion).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => eliminarUsuario(usuario.id)}
                    className="btn-eliminar"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdministradorRem;
