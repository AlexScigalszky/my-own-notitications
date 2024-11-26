// const nodemailer = require('nodemailer');
const { alejandra } = require('./tasks/alejandra-peralta');

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

exports.handler = async () => {
    try {
        console.log("starting..");
        // Lógica de tu tarea
        const result = alejandra.execute();
        const resultado = result?.resultado ?? "Resultado de tu tarea genérica";
        const asunto = result?.asunto ?? "Alex's Notifier";

        // Configuración de nodemailer para enviar el correo
        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PASS
        //     }
        // });

        fetch('https://swagerchangesnotifier.onrender.com/emails/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fromName: "Alex's Alerts",
                destination: "alexpablo.90@gmail.com",
                subject: asunto,
                body: resultado,
                apiToken: uuidv4()
            })
        });

        // await transporter.sendMail({
        //     from: process.env.EMAIL_USER,
        //     to: 'alexpablo.90@gmail.com',
        //     subject: asunto,
        //     html: resultado
        // });

        console.log("Notificación enviada con éxito");
        return { statusCode: 200, body: "Notificación enviada con éxito" };
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return { statusCode: 500, body: `Error: ${error.message}` };
    }
};
