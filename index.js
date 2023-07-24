import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDb from './config/db.js';

//Routes
import usuarioRoutes from './routes/usuarioRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js'

const app = express();
app.use(express.json());

dotenv.config();

conectarDb();

// Poner la url del fronted
const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback) { 
        if(dominiosPermitidos.indexOf(origin) !== -1) {
            //El origen del request esta permitido
            callback(null, true)
        } else {
            callback(new Error('No permitido por CORS'))
        }
    }
}

app.use(cors(corsOptions))

//Direccion del route
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/tareas", tareaRoutes);

const PORT = process.env.PORT || 4100;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
})