// app.ts
import App from './app';
import jwt from 'jsonwebtoken';

const PORT = process.env.PORT || 3000;
const app = new App().getApp();

// Generar token de admin al iniciar la aplicación
const generateAdminToken = () => {
  const adminPayload = {
    id: 'admin-system',
    role: 'Admin'
  };
  
  const token = jwt.sign(
    adminPayload,
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '24h' }
  );
  
  return token;
};

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Topics API ready at http://localhost:${PORT}`);
  console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
  
  // Generar y mostrar token de admin
  const adminToken = generateAdminToken();
  console.log(`🔑 Admin token generated: ${adminToken}`);
  console.log(`👑 Use this token for admin operations`);
});

export { app };