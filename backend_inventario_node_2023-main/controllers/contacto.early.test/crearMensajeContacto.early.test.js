


const { crearMensajeContacto } = require('../contacto');
const MensajeContacto = require('../../modelos/MensajeContacto');
const { request, response } = require('express');


// Import necessary modules and dependencies
// Mock the MensajeContacto model
jest.mock("../../modelos/MensajeContacto");

describe('crearMensajeContacto() crearMensajeContacto method', () => {
    let req, res;

    beforeEach(() => {
        // Set up mock request and response objects
        req = {
            body: {
                nombre: 'John Doe',
                email: 'john.doe@example.com',
                telefono: '1234567890',
                tipoEquipo: 'Laptop',
                mensaje: 'This is a test message'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Happy paths', () => {
        it('should save the contact message and return a success response', async () => {
            // Mock the save method to resolve successfully
            MensajeContacto.prototype.save = jest.fn().mockResolvedValueOnce();

            // Call the function
            await crearMensajeContacto(req, res);

            // Assertions
            expect(MensajeContacto.prototype.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                mensaje: 'Mensaje de contacto recibido con éxito',
                mensajeContacto: expect.any(Object)
            });
        });
    });

    describe('Edge cases', () => {
        it('should handle missing fields in the request body', async () => {
            // Remove some fields from the request body
            req.body = {
                nombre: 'John Doe',
                email: 'john.doe@example.com'
            };

            // Mock the save method to resolve successfully
            MensajeContacto.prototype.save = jest.fn().mockResolvedValueOnce();

            // Call the function
            await crearMensajeContacto(req, res);

            // Assertions
            expect(MensajeContacto.prototype.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                mensaje: 'Mensaje de contacto recibido con éxito',
                mensajeContacto: expect.any(Object)
            });
        });

        it('should handle database save errors gracefully', async () => {
            // Mock the save method to reject with an error
            MensajeContacto.prototype.save = jest.fn().mockRejectedValueOnce(new Error('Database error'));

            // Call the function
            await crearMensajeContacto(req, res);

            // Assertions
            expect(MensajeContacto.prototype.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                mensaje: 'Error interno del servidor al enviar mensaje de contacto'
            });
        });
    });
});