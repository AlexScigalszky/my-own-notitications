const nodemailer = require('nodemailer');

exports.handler = async () => {
    try {
        console.log("starting..");
        // Lógica de tu tarea
        const resultado = "Resultado de tu tarea genérica";

        // Configuración de nodemailer para enviar el correo
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'alexpablo.90@gmail.com',
            subject: asunto,
            html: resultado
        });

        console.log("Notificación enviada con éxito");
        return { statusCode: 200, body: "Notificación enviada con éxito" };
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return { statusCode: 500, body: `Error: ${error.message}` };
    }
};
