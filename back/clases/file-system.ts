import { fileUpload } from '../interfaces/file-upload';
import path from 'path'
import fs from 'fs'
import uniqid from 'uniqid';
export default class FileSystem {
    constructor() { }

    guardarImagenTemporal(file: fileUpload, userId: string) {
        //para poder usar el async y el await se hace en promesas
        //todas las promesas devuelven resolve>lo que ejecuta su va bien y reject si fall

        return new Promise<void>((resolve, reject) => {

            //crear nombre carpetas
          
            
            const path = this.crearCarpetaUsuario(userId);
            console.log('sera el final del hombre araña');
            //crear nombre archivo
            const nombreArchivo = this.generarNombreArchivo(file.name);

            //mover a la carpeta temporal
            file.mv(`${path}/${nombreArchivo}`, (err: any) => {
                if (err) {
                    reject(err);

                } else {
                    resolve();
                }

            })


        })






    }
    //genera un nombre unico
    private generarNombreArchivo(nombreOriginal: string) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const nombreUnico = uniqid();

        return nombreUnico + '.' + extension

    }

    //creamos una carpeta para cada usuario con su id para identificarlo
    private crearCarpetaUsuario(userId: string) {
        //dirname nos da la ruta desde la raiz del dispositivo
        const pathUser = path.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = pathUser + '/temp';
        // console.log(pathUser);

        const existe = fs.existsSync(pathUser);
        const existe2 = fs.existsSync(pathUserTemp);
        
        if (!existe) {
            fs.mkdirSync(pathUser)
            fs.mkdirSync(pathUserTemp)

            
        }else{
            if(!existe2){
            fs.mkdirSync(pathUserTemp)}
        }
        
        return pathUserTemp;

    }


    //mover los archivos multimedia del temp a post
    imagenesTempToPost(userId: string) {
        const pathTemp = path.resolve(__dirname, '../uploads', userId, 'temp');
        const pathPosts = path.resolve(__dirname, '../uploads', userId, 'posts');
        if (!fs.existsSync(pathTemp)) {
            return [];
        }
        if (!fs.existsSync(pathPosts)) {
            fs.mkdirSync(pathPosts);
        }

        const imagenesTemp = this.obtenerImagenesEnTemp(userId);
        imagenesTemp.forEach(img => {
            fs.renameSync(`${pathTemp}/${img}`, `${pathPosts}/${img}`)
        });
        return imagenesTemp;

    }

    obtenerImagenesEnTemp(userId: string) {

        const pathTemp = path.resolve(__dirname, '../uploads', userId, 'temp');
        return fs.readdirSync(pathTemp) || [];

    }
    obtenerImagenesPerfil(userId: string) {

        const pathTemp = path.resolve(__dirname, '../uploads', userId, 'perfil');

        console.log('pathTemp', pathTemp);
        
          try {
            return fs.readdirSync(pathTemp) || [];
            
        } catch (error) {
            return [];
        }

    }
    getFotoUrl(userId: string, img: string) {

        const pathFoto = path.resolve(__dirname, '../uploads', userId, 'posts', img);
 
        

        const existe = fs.existsSync(pathFoto);
   
        
        //en caso de que no tenga imagenes coge la no imagen
        if (!existe) {
            return path.resolve(__dirname, '../assets/noimage.png');

        }

        return pathFoto;

    }
    getFotoUrlPerfil(userId: string, img: string) {

        const pathFoto = path.resolve(__dirname, '../uploads', userId, 'perfil', img);

        const existe = fs.existsSync(pathFoto);
        //en caso de que no tenga imagenes coge la no imagen
        if (!existe) {
            return path.resolve(__dirname, '../assets/noimage.png');

        }

        return pathFoto;

    }

    //crear carpetas para post temp y perfil
    // crearCarpetaConPerfil(userId: string) {
    //     //dirname nos da la ruta desde la raiz del dispositivo
    //     const pathUser = path.resolve(__dirname, '../uploads', userId);
    //     const pathUserPerfil = pathUser + '/perfil';
    //     // console.log(pathUser);


    //crear en la carpeta del usuario la carpeta fotoPerfil
    guardarImagenPerfil(file: fileUpload, userId: string) {
        //para poder usar el async y el await se hace en promesas
        //todas las promesas devuelven resolve>lo que ejecuta su va bien y reject si fall
        // console.log('userid', userId);
        // console.log('fileUpload', file);

        return new Promise<any>((resolve, reject) => {

            //crear nombre carpetas
            // console.log('crear carpeta');
            
            const path = this.crearCarpetaConPerfil(userId);
            //crear nombre archivo
            // console.log('crear nombre archivo');
            
            const nombreArchivo = this.generarNombreArchivo(file.name);
            const fs = require('fs')
            const dir = path + '/'
            // console.log('antes de escanear');
            console.log('dir', dir);
            
            const files = fs.readdirSync(dir)
            // console.log('todos las imagenes', files);



            for (const file of files) {
                try {
                    fs.unlinkSync(path + '/' + file)
                    console.log('File removed')
                } catch (err) {
                    console.error('Something wrong happened removing the file', err)
                }

            }


            //mover a la carpeta perfil
            file.mv(`${path}/${nombreArchivo}`, (err: any) => {
                if (err) {
                    reject(err);

                } else {
                    resolve(nombreArchivo);
                }

            })


        })




    }

    private crearCarpetaConPerfil(userId: string) {
        //dirname nos da la ruta desde la raiz del dispositivo
        const pathUser = path.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = pathUser + '/perfil';
        // console.log(pathUser);

        const existe = fs.existsSync(pathUser);
        if (!existe) {
            fs.mkdirSync(pathUser)
            fs.mkdirSync(pathUserTemp)

        }
        const existe2 = fs.existsSync(pathUserTemp);
        if (!existe2) {
            fs.mkdirSync(pathUserTemp)

        }
        return pathUserTemp;

    }
}
