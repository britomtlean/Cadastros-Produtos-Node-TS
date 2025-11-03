import express from "express";
import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import path from "path";
const router = express.Router();
const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/*********************************************Rota para receber produtos******************************************** */
router.get("/sites", async (req, res) => {
    const sites = await prisma.sites.findMany();
    res.status(200).json(sites);
});
export default router;
//# sourceMappingURL=sites.js.map