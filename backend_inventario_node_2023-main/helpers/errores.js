// Errores de Mongoose causados por datos del cliente (campos faltantes, tipos o IDs inválidos).
const esErrorDeDatos = (error) => ['ValidationError', 'CastError'].includes(error && error.name);

const detalleErrorDeDatos = (error) => {
    if (error.name === 'CastError') return `Valor inválido para ${error.path}`;
    return `Datos inválidos: ${Object.keys(error.errors || {}).join(', ')}`;
};

module.exports = { esErrorDeDatos, detalleErrorDeDatos };
