const VisitaTecnica = require('../modelos/VisitaTecnica');
const { request, response } = require('express');

const crearVisitaTecnica = async (req = request, res = response) => {
    try {
        const { nombre, contacto, tipoEquipo, problema, fecha, hora } = req.body;
        const visitaTecnica = new VisitaTecnica({
            nombre,
            contacto,
            tipoEquipo,
            problema,
            fecha,
            hora
        });

        await visitaTecnica.save();
        return res.status(201).json({ mensaje: 'Visita técnica agendada con éxito', visitaTecnica });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'Error interno del servidor al agendar visita' });
    }
};

// Puedes agregar más funciones aquí para listar, actualizar, eliminar visitas
const listarVisitasTecnicas = async (req = request, res = response) => {
    try {
        const visitas = await VisitaTecnica.find();
        return res.json(visitas);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'Error interno del servidor al listar visitas' });
    }
};

module.exports = { crearVisitaTecnica, listarVisitasTecnicas };
