import jwt from 'jsonwebtoken'

export default class Token{
    //la semilla es la palabra secreta que usaremos
    private static seed: string='nombre semilla';
    private static cadudidad: string ='30d';

    static getToken(payload:any):string{

        //firmar el token
        return jwt.sign({
            usuario:payload
        },this.seed,{expiresIn:this.cadudidad})

    }


    static comprobarToken(userToken:string){
        return new Promise((resolve,reject)=>{

            jwt.verify(userToken,this.seed,(err,decoded)=>{
                if(err){
                    //error
                    reject();
                }else{
                    //token valido
                    resolve(decoded);
                }
            });



        })

       
    }
}