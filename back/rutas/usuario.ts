import { Router,Request,Response } from "express";
import { Usuario } from '../modelos/usuario.model';
import bcrypt from 'bcrypt'
import Token from "../clases/token";
import { verificarToken } from '../middlewares/autenticacion';
import  FileSystem  from '../clases/file-system';
import bodyParser from "body-parser";
import { fileUpload } from "../interfaces/file-upload";
import axios from 'axios';

const userRoutes= Router();
const fileSystem=new FileSystem();
const url = 'https://api.brevo.com/v3/smtp/email';
const apiKey = 'apibrevo';

//TODO: en el front hay que hacer que verifique el usuario con dos parametros
//TODO:aqui en el back si no esta verificado no puede hacer nada
//TODO: crear guard para denegar acceso a las pantallas
//verificar cuenta
userRoutes.post('/verificar',async(req:Request,res:Response)=>{
   const {token,email}=req.body;
   //console.log(token,email);
   

    const user = await Usuario.findOne({email:email}).exec();

    if(user!.token==token){
        // user.token='';
        // user.save();

        const updateUser=await Usuario.findByIdAndUpdate(user!._id,{token:'',verificado:true}).exec()
        .then((user:any)=>{

            const tokenUser=Token.getToken({
                _id:user._id,
                nombre:user.nombre,
                email:user.email,
                desc:user.desc,
                imagen:user.imagen
            });
            res.json({
                ok:true,
                msg:'Usuario verificado',
                token:tokenUser
            });
        })
        


       

    }else{
        res.json({
            ok:false,
            msg:'Token expirado'
        });
    }


});


//inicar sesion
userRoutes.post('/login',(req:Request,res:Response)=>{
    const body=req.body;
    //buscamos el email en la base de datos
    Usuario.findOne({email: body.email},(err: any,userDB: any)=>{
        if(err) throw err;
        //si no existe mandamos esto y salinmos
        if(!userDB){
            return res.json({
                ok:false,
                mensaje:"usuario/contraseña no son correctas"

            });
        }
        if(userDB.token!=''){
            return res.json({
                ok:false,
                mensaje:" Comprueba tu correo electronico para verificar tu cuenta"
            });
        }

        // en caso de que exista ,comprobamos la contraseña que esta encriptada
        //si es correcto  comrpobaremos el token, y cogeremos los datos del usuario
        //añadir aqui los nuevos campos
        if(userDB.compruebaPass(body.password)){
            const tokenUser=Token.getToken({
                _id:userDB._id,
                nombre:userDB.nombre,
                email:userDB.email,
                desc:userDB.desc,
                imagen:userDB.imagen
            });
            res.json({
                ok:true,
                token:tokenUser

            });
        }else{
            return res.json({
                ok:false,
                mensaje:"usuario/contraseña no son correctas "

            });
        }

    })


});


//obtener los atributos del  usuario
userRoutes.get('/getusu/:userid',async(req:any,res:Response)=>{
   
    const prueba:any[]=[];
    const userId=req.params.userid;
    const user = await Usuario.find()  
    .exec(); 

    user.forEach((ele:any)=>{
        if(ele._id==userId){
            //console.log("entra"); 
            prueba.push(ele)          
        }
    })
    prueba[0].password='';

    res.json({
        ok:true,
        userId:userId,
        user:prueba,
        
    });
});





//crear un usuario

userRoutes.post('/create', async (req: Request, res: Response) => {
    try {

      const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        imagen: req.body.imagen,
        desc: req.body.desc,
        password: bcrypt.hashSync(req.body.password, 10),
        token:bcrypt.hashSync(req.body.email, 10)
      };
      //console.log('user',user);
      
      
  
      const userDB =await Usuario.findOne({ nombre: user.nombre })
    .exec()
      
      if (userDB) {
        //console.log('userDB',userDB);
        
        return res.json({
          ok: false,
          mensaje: "Ya existe un usuario con ese nombre de usuario"
        });
      }
  
      const userBd = await Usuario.findOne({ email: user.email });
      //console.log('userBD',userBd);
      
      if (userBd) {
        return res.json({
          ok: false,
          mensaje: "Ya existe un usuario con ese email"
        });
      }
      const userCreated = await Usuario.create(user);
      
    //   const tokenUser = Token.getToken({
    //     _id: userCreated._id,
    //     nombre: userCreated.nombre,
    //     email: userCreated.email,
    //     desc: userCreated.desc,
    //     imagen: userCreated.imagen
    //   });
  
      // crear carpetas
      // fileSystem.(userCreated._id);

      //enviar email
      const payload = {
        "sender": {
          "email": "email"
        },
        "to": [
          {
            "email": user.email
          }
        ],
        
        "htmlContent": `<a href="url/inicio/login?verificar=${user.token}&email=${user.email}"> Verificar aqui</a>`,
        "subject": "Autenticacion de cuenta",
      };
      
      axios.post(url, payload, {
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json'
        }
      })
      .then(function(response) {
        //console.log(response.data);
        res.json({
            ok: true,
            // token: tokenUser,
            msg:"Correo enviado , revisa tu bandeja de entrada para verificar tu cuenta"
          });
      })
      .catch(function(error) {
        console.error(error);
      });
  
      
    } catch (error:any) {
      res.status(500).json({
        ok: false,
        mensaje: "Ha ocurrido un error al crear el usuario, intentelo de nuevo.",
        error: error.message
      });
    }
  });
  

//actualizar datos usuarios

// [verificarToken],verificarToken
userRoutes.post('/update',verificarToken,async (req:any,res:Response)=>{


    if(req.body.nombre==undefined && req.body.email==undefined && req.body.desc==undefined && req.files==null){      
        return res.json({
            ok:false,
            msg:"no se ha enviado ningun dato"
        });
    }

    if(req.files!=null){
        const id=req.usuario._id
        const file:fileUpload=req.files.image;
        const imageNueva= await fileSystem.guardarImagenPerfil(file,id);
    }
    
    const ruta = fileSystem.obtenerImagenesPerfil(req.usuario._id)
    // //console.log('ruta',ruta);
   
    
    // //console.log('body: ',req.body);
    //console.log('usuario: ',req.usuario);
    
  //comprobar que req.body tiene datos
  if(req.body.nombre!=undefined){
    //console.log('body: ',req.body);

  const userDB =await Usuario.findOne({ nombre: req.body.nombre })
  .exec()
    // //console.log( userDB!.nombre!=req.usuario.nombre);
    
    if (userDB && userDB.nombre!=req.usuario.nombre) {
      //console.log('userDB',userDB);
      
      return res.json({
        ok: false,
        msg: "Ya existe un usuario con ese nombre de usuario"
      });
    }
  }

  //TODO: comprobar que req.body tiene datos si no tiene datos no actualizar


    
    
    const user=req.body;
    user.imagen=ruta[0];
    // {
    //     //en caso de que no venga algun dato volvemos a dejar la informacion que ya existía
    //     nombre: req.body.name || req.usuario.nombre,
    //     email:req.body.email    || req.usuario.email,
    //      desc:req.body.desc?,
    //      imagen:ruta[0] || req.usuario.imagen,
        
      
    // }
    //comprobamos que existe el usuario
    Usuario.findByIdAndUpdate(req.usuario._id,user,{new:true},(err,userDB)=>{


        if(err)throw err;

        if(!userDB){
            return res.json({
                ok:false,
                mensaje:"no existe el usuario con ese id"
               

            });

        }

        //generamos l nuevo token con los datos del usuario
        const tokenUser=Token.getToken({
            _id:userDB._id,
            nombre:userDB.nombre,
            email:userDB.email,
            desc:userDB.desc,
            imagen:userDB.imagen
            
        });
        res.json({
            ok:true, 
            token:tokenUser
           // mensaje:'todo funcionan correctamente'
        });



    });
       
         
      


});


//devolver la informacion del token 
userRoutes.get('/',[verificarToken],(req:any,res:Response)=>{
   
    const usuario=req.usuario;

    res.json({
        ok:true,
        usuario,
    })
    

});

//devolver userid del token 
userRoutes.get('/get',[verificarToken],(req:any,res:Response)=>{
   
    const usuario=req.usuario._id;
    const userVerify:any=Usuario.findById(usuario).exec();
    try{

    
    userVerify.then((value:any) => {
        //console.log('userVerify',userVerify);
        let token=false;
        if(value.token==''){
            token=true;}
        res.json({
            ok:true,
            usuario,
            verificado:token,
        })
        
    })

}catch(error){
    //console.log('error',error);
    
    res.json({
        ok:false,
        usuario,
        verificado:false

    })
}
    

   
    

});

//devolver icono de usuario 
userRoutes.get('/geticon/:userid',async (req:any,res:Response)=>{
    var imagen:string='';
    var nombre:string='';
    var desc:string='';
    var email:string='';
    var password:string='';

    const userId=req.params.userid;
    const user = await Usuario.find()
    .exec();
    
    
    user.forEach((ele:any)=>{
        if(ele._id==userId){
            //console.log("encuentra id");
            imagen=ele.imagen
            nombre=ele.nombre
            desc=ele.desc
            email=ele.email
            // password=ele.password
        
            //console.log('imagen',imagen);
      
            
            
            
        }
    })
    //localhost:3000/user/geticon/61fd18477bece05749331f3f
    
     

    res.json({
        ok:true,
        userId:userId,
        imagen:imagen,
        nombre:nombre,
        desc:desc,
        email:email,
        // password:password

        
    });
    

});

//devolver icono y nombre de usuario
userRoutes.get('/geticonname/:userid',async (req:any,res:Response)=>{

    var imagen:string='';
    var nombre:string='';
    const userId=req.params.userid;
    const user = await Usuario.find()
    .exec();
    
    
    user.forEach((ele:any)=>{
        if(ele._id==userId){
            //console.log("entra");
            //console.log('el user',ele);
            
            imagen=ele.imagen
            nombre=ele.nombre
            
        }
    })
    //localhost:3000/user/geticon/61fd18477bece05749331f3f
    
     

    res.json({
        ok:true,
        userId:userId,
        imagen:imagen,
        nombre:nombre,
        
    });
    

})

// devolver  id a traves del nombre
userRoutes.get('/getid/:username',async (req:any,res:Response)=>{

    
    const name=req.params.username;
     const user =await Usuario.findOne({ nombre: name })
    .exec()
    if(user!=undefined){
        
    res.json({
        ok:true,
        userId:user._id,
       
        
    });
   
    
     

}else{
    res.json({
        ok:false,
        mensaje:"no existe el usuario con ese id"
       

    });
    

}

    });








userRoutes.post('/aftercreate',[verificarToken],(req:any,res:Response)=>{

    const body =req.body;
    body.usuario=req.usuario._id;
    const imagenes=fileSystem.imagenesTempToPost(req.usuario._id);
     body.img=imagenes;

    Usuario.create(body).then(async postDB=>{
        //nos muestre los datos del usuario
        await postDB.populate('usuario','-password');

        res.json({
            ok:true,
            post:postDB
    
        });

    }).catch(err=>{
        res.json(err);
    })

   
});

//servicio para subir archivos imagenes y videos
userRoutes.post('/upload',[verificarToken],async (req:any,res:Response)=>{
// //console.log('body',req.usuario._id);
const id=req.usuario._id

    //si no existen archivos
    if(!req.files){
        return res.status(400).json({
            ok:false,
            mensaje:'No se subió ningun archivo'
        });
    }
    ////console.log('upload',req.files.image);
    const file:fileUpload=req.files.image;
    //console.log('file',file);
    //console.log('id',id);
    
  
   const imageNueva= await fileSystem.guardarImagenPerfil(file,id);
  
   
    if(!file){
        return res.status(400).json({
            ok:false,
            mensaje:'No se subió ningun archivo'
        });
    }

    //comprobar que no es una imagen //hay que hacerque se puedan subir videos
    //mimetype es el para identificar el tipo de archivo
    if(!file.mimetype.includes('image') && !file.mimetype.includes('video')){
        return res.status(400).json({
            ok:false,
            mensaje:'no es una tipo de archivo valido'
        });
    }
    //manda el archivo y el id

   

    res.json({
        ok:true,
        file:file.mimetype,
        nombreImagen:imageNueva


    });

    //console.log('sale');
    

});



//coger las imagenes y videos
userRoutes.get('/imagen/:userid/:img',(req:any,res:Response)=>{
    const userId=req.params.userid;
    const img=req.params.img;
    const pathFoto=fileSystem.getFotoUrlPerfil(userId,img);
    res.sendFile(pathFoto);
    
    });




    // [comprobar email
userRoutes.post('/email',verificarToken,async (req:any,res:Response)=>{
    //console.log(req.usuario);
   let emailNuevo=req.body.email;
   if(emailNuevo==req.usuario.email){
    return res.json({
        existe:false,   
    });
   }
   
    
    
    
  
    //comprobamos que existe el usuario
    const userDB=await Usuario.findOne({email:emailNuevo});
    //console.log('userDB',userDB);
    
    if(userDB){
      return  res.json({
            existe:true,   
        });
    }else{
     return   res.json({
            existe:false,   
        });
    }
    
         
      


});


export default userRoutes;
