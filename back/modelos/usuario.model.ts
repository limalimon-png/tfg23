import {Schema,model,Document} from 'mongoose';
import bcrypt from 'bcrypt';


//estructura usuario
const usuarioSchema:Schema<IUsuario>=new Schema({
    
nombre:{
    type:String,
    required:[true,"campo nombre obligatorio"]

},

imagen:{
    type:String,
    default:'av-1.png'
},

email:{
    type:String,
    unique:true,
    required:[true,"campo email obligatorio"]
},
desc:{
    type:String,

    default:'Introduce la descripción'
},

token:{
    type:String,
    default:''
},


password:{
    type:String,
    required:[true,"campo contraseña obligatorio"]
}


});




usuarioSchema.method('compruebaPass',function(password: string=''):boolean{

    return !!(bcrypt.compareSync(password,this.password));

});

//creamos la interfaz
interface IUsuario extends Document{
    nombre: string;
    email:string;
    imagen:string;
    password:string;
    desc:string;
    token:string;
    compruebaPass(password:string):boolean;
}

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);