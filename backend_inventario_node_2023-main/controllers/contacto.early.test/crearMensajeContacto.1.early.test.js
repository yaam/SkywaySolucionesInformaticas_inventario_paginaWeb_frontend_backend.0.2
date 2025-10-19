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

        it.each([
            [{ nombre: '', email: 'john.doe@example.com', telefono: '1234567890', tipoEquipo: 'Laptop', mensaje: 'Test' }, 'nombre'],
            [{ nombre: 'John Doe', email: '', telefono: '1234567890', tipoEquipo: 'Laptop', mensaje: 'Test' }, 'email'],
            [{ nombre: 'John Doe', email: 'john.doe@example.com', telefono: '', tipoEquipo: 'Laptop', mensaje: 'Test' }, 'telefono'],
            [{ nombre: 'John Doe', email: 'john.doe@example.com', telefono: '1234567890', tipoEquipo: '', mensaje: 'Test' }, 'tipoEquipo'],
            [{ nombre: 'John Doe', email: 'john.doe@example.com', telefono: '1234567890', tipoEquipo: 'Laptop', mensaje: '' }, 'mensaje']
        ])('should handle invalid input: missing %s', async (invalidBody, missingField) => {
            req.body = invalidBody;

            // Call the function
            await crearMensajeContacto(req, res);

            // Assertions
            expect(MensajeContacto.prototype.save).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                mensaje: `El campo ${missingField} es obligatorio`
            });
        });
    });

    describe('Security related tests', () => {
        it('should return 401 if the user is not authenticated', async () => {
            req.isAuthenticated = jest.fn().mockReturnValue(false);

            // Call the function
            await crearMensajeContacto(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                mensaje: 'No autenticado'
            });
        });

        it('should return 403 if the user role is forbidden', async () => {
            req.isAuthenticated = jest.fn().mockReturnValue(true);
            req.user = { role: 'forbiddenRole' };

            // Call the function
            await crearMensajeContacto(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                mensaje: 'Acceso denegado'
            });
        });

        it('should validate input and return 400 for invalid email format', async () => {
            req.body.email = 'invalid-email-format';

            // Call the function
            await crearMensajeContacto(req, res);

            // Assertions
            expect(MensajeContacto.prototype.save).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                mensaje: 'Formato de email inválido'
            });
        });
    });
});