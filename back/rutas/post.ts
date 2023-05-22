import { Router, Response } from 'express';
import { verificarToken } from '../middlewares/autenticacion';
import { Post } from '../modelos/post.model';
import { fileUpload } from '../interfaces/file-upload';
import FileSystem from '../clases/file-system';

const postRoutes = Router()
const fileSystem = new FileSystem();
import { Likes } from "../modelos/likes.model";


//obtener post con paginacion
postRoutes.get('/', async (req: any, res: Response) => {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    //recibimos los diferentes posts y luego los mostramos
    const posts = await Post.find().
        //ordenamos de forma descendente
        sort({ _id: -1 })
        .skip(skip)
        //limita a 10 resultados
        .limit(10)
        //de la informacion de usuario, quitamos el password
        .populate('usuario', '-password')
        //ejecuta la query
        .exec();


    res.json({
        ok: true,
        pagina: pagina,
        posts
    });
});


//obtener todos los post de un usuario
//TODO: paginar los Post coger de 3 en 3 menos en la primera llamada, que se cogen 6
// Controlador para manejar las solicitudes GET en la ruta '/perfil/:userid'
postRoutes.get('/perfil/:userid', async (req: any, res: Response) => {

    // Obtener el número de página de la solicitud del cliente. Si no se proporciona, se establece en 1.
    let pagina = Number(req.query.pagina) || 1;

    // Calcular el número de documentos a omitir en la consulta para la paginación
    let skip = pagina - 1;
    skip = skip * 9;

    // Obtener el ID del usuario de la solicitud de la ruta
    const userId = req.params.userid;

    // Buscar los posts en la base de datos donde el atributo 'usuario' sea igual al ID del usuario
    const posts = await Post.find({ usuario: userId })
        .sort({ _id: -1 }) // Ordenar los resultados por el valor _id en orden descendente
        .skip(skip) // Omitir el número de documentos especificado por la variable skip
        .limit(9) // Limitar la consulta a un máximo de 10 documentos
        .populate('usuario', '-password') // Reemplazar el ID del usuario en cada post con el objeto de usuario correspondiente, excluyendo la propiedad 'password'
        .exec(); // Ejecutar la consulta y devolver una promesa


    for (let i = 0; i < posts.length; i++) {

        const postLike: any = await Likes.find({ idPost: posts[i].id })
            .exec();

        posts[i].likes = postLike.length
        // //console.log(postLike.length)

    }

    //get idUsuario de postlike
    //    prueba=postLike.length

    // Enviar los resultados de la consulta como una respuesta JSON al cliente
    res.json({
        ok: true,
        userId: userId, // Enviar el ID del usuario en la respuesta
        pagina: pagina, // Enviar el número de página actual en la respuesta
        posts: posts, // Enviar los posts recuperados en la respuesta
    });
});


//obtener post por id
postRoutes.get('/perfil2/:postid', async (req: any, res: Response) => {

    let prueba: any[] = [];
    const postId = req.params.postid;
    const posts = await Post.find({ _id: postId })
        .populate('usuario', '-password')
        .exec();


    prueba.push(posts[0]);


    const postLike: any = await Likes.find({ idPost: prueba[0].id })
        .exec();

    prueba[0].likes = postLike.length
    //console.log('likes', postLike.length)






    res.json({

        posts: prueba,

    });
});






//Crear post
postRoutes.post('/upload', [verificarToken], async (req: any, res: Response) => {
    // //console.log('usuario', req.usuario._id);
    //si no existen archivos
    if (!req.files) {
        //console.log('no hay archivos');
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo'
        });

    }
    const files: fileUpload[] = [];
    if (req.files.image.length > 1) {
        files.push(...req.files.image);
    } else {
        files.push(req.files.image);

    }
    if (!files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo'
        });
    }
    //comprobar que no es una imagen //hay que hacerque se puedan subir videos
    //mimetype es el para identificar el tipo de archivo
    for (const file of files) {
        //console.log('file', file.name);

        if (!file.mimetype.includes('image') && !file.mimetype.includes('video')) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no es una tipo de archivo valido'
            });
        }
    }
    function asyncForEach(array: any[], callback: any) {
        return Promise.all(array.map(callback));
    }

    await asyncForEach(files, async (element: any) => {
        const file: fileUpload = element;
        await fileSystem.guardarImagenTemporal(file, req.usuario._id);
    });

    const nombres: string[] = fileSystem.imagenesTempToPost(req.usuario._id)
    const body = req.body;
    body.usuario = req.usuario._id;
    body.img = nombres;

    Post.create(body).then(async postDB => {
        //nos muestre los datos del usuario
        await postDB.populate('usuario', '-password');

        res.json({
            ok: true,
            post: postDB

        });

    }).catch(err => {
        res.json(err);
    })
});


//actualizar datos post

// [verificarToken],verificarToken
postRoutes.post('/update', (req: any, res: Response) => {
    //console.log('body', req.body);
    //console.log('iamgenes', req.body.img);
    const body = req.body;





    //comprobamos que existe el usuario
    Post.findByIdAndUpdate(body._id, body, { new: true }, (err, userDB) => {


        if (err) throw err;

        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: "no existe ese post"


            });

        }

        res.json({
            ok: true
        })



    });




});




//coger las imagenes y videos
postRoutes.get('/imagen/:userid/:img', (req: any, res: Response) => {
    //console.log('datos', req.params);

    const userId = req.params.userid;
    const img = req.params.img;
    const pathFoto = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathFoto);

});

//get post a traves del id
postRoutes.get('/getlikepost/:postid', async (req: any, res: Response) => {

    const prueba: any[] = [];
    const postId = req.params.postid;
    const posts = await Post.find()
        .populate('usuario', '-password')
        .exec();


    posts.forEach((ele: any) => {
        if (ele._id == postId) {
            // //console.log("entra");
            prueba.push(ele)

        }
    })




    res.json({
        ok: true,
        //pagina:pagina,
        posts: prueba,
        //numeroLikes: prueba.length

    });
});

export default postRoutes;

function of(arg0: boolean) {
    throw new Error('Function not implemented.');
}
