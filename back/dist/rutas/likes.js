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
const likes_model_1 = require("../modelos/likes.model");
const likesRoutes = (0, express_1.Router)();
//like post
likesRoutes.post('/like', (req, res) => {
    const likesito = {
        idUsuario: req.body.idUsuario,
        idPost: req.body.idPost,
    };
    // en vez de false remove
    likes_model_1.Likes.find(likesito).then(userDB => {
        //console.log('userDB', userDB);
        if (userDB.length > 0) {
            //remove like
            likes_model_1.Likes.deleteOne(likesito).then(userDB => {
                res.json({
                    ok: false,
                    mensaje: "quitaste el like :("
                });
            });
        }
        else {
            likes_model_1.Likes.create(likesito).then(userDB => {
                res.json({
                    ok: true,
                    like: userDB,
                    mensaje: "like añadido :)"
                });
            });
        }
    });
});
//getLikes de post
likesRoutes.get('/getlikes/:postid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let prueba = [];
    const postId = req.params.postid;
    const postLike = yield likes_model_1.Likes.find({ idPost: postId })
        .exec();
    //get idUsuario de postlike
    prueba = postLike.map((ele) => {
        return ele.idUsuario;
    });
    res.json({
        ok: true,
        //pagina:pagina,
        usuarios: prueba,
        numeroLikes: prueba.length
    });
}));
//getLikes por usuario
likesRoutes.get('/getpostlike/:userid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.params.userid;
    const postLike = yield likes_model_1.Likes.find({ idUsuario: userid })
        .exec();
    res.json({
        ok: true,
        //pagina:pagina,
        posts: postLike,
        //numeroLikes: prueba.length
    });
}));
//unlike post
likesRoutes.post('/unlike', (req, res) => {
    const likesito = {
        idUsuario: req.body.idUsuario,
        idPost: req.body.idPost,
    };
    likes_model_1.Likes.deleteOne(likesito).then(userDB => {
        res.json({
            ok: true,
            // like:userDB,
        });
    });
});
exports.default = likesRoutes;
