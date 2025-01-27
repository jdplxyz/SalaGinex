import { deleteExpiredMovies } from "./controllers/peliculaController";

// Handler de Lambda
exports.handler = async (event) => {
    try {
        await deleteExpiredMovies();
        return {
            statusCode: 200,
            body: JSON.stringify('Procedimiento almacenado ejecutado correctamente.'),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('Error al ejecutar el procedimiento almacenado.'),
        };
    }
};

