import nodemailer from 'nodemailer';

const emailOlvidePassword = async(datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {nombre, email, token} = datos;
    
    //Enviar el email
    const info = await transport.sendMail({
        from: "TaskMaster - Tu administrador de tareas",
        to: email,
        subject:"Restablece tu Contraseña",
        text: "Restablece tu Contraseña",
        html: `<p>Hola ${nombre}, ha solicitado restablecer su contraseña.</p>
            <p>Sigue el siguiente enlace para generar una nueva contraseña:
            <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Restablecer Contraseña</a></p>

            <p>Si tu no creaste esta cuenta, ignora este mensaje.</p>
        `,
    });
    console.log("Mensaje enviado: %s", info.messageId);
};

export default emailOlvidePassword;