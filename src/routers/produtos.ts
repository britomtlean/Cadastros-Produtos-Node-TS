import express from "express";
import { PrismaClient } from "@prisma/client";

import { fileURLToPath } from "url";
import path from "path";
import type { UploadedFile } from "express-fileupload";

const router = express.Router();
const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.get("/produtos", async (req, res) => {
    const produtos: object = await prisma.produtos.findMany()
    res.status(200).json(produtos)
})

/*****************************Rota para inserir produtos com imagem********************************************** */

router.post("/produtos", async (req, res) => {
  try {
    if (!req.files || !req.files.imagem) {
      return res.status(400).json({ erro: "Imagem é obrigatória." });
    }

    const { produto_produtos, descricao_produtos, valor_produtos, estoque_produtos } = req.body;
    const imagem = req.files.imagem as UploadedFile;

    const nomeArquivo = imagem.name;
    const pastaImagens = path.join(__dirname, "../imagens"); // volta uma pasta se necessário
    const caminhoDestino = path.join(pastaImagens, nomeArquivo);

    await new Promise<void>((resolve, reject) => {
      imagem.mv(caminhoDestino, (err) => (err ? reject(err) : resolve()));
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
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ message: "Erro ao cadastrar produto." });
  }
});

export default router;
