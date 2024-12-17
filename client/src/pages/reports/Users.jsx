import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Users.css"; 

//formulario usurios
const Users = () => {
  const [users, setUsers] = useState([]);
  const [formUser, setFormUser] = useState({
    _id: null,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  //cargar usuarios de la api
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:4000/users");
        if (!response.ok) {
          throw new Error("Error al cargar los usuarios");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  //crear usuario
  const createUser = async () => {
    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formUser),
      });
      if (!response.ok) throw new Error("Error al crear usuario");

      const newUser = await response.json();
      setUsers([...users, newUser]);
      setFormUser({ _id: null, firstName: '', lastName: '', email: '', password: '', role: 'user' });
    } catch (error) {
      setError(error.message);
    }
  };

  //actualizar usuario
  const updateUser = async () => {
    try {
      const { password, ...userData } = formUser;
      const response = await fetch(`http://localhost:4000/users/${formUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error("Error al editar usuario");

      const updatedUser = await response.json();
      setUsers(users.map(user => user._id === updatedUser._id ? updatedUser : user));
      setFormUser({ _id: null, firstName: '', lastName: '', email: '', password: '', role: 'user' });
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    }
  };


  //eliminar usuario
  const deleteUser = async (id) => {
    const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (!isConfirmed) return; 
  
    try {
      const response = await fetch(`http://localhost:4000/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar usuario");
  
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };
  
//contenido
  return (
    <div className="usuario-mainContent">
      <h1 className="usuario-h1">Usuarios</h1>
      {error && <p className="usuario-errorMessage">Error: {error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          isEditing ? updateUser() : createUser();
        }}
        className="usuario-form"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={formUser.firstName}
          onChange={(e) => setFormUser({ ...formUser, firstName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Apellido"
          value={formUser.lastName}
          onChange={(e) => setFormUser({ ...formUser, lastName: e.target.value })}
        />
        <input
          type="email"
          placeholder="Correo"
          value={formUser.email}
          onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
        />
        {!isEditing && (
          <input
            type="password"
            placeholder="Contraseña"
            value={formUser.password}
            onChange={(e) => setFormUser({ ...formUser, password: e.target.value })}
          />
        )}
        <select
          value={formUser.role}
          onChange={(e) => setFormUser({ ...formUser, role: e.target.value })}
        >
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit" className="usuario-button">
          {isEditing ? "Actualizar" : "Crear"}
        </button>
        {isEditing && (
          <button type="button" onClick={() => setIsEditing(false)} className="usuario-button">
            Cancelar
          </button>
        )}
      </form>

      {users.length > 0 ? (
  <table className="usuario-table">
    <thead className="usuario-thead">
      <tr>
        <th>Nombre</th>
        <th>Apellido</th>
        <th>Correo</th>
        <th>Fecha de Creación</th>
        <th>Hora de Creación</th>
        <th>Rol</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody className="usuario-tbody">
      {users.map((user) => (
        <tr key={user._id}>
          <td>{user.firstName}</td>
          <td>{user.lastName}</td>
          <td>{user.email}</td>
          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
          <td>{new Date(user.createdAt).toLocaleTimeString()}</td>
          <td>{user.role}</td>
          <td>
            <button
              className="usuario-button usuario-button-edit"
              onClick={() => { setFormUser(user); setIsEditing(true); }}
            >
              Editar
            </button>
            <button
              className="usuario-button usuario-button-delete"
              onClick={() => deleteUser(user._id)}
            >
              Eliminar
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>No hay usuarios para mostrar</p>
)}

    </div>
  );
};

export default Users;
