import fs from "fs";
import path from "path";
import express from "express";

const router = express.Router();

// Caminhos dos JSONs
const caminhoItens = path.join("dados", "itens.json");
const caminhoImp = path.join("dados", "impressao.json");
const caminhoDim = path.join("dados", "dimensoes.json");
const caminhoConfig = path.join("dados", "config.json");
const caminhoImpres = path.join("dados", "impressoras.json");

// ---------------------------
// Função auxiliar para ler JSON
// ---------------------------
function lerJSON(caminho, chave) {
  try {
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    return dados[chave] ?? [];
  } catch {
    return [];
  }
}

// ---------------------------
// Função de cálculo
// ---------------------------
function calcularCustoItem(id_item) {
  const itens = lerJSON(caminhoItens, "Item");
  const item = itens.find(i => i.id_item == id_item);
  if (!item || item.tipo !== "impressao") {
    throw new Error("Item não encontrado ou não é impressão");
  }

  const impressoes = lerJSON(caminhoImp, "Impressao");
  const impressao = impressoes.find(i => i.id_imp == item.id_ref);
  if (!impressao) throw new Error("Impressão não encontrada");

  const dimensoes = lerJSON(caminhoDim, "Dimensao");
  const dim = dimensoes.find(d => d.id_item == item.id_item);
  if (!dim) throw new Error("Dimensão não encontrada");

  const impresoras = lerJSON(caminhoImpres, "Impressora");
  const impres = impresoras.find(i => i.id_impres == impressao.id_impres);
  if (!impres) throw new Error("Impressora não encontrada");

  const configs = lerJSON(caminhoConfig, "Config");
  const config = configs.find(c => c.id_impres == impres.id_impres && c.id_color == impressao.cod_frente);
  if (!config) throw new Error("Configuração não encontrada");

  let custo_hora_calc = 0;
  const cmpr = dim.cmpr;
  const larg = dim.larg;
  const velo = impressao.velo;

  switch (impres.med_velo) {
    case "iph":
      const mrg_espaco = dim.mrg_espaco || 0;
      const mrg_sangria = dim.mrg_sangria || 0;
      const area_tecnica = (cmpr + mrg_espaco + mrg_sangria) * (larg + mrg_espaco + mrg_sangria);
      const marg_borda = dim.mrg_branca || 0;
      const qtd_folhas = ((cmpr - marg_borda) * (larg - marg_borda)) / area_tecnica;
      custo_hora_calc = (impres.custo_hora * qtd_folhas) / velo;
      break;

    case "mph":
      custo_hora_calc = (impres.custo_hora * cmpr) / velo;
      break;

    case "m2ph":
      const area_impressao = cmpr * larg;
      custo_hora_calc = (impres.custo_hora * area_impressao) / velo;
      break;

    default:
      throw new Error("Medida de velocidade inválida");
  }

  const custo_total = custo_hora_calc + (config.custo_acerto || 0) + ((config.custo_m2i || 0) * (cmpr * larg));

  return {
    id_item,
    custo_unitario: custo_total,
    detalhe: {
      custo_hora_calc,
      custo_acerto: config.custo_acerto || 0,
      custo_m2i: config.custo_m2i || 0,
      n_pass: impressao.n_pass
    }
  };
}

// ---------------------------
// POST /calculo
// ---------------------------
router.post("/calculo", (req, res) => {
  try {
    const { id_item } = req.body;
    if (!id_item) return res.status(400).json({ mensagem: "id_item é obrigatório" });

    const resultado = calcularCustoItem(Number(id_item));
    res.json(resultado);

  } catch (erro) {
    console.error("❌ Erro no POST /calculo:", erro.message);
    res.status(500).json({ mensagem: erro.message });
  }
});

// ---------------------------
// GET /calculo/:id_item
// ---------------------------
router.get("/calculo/:id_item", (req, res) => {
  try {
    const { id_item } = req.params;
    if (!id_item) return res.status(400).json({ mensagem: "id_item é obrigatório" });

    const resultado = calcularCustoItem(Number(id_item));
    res.json(resultado);

  } catch (erro) {
    console.error("❌ Erro no GET /calculo/:id_item:", erro.message);
    res.status(500).json({ mensagem: erro.message });
  }
});

export default router;
