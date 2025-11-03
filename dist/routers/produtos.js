import express from "express";
import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import path from "path";
const router = express.Router();
const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/*********************************************Rota para receber produtos******************************************** */
router.get("/produtos", async (req, res) => {
    const produtos = await prisma.produtos.findMany();
    res.status(200).json(produtos);
});
/********************************************Rota para inserir produtos com imagem********************************************** */
router.post("/produtos", async (req, res) => {
    try {
        if (!req.files || !req.files.imagem) {
            return res.status(400).json({ erro: "Imagem é obrigatória." });
        }
        /****************************************Configurações********************************************* */
        const { produto_produtos, descricao_produtos, valor_produtos, estoque_produtos } = req.body; //recebe variáveis do body
        const imagem = req.files.imagem; //recebe arquivo do body
        const nomeArquivo = imagem.name; //define o nome do arquivo
        const pastaImagens = path.join(__dirname, "../../public/imagens"); //define a pasta onde armazenar o arquivo
        const caminhoDestino = path.join(pastaImagens, nomeArquivo); //configura os dados para mover o arquivo
        console.log("caminho da imagem: ", caminhoDestino);
        /******************************************************************************************************** */
        await new Promise((resolve, reject) => {
            imagem.mv(caminhoDestino, (err) => (err ? reject(err) : resolve())); //código para mover o arquivo com base nos dados configurados
        });
        const novoProduto = await prisma.produtos.create({
            data: {
                produto_produtos,
                descricao_produtos,
                valor_produtos: parseFloat(valor_produtos.replace(",", ".")),
                estoque_produtos: parseInt(estoque_produtos),
                imagem_produtos: nomeArquivo,
            },
        });
        res.status(201).json({ message: "Produto criado com sucesso!", produto: novoProduto });
    }
    catch (error) {
        console.error("Erro ao criar produto:", error);
        res.status(500).json({ message: "Erro ao cadastrar produto." });
    }
});
export default router;
//# sourceMappingURL=produtos.js.map