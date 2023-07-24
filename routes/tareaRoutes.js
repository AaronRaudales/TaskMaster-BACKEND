import express from "express";
const router = express.Router();


import {
    agregarTarea,
    obtenerTarea,
    obtenerTareas,
    actualizarTarea,
    eliminarTarea
} from '../controllers/tareaController.js';
import checkAuth from "../middleware/authMiddleware.js";

// En este apartado todas las rutas seran privadas
router.route('/')
        .post(checkAuth, agregarTarea)
        .get(checkAuth, obtenerTareas)

router.route('/:id')
        .get(checkAuth, obtenerTarea)
        .put(checkAuth, actualizarTarea)
        .delete(checkAuth, eliminarTarea)


export default router;