

const { response } = require("express");
const Evento = require("../models/Evento");


const getEventos = async(req, res = response) => {

    const eventos = await Evento.find().populate('user', 'name');
    res.json({
        ok: true,
        eventos
    })

}
const crearEvento = async(req, res = response) => {

    const evento = new Evento(req.body);

    try {

        evento.user = req.uid;
        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            evento: eventoGuardado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}
const actualizarEvento = async(req, res = response) => {
    const { id } = req.params;
    const uid = req.uid;

    try {
        
        const evento = await Evento.findById( id );

        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'El evento no existe por ese id'
            })
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'no tiene permiso para editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        //el tercer argumento es un objeto con propiedades, entre ellas el new:true que
        //le dice a mongo que retorne el objeto actualizado
        const eventoActualizado = await Evento.findByIdAndUpdate( id, nuevoEvento, { new: true} );

        res.json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}
const eliminarEvento = async(req, res = response) => {
    const { id } = req.params;
    const uid = req.uid;

    try {
        
        const evento = await Evento.findById( id );

        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'El evento no existe por ese id'
            })
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'no tiene permiso para eliminar este evento'
            })
        }

        const eventoEliminado = await Evento.findByIdAndDelete( id );

        res.json({
            ok: true,
            eventoEliminado: eventoEliminado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}