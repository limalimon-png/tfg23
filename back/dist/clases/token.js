"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Token {
    static getToken(payload) {
        //firmar el token
        return jsonwebtoken_1.default.sign({
            usuario: payload
        }, this.seed, { expiresIn: this.cadudidad });
    }
    static comprobarToken(userToken) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(userToken, this.seed, (err, decoded) => {
                if (err) {
                    //error
                    reject();
                }
                else {
                    //token valido
                    resolve(decoded);
                }
            });
        });
    }
}
exports.default = Token;
//la semilla es la palabra secreta que usaremos
Token.seed = 'nombre de la semilla';
Token.cadudidad = '30d';
