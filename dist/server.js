import express from "express";
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
// Bibliotecas para manipular diretórios
import { fileURLToPath } from 'url';
import path from 'path';
import fileUpload from "express-fileupload";
// Rotas
import router from "./routers/produtos.js";
const app = express();
export const prisma = new PrismaClient();
app.use(express.json());
app.use(cors());
app.use(fileUpload());
/************************************Diretórios************************************************ */
const __filename = fileURLToPath(import.meta.url); // Rota com o arquivo atual
console.log(__filename);
const __dirname = path.dirname(__filename); // Rota onde contém o arquivo atual
console.log(__dirname);
app.use(express.static(path.join(__dirname, '../public'))); // Endereço principal
/***********************************Exibir Arquivo no Front************************************************ */
app.use('/imagens', express.static(path.join(__dirname, '../public/imagens')));
/**************************************************************************************** */
// Rota que carrega um arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.use("/api", router);
app.listen(3000, () => console.log("Servidor na porta 3000"));
//# sourceMappingURL=server.js.map