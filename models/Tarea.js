import mongoose from "mongoose";

const tareaSchema = new mongoose.Schema({
        titulo: {
            type: String,
            required: true,
            trim: true
        },
        descripcion: {
            type: String,
            default: null
        },    
        asignaciones: {
            type: [String],
            required: true
        },
        fechaFinalizacion: {
            type: Date,
            required: true,
            default: Date.now()
        },
        horaFinalizacion: {
            type: String,
            required: true
        },
        estado: {
            type: Boolean,
            default: false
        },
        //Referencia al usuario que lo registro
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario'
        },
    },    
    {
        timestamps: true
    }
);

const Tarea = mongoose.model('Tarea', tareaSchema);
export default Tarea;