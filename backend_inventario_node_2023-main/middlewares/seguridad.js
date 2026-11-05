const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const DURACION_SESION = '8h';
const LONGITUD_MINIMA_SECRETO = 32;
const MAX_LONGITUD_TEXTO = 2000;
// ~2.5 MB de archivo en Base64: dos imágenes caben en el límite JSON de 8 MB.
const MAX_LONGITUD_IMAGEN = 3.5 * 1024 * 1024;
const CAMPO_HONEYPOT = 'sitioWeb';

const authConfigurada = () => Boolean(
    process.env.ADMIN_USER
    && process.env.ADMIN_PASSWORD
    && (process.env.JWT_SECRET || '').length >= LONGITUD_MINIMA_SECRETO
);

const digest = (valor) => crypto.createHash('sha256').update(String(valor)).digest();
const igualesSeguro = (a, b) => crypto.timingSafeEqual(digest(a), digest(b));

const login = (req, res) => {
    if (!authConfigurada()) {
        return res.status(503).json({ mensaje: 'Autenticación no configurada en el servidor' });
    }
    const { usuario, password } = req.body || {};
    if (typeof usuario !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ mensaje: 'Usuario y contraseña son requeridos' });
    }
    const usuarioOk = igualesSeguro(usuario, process.env.ADMIN_USER);
    const passwordOk = igualesSeguro(password, process.env.ADMIN_PASSWORD);
    if (!(usuarioOk && passwordOk)) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ sub: process.env.ADMIN_USER, rol: 'admin' }, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: DURACION_SESION,
    });
    return res.json({ token, expiraEn: DURACION_SESION });
};

const requireAuth = (req, res, next) => {
    if (!authConfigurada()) {
        return res.status(503).json({ mensaje: 'Autenticación no configurada en el servidor' });
    }
    const [tipo, token] = (req.headers.authorization || '').split(' ');
    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({ mensaje: 'No autenticado' });
    }
    try {
        req.admin = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        return next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Sesión inválida o expirada' });
    }
};

const crearLimitador = (windowMs, limit, mensaje, opciones = {}) => rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { mensaje },
    ...opciones,
});

const limitadorGeneral = crearLimitador(15 * 60 * 1000, 300, 'Demasiadas solicitudes, intenta más tarde');
const limitadorLogin = crearLimitador(15 * 60 * 1000, 5, 'Demasiados intentos de inicio de sesión, intenta en 15 minutos', {
    skipSuccessfulRequests: true,
});
const limitadorFormularios = crearLimitador(60 * 60 * 1000, 10, 'Demasiados envíos, intenta más tarde');
const limitadorToken = crearLimitador(15 * 60 * 1000, 5, 'Demasiados intentos de verificación, intenta en 15 minutos', {
    skipSuccessfulRequests: true,
});

// Los bots suelen rellenar todos los campos; los humanos no ven este campo oculto.
const rechazarBots = (req, res, next) => {
    if (req.body && req.body[CAMPO_HONEYPOT]) {
        return res.status(201).json({ mensaje: 'Recibido' });
    }
    if (req.body) {
        delete req.body[CAMPO_HONEYPOT];
    }
    return next();
};

const validarCamposPublicos = (camposTexto, camposImagen = [], camposRequeridos = camposTexto) => (req, res, next) => {
    const body = req.body || {};
    for (const campo of camposRequeridos) {
        const valor = body[campo];
        if (typeof valor !== 'string' || !valor.trim()) {
            return res.status(400).json({ mensaje: `Campo requerido: ${campo}` });
        }
    }
    for (const campo of camposTexto) {
        const valor = body[campo];
        if (valor === undefined || valor === null) continue;
        if (typeof valor !== 'string' || valor.length > MAX_LONGITUD_TEXTO) {
            return res.status(400).json({ mensaje: `Campo inválido: ${campo}` });
        }
    }
    for (const campo of camposImagen) {
        const valor = body[campo];
        if (valor === undefined || valor === null || valor === '') continue;
        if (typeof valor !== 'string' || valor.length > MAX_LONGITUD_IMAGEN
            || !/^data:image\/(png|jpe?g|gif|webp);base64,[A-Za-z0-9+/=\s]+$/.test(valor)) {
            return res.status(400).json({ mensaje: `Imagen inválida: ${campo}` });
        }
    }
    return next();
};

module.exports = {
    authConfigurada,
    login,
    requireAuth,
    limitadorGeneral,
    limitadorLogin,
    limitadorFormularios,
    limitadorToken,
    rechazarBots,
    validarCamposPublicos,
};
