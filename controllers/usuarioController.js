import Usuario from "../models/Usuario.js";
import generarJWT from '../helpers/generarJWT.js';
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrarUsuario = async (req, res) => {
    try {
        const {email, nombre} = req.body;

        const existeUsuario = await Usuario.findOne({email});
        if(existeUsuario){
            const error = new Error('Usuario ya registrado');
            return res.status(400).json({msg: error.message});
        }

        const usuario = new Usuario(req.body)
        const usuarioGuardado = await usuario.save();

        emailRegistro({
            nombre,
            email,
            token: usuarioGuardado.token
        });


        res.json({
            nombre: usuarioGuardado.nombre,
            email: usuarioGuardado.email,
            telefono: usuarioGuardado.telefono
        })


    } catch (error) {
        console.log(error);
    }
};

// Confirmar al usuario mediante el token
const confirmarUsuario = async(req,res) => {
   try {
    const {tokenUsuario} = req.params;

    const usuarioConfirmar = await Usuario.findOne({token: tokenUsuario})

    if(!usuarioConfirmar){
        const error = new Error('Token no valido');
        return res.status(400).json({msg: error.message});
    }

    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();

    res.json({msg : 'Usuario confirmado correctamente'});
   } catch (error) {
    console.log(error);
   }
};

const iniciarSesion = async(req, res) => {
    try {
        const { email, password} = req.body;

        const usuario = await Usuario.findOne({email});
        //Comprueba si el usuario existe
        if(!usuario){
            const error = new Error('El usuario no existe');
            return res.status(400).json({msg: error.message});
        }

        // Comprobar si el usuario esta confirmado
        if(!usuario.confirmado){
            const error = new Error("Tu cuenta no ha sido confirmada.");
            return res.status(400).json({msg: error.message});
        }

        if(await usuario.comprobarPassword(password)){
            res.json({
                _id:usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                token:generarJWT(usuario.id)
            })

        } else {
            const error = new Error("Password Incorrecto");
            return res.status(400).json({msg: error.message});
        }
    } catch (error) {
        console.log(error);
    }

};

// Validar el email del usuario y almacena un nuevo token
const forgotPassword = async(req,res) => {
    try {
        const { email} = req.body;

        const existeUsuario = await Usuario.findOne({email});
        if(!existeUsuario){
            const error = new Error('Este usuario no existe');
            return res.status(400).json({msg: error.message});
        }

        existeUsuario.token = generarId();
        await existeUsuario.save();

        // Le enviamos la informacion que necesitamos para enviar el correo
        emailOlvidePassword({
            email, 
            nombre: existeUsuario.nombre,
            token: existeUsuario.token
        })

        res.json({msg:"Hemos enviado un email con las instrucciones"});
    } catch (error) {
        console.log(error)
    }

};

const comprobarToken = async(req, res) => {
   try {
        const { tokenValidar} = req.params;

        const tokenValido = await Usuario.findOne({token: tokenValidar});

        if(!tokenValido){
            const error = new Error('Token no valido');
            return res.status(400).json({msg: error.message});
        }

        res.json({msg: "Token Valido"})
   } catch (error) {
        console.log(error);
   }
};

const nuevoPassword = async(req,res)=> {
   try {
        const { token} = req.params;
        const { password} = req.body;

        const usuarioValidado = await Usuario.findOne({token});

        if(!usuarioValidado){
            const error = new Error('Usuario no encontrado');
            return res.status(400).json({msg: error.message});
        }

        usuarioValidado.token = null;
        usuarioValidado.password = password;
        await usuarioValidado.save();
        res.json({msg: "Password modificado correctamente"});
   } catch (error) {
    console.log(error);
   }
};

/*---------------------------------------------------------------------------------- */
// retorna el objeto autenticado
const perfil = async(req,res) => {
    const { usuario } = req;
    res.json(usuario);
};

const actualizarPerfil = async(req,res) => {
    try {
        const {id} = req.params;
        const { email} = req.body;

        const usuario = await Usuario.findById(id);
        if(!usuario){
            const error = new Error('Usuario no encontrado');
            return res.status(400).json({msg: error.message});
        }

        if(usuario.email !== email){
            const existeEmail = await Usuario.findOne({email});
            if(existeEmail){
                const error = new Error('Email en uso');
                return res.status(400).json({msg: error.message});
            }
        }

        usuario.nombre = req.body.nombre;
        usuario.telefono = req.body.telefono;
        usuario.email = req.body.email;

        const usuarioActualizado = await usuario.save();

        res.json({
            nombre: usuarioActualizado.nombre,
            email: usuarioActualizado.email,
            telefono: usuarioActualizado.telefono
        })
    } catch (error) {
        console.log(error);
    }
};

const actualizarPassword = async(req,res)=> {
  try {
        const {id} = req.usuario;
        const { password_actual, password_nuevo} = req.body;

        const usuario = await Usuario.findById(id);
        if(!usuario){
            const error = new Error('Usuario no encontrado');
            return res.status(400).json({msg: error.message});
        }

        //Comprobar el password
        if(await usuario.comprobarPassword(password_actual)){
            usuario.password = password_nuevo;
            await usuario.save();

            res.json({msg: "Password almacenado correctamente"});
        } else {
            const error = new Error("El password actual es incorrecto");
            return res.status(400).json({msg: error.message});
        }
  } catch (error) {
    console.log(error);
  }  
};


export {
    registrarUsuario,
    confirmarUsuario,
    iniciarSesion,
    forgotPassword,
    comprobarToken,
    nuevoPassword,
    perfil,
    actualizarPerfil,
    actualizarPassword
};

