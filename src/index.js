import express from 'express';
import cors from 'cors';
import routes from './routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3001, () => {
  console.log('✅ Servidor corriendo en el puerto 3001');
});


