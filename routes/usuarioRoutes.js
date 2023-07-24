import express from "express";
const router = express.Router();

import {
    registrarUsuario,
    confirmarUsuario,
    iniciarSesion,
    perfil,
    forgotPassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
} from '../controllers/usuarioController.js';
import checkAuth from "../middleware/authMiddleware.js";

// Rutas publicas
router.post('/', registrarUsuario);
router.post('/login', iniciarSesion);
router.post('/forgot-password', forgotPassword); // Validar el email del usuario y genera un nuevo token
router.post('/forgot-password/:token', nuevoPassword);

router.get('/confirmar/:tokenUsuario', confirmarUsuario);
router.get('/forgot-password/:tokenValidar', comprobarToken); // Valida el token para hacer el cambio de contraseña


// Rutas privadas
router.get('/perfil',checkAuth, perfil);

// Estos elementos se actualizan cuando el usuario ya inicio sesion
router.put('/perfil/:id',checkAuth, actualizarPerfil);
router.put('/actualizar-password',checkAuth, actualizarPassword); 

export default router;