"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guardados_model_1 = require("../modelos/guardados.model");
const guardadosRoutes = (0, express_1.Router)();
//save/unsave post
guardadosRoutes.post('/save', (req, res) => {
    const postSaved = {
        idUsuario: req.body.idUsuario,
        idPost: req.body.idPost,
    };
    // en vez de false remove
    guardados_model_1.Guardados.find(postSaved).then(userDB => {
        //console.log('userDB', userDB);
        if (userDB.length > 0) {
            //remove like
            guardados_model_1.Guardados.deleteOne(postSaved).then(userDB => {
                res.json({
                    ok: false,
                    mensaje: "quitaste de guardados"
                });
            });
        }
        else {
            guardados_model_1.Guardados.create(postSaved).then(userDB => {
                res.json({
                    ok: true,
                    like: userDB,
                    mensaje: "post guardado:)"
                });
            });
        }
    });
});
//getPostSaved por usuario
guardadosRoutes.get('/getpostsaved/:userid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.params.userid;
    const postSaved = yield guardados_model_1.Guardados.find({ idUsuario: userid })
        .exec();
    res.json({
        ok: true,
        //pagina:pagina,
        posts: postSaved,
        //numeroLikes: prueba.length
    });
}));
exports.default = guardadosRoutes;
