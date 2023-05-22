import Server from "./clases/server";
import userRoutes from "./rutas/usuario";
import mongoose from 'mongoose';
import cors from 'cors';


import express from "express";
import fileUpload from 'express-fileupload'
import postRoutes from './rutas/post';
import likesRoutes from "./rutas/likes";
import guardadosRoutes from "./rutas/guardados";


const server =new Server();


//recibe la informacion del post
server.app.use(express.urlencoded({extended:true}));
server.app.use(express.json());

//subir archivo
server.app.use(fileUpload());


//configurar cors para poder usar varios servidores en local
server.app.use(cors({origin:true,credentials:true}));


//rutas app
server.app.use('/user',userRoutes);
server.app.use('/posts',postRoutes);
server.app.use('/likes',likesRoutes);
server.app.use('/guardados',guardadosRoutes);

//conectar con base de datos mongoDB
const conexion='url mongoDB';
mongoose.connect(conexion,

    ( err ) => {
 
        if ( err ) throw err;
      
        console.log('Base de datos ONLINE');
    }
);


//LEVANTAR SERVIDOR EXPRESS
server.start(
    ()=>{
        console.log("servidor corriendo por el puerto "+server.port+"");
    }
);