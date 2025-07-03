import React from 'react';
import logoEZ from '../assets/image2.png'; // Asegúrate de que la ruta sea correcta

const LoginPage = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
      {/* Franja azul arriba */}
      <div className="w-100" style={{ height: '32px', backgroundColor: '#2f55a0', position: 'absolute', top: 0 }}></div>

      {/* Contenedor de login */}
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px', marginTop: '64px' }}>
        {/* Logo centrado */}
        <div className="text-center mb-4">
          <img
            src={logoEZ}
            alt="EZAccess logo"
            className="img-fluid"
            style={{
              maxWidth: '400px',  // más grande
              display: 'block',
              margin: '0 auto',
            }}
          />
        </div>

        {/* Formulario */}
        <form>
          <div className="mb-3">
            <label htmlFor="correo" className="form-label">Correo</label>
            <input type="email" className="form-control" id="correo" required />
          </div>
          <div className="mb-3">
            <label htmlFor="contrasena" className="form-label">Contraseña</label>
            <input type="password" className="form-control" id="contrasena" required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Iniciar sesión</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
