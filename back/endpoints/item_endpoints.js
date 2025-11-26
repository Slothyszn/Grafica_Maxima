import fs from "fs/promises";
import express from "express";
const router = express.Router();

const CAMINHO_ITENS = "dados/itens.json";
const CAMINHO_ORCAMENTOS = "dados/orcamentos.json";

// ==========================
// Auxiliar: ler JSON
// ==========================
async function lerJSON(caminho) {
  try {
    const conteudo = await fs.readFile(caminho, "utf-8");
    return JSON.parse(conteudo || "{}");
  } catch {
    return {};
  }
}

// ==========================
// Recalcular total do orçamento
// ==========================
async function recalcularTotalOrcamento(id_orc) {
  const dadosOrc = await lerJSON(CAMINHO_ORCAMENTOS);
  const dadosItens = await lerJSON(CAMINHO_ITENS);

  const orc = dadosOrc.Orcamento?.find(o => o.id_orc == id_orc);
  if (!orc) return;

  const itens = (dadosItens.Item || []).filter(i => i.id_orc == id_orc);

  const soma = itens.reduce((acc, i) => acc + Number(i.custo_parcial), 0);

  let total = soma;

  if (orc.perc_lucro) total += soma * (orc.perc_lucro / 100);
  if (orc.adicional) total += Number(orc.adicional);

  orc.total = total;

  await fs.writeFile(CAMINHO_ORCAMENTOS, JSON.stringify(dadosOrc, null, 2));
}

// ==========================
// GET — listar todos os itens
// ==========================
router.get("/", async (req, res) => {
  const dados = await lerJSON(CAMINHO_ITENS);
  res.json(dados.Item ?? []);
});

// ==========================
// GET — itens de um orçamento
// ==========================
router.get("/orc/:id_orc", async (req, res) => {
  const id_orc = req.params.id_orc;
  const dados = await lerJSON(CAMINHO_ITENS);

  const lista = (dados.Item ?? []).filter(i => i.id_orc == id_orc);
  res.json(lista);
});

// ==========================
// POST — adicionar item
// ==========================
router.post("/", async (req, res) => {
  const dados = await lerJSON(CAMINHO_ITENS);
  if (!dados.Item) dados.Item = [];

  const novo = {
    id_item: Date.now(),
    ...req.body
  };

  dados.Item.push(novo);

  await fs.writeFile(CAMINHO_ITENS, JSON.stringify(dados, null, 2));

  await recalcularTotalOrcamento(novo.id_orc);

  res.status(201).json(novo);
});

// ==========================
// PUT — editar item
// ==========================
router.put("/:id_item", async (req, res) => {
  const id_item = req.params.id_item;
  const dados = await lerJSON(CAMINHO_ITENS);

  const index = (dados.Item ?? []).findIndex(i => i.id_item == id_item);
  if (index === -1)
    return res.status(404).json({ erro: "Item não encontrado" });

  const id_orc = dados.Item[index].id_orc;

  dados.Item[index] = { ...dados.Item[index], ...req.body };

  await fs.writeFile(CAMINHO_ITENS, JSON.stringify(dados, null, 2));

  await recalcularTotalOrcamento(id_orc);

  res.json(dados.Item[index]);
});

// ==========================
// DELETE — remover item
// ==========================
router.delete("/:id_item", async (req, res) => {
  const id_item = req.params.id_item;
  const dados = await lerJSON(CAMINHO_ITENS);

  const lista = dados.Item ?? [];
  const item = lista.find(i => i.id_item == id_item);

  if (!item)
    return res.status(404).json({ erro: "Item não encontrado" });

  const id_orc = item.id_orc;

  dados.Item = lista.filter(i => i.id_item != id_item);

  await fs.writeFile(CAMINHO_ITENS, JSON.stringify(dados, null, 2));

  await recalcularTotalOrcamento(id_orc);

  res.json({ mensagem: "Item removido com sucesso" });
});

export default router;