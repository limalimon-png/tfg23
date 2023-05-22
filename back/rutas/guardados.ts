import { Router, Request, Response } from "express";
import { Guardados } from "../modelos/guardados.model";
const guardadosRoutes = Router();


//save/unsave post
guardadosRoutes.post('/save', (req: any, res: Response) => {
    const postSaved = {
        idUsuario: req.body.idUsuario,
        idPost: req.body.idPost,
    }
// en vez de false remove
    Guardados.find(postSaved).then(userDB => {
        //console.log('userDB', userDB);

        if (userDB.length > 0) {
            //remove like
            Guardados.deleteOne(postSaved).then(userDB => {

            res.json({
                ok: false,
                mensaje: "quitaste de guardados"
            });
        });
        } else {
            Guardados.create(postSaved).then(userDB => {

                res.json({
                    ok: true,
                    like: userDB,
                    mensaje: "post guardado:)"

                });

            });
        }
    })

});





//getPostSaved por usuario

guardadosRoutes.get('/getpostsaved/:userid', async (req: any, res: Response) => {
    const userid = req.params.userid;

    
    const postSaved:any = await Guardados.find({idUsuario:userid})
        .exec();
    res.json({
        ok: true,
        //pagina:pagina,
        posts: postSaved,
        //numeroLikes: prueba.length

    });
});








export default guardadosRoutes;