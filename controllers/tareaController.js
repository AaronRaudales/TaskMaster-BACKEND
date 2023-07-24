import Tarea from "../models/Tarea.js";

const agregarTarea = async(req,res) => {

    try {
        const tarea = new Tarea(req.body);
        tarea.usuario = req.usuario._id // que usuario esta registrando la tarea

        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada);
    } catch (error) {
        console.log(error)
    }
}

// Trae todas las tareas de ese usuario
const obtenerTareas = async(req,res) => {
    const usuarios = await Tarea.find() 
            .where('usuario').equals(req.usuario);
        
    res.json(usuarios)
 
}

const obtenerTarea = async(req,res) => {
  try {
        const {id} = req.params;

        if(id.length!==24){
            const error= new Error('Id no valido.');
            return res.status(400).json({msg:error.message})
        }

        const tarea = await Tarea.findById(id);
        if(!tarea){
            const error = new Error('Tarea no encontrada.');
            return res.status(400).json({msg:error.message})
        }

        // Autenticacion para comprobar que ese usuario agrego la tarea (Se convierten a toString para poder compararlos)
        if(tarea.usuario._id.toString() !== req.usuario._id.toString()){
            const error = new Error('Accion no valida.');
            return res.status(400).json({msg:error.message})
        }

        res.json(tarea);
  } catch (error) {
    console.log(error)
  }

}

const actualizarTarea = async(req,res) => {
    try {
        const {id} = req.params;

        if(id.length!==24){
            const error= new Error('Id no valido.');
            return res.status(400).json({msg:error.message})
        }

        const tarea = await Tarea.findById(id);
        if(!tarea){
            const error = new Error('Tarea no encontrada.');
            return res.status(400).json({msg:error.message})
        }

        if(tarea.usuario._id.toString() !== req.usuario._id.toString()){
            const error = new Error('Accion no valida.');
            return res.status(400).json({msg:error.message})
        }

        tarea.titulo = req.body.titulo || tarea.titulo ;
        tarea.descripcion = req.body.descripcion || tarea.descripcion;
        tarea.asignaciones = req.body.asignaciones || tarea.asignaciones;
        tarea.fechaFinalizacion = req.body.fechaFinalizacion || tarea.fechaFinalizacion;
        tarea.horaFinalizacion = req.body.horaFinalizacion || tarea.horaFinalizacion;

        const tareaActualizada = await tarea.save();

        res.json(tareaActualizada)

    } catch (error) {
        console.log(error)
    }
}

const eliminarTarea = async(req,res) => {
    try {
        const {id} = req.params;

        if(id.length!==24){
            const error= new Error('Id no valido.');
            return res.status(400).json({msg:error.message})
        }

        const tarea = await Tarea.findById(id);
        if(!tarea){
            const error = new Error('Tarea no encontrada.');
            return res.status(400).json({msg:error.message})
        }

        if(tarea.usuario._id.toString() !== req.usuario._id.toString()){
            const error = new Error('Accion no valida.');
            return res.status(400).json({msg:error.message})
        }
        await tarea.deleteOne()
        res.json({msg: 'Tarea eliminada'});
    } catch (error) {
        console.log(error)
    }
}

export {
    agregarTarea,
    obtenerTarea,
    obtenerTareas,
    actualizarTarea,
    eliminarTarea
}