import nodemailer from 'nodemailer';

const emailRegistro = async(datos) => {
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
        from: '"TaskMaster - Tu administrador de tareas" <apv@correo.com>',
        to: email,
        subject:"Comprobacion de tu cuenta en TaskMaster",
        text: "Comprueba tu cuenta en TaskMaster",
        html: `<p>Hola ${nombre}, comprueba tu cuenta en TaskMaster.</p>
            <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a></p>

            <p>Si tu no creaste esta cuenta, ignora este mensaje.</p>
        `,
    });
    console.log("Mensaje enviado: %s", info.messageId);
};

export default emailRegistro;