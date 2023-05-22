import { Router, Request, Response } from "express";
import { Likes } from "../modelos/likes.model";

const likesRoutes = Router();


//like post
likesRoutes.post('/like', (req: any, res: Response) => {
    const likesito = {
        idUsuario: req.body.idUsuario,
        idPost: req.body.idPost,
    }
// en vez de false remove
    Likes.find(likesito).then(userDB => {
        //console.log('userDB', userDB);

        if (userDB.length > 0) {
            //remove like
            Likes.deleteOne(likesito).then(userDB => {

            res.json({
                ok: false,
                mensaje: "quitaste el like :("
            });
        });
        } else {
            Likes.create(likesito).then(userDB => {

                res.json({
                    ok: true,
                    like: userDB,
                    mensaje: "like añadido :)"

                });

            });
        }
    })

});


//getLikes de post

likesRoutes.get('/getlikes/:postid', async (req: any, res: Response) => {

    let prueba: any[] = [];
    const postId = req.params.postid;
    

        const postLike:any = await Likes.find({idPost:postId})
        .exec();
        //get idUsuario de postlike
       prueba=postLike.map((ele:any)=>{
            return ele.idUsuario
        })


  





    res.json({
        ok: true,
        //pagina:pagina,
        usuarios: prueba,
        numeroLikes: prueba.length

    });
});


//getLikes por usuario

likesRoutes.get('/getpostlike/:userid', async (req: any, res: Response) => {


    
    const userid = req.params.userid;

    
    const postLike:any = await Likes.find({idUsuario:userid})
        .exec();


    






    res.json({
        ok: true,
        //pagina:pagina,
        posts: postLike,
        //numeroLikes: prueba.length

    });
});



//unlike post
likesRoutes.post('/unlike', (req: any, res: Response) => {
    const likesito = {
        idUsuario: req.body.idUsuario,
        idPost: req.body.idPost,
    }

    Likes.deleteOne(likesito).then(userDB => {

        res.json({
            ok: true,
            // like:userDB,

        });


    });



});






export default likesRoutes;