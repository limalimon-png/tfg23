"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guardados = void 0;
const mongoose_1 = require("mongoose");
//structura likes
const postSchema = new mongoose_1.Schema({
    idPost: {
        type: String
    },
    idUsuario: {
        type: String
    }
});
exports.Guardados = (0, mongoose_1.model)('Guardados', postSchema);
