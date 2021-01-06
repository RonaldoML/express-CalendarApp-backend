/**
 * Rutas de Usuarios / Auth
 * host + /api/auth
 */

const { Router } = require('express');
//Paquete que ayuda a validar campos
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');



const router = Router();



router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 caracteres').isLength( { min:6 } ),
        //custom middleware
        validarCampos
    ],
    loginUsuario );

router.post(
    '/new',
    //middlewares
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 caracteres').isLength( { min:6 } ),
        //custom middleware
        validarCampos
    ],
    crearUsuario);

router.get('/renew', [validarJWT], revalidarToken);

module.exports = router;