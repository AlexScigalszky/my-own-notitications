const alejandra = require('./tasks/alejandra-peralta/index');

exports.handler = async () => {
    try {
        console.log("starting..");
        const result = alejandra.execute();
        const resultado = result?.resultado ?? "Resultado de tu tarea genérica";
        const asunto = result?.asunto ?? "Alex's Notifier";

        return {
            statusCode: 200, body: { asunto, resultado }
        };
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return { statusCode: 500, body: `Error: ${error.message}` };
    }
};
