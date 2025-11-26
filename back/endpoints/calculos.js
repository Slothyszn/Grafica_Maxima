import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Caminhos dos dados
const CAMINHO_SERV = path.join("dados", "servico.json");
const CAMINHO_PROD = path.join("dados", "produto.json");
const CAMINHO_IMPRES = path.join("dados", "impressoras.json");
const CAMINHO_CONFIG = path.join("dados", "config.json");

// Função auxiliar para ler JSON
function lerJSON(caminho, chave) {
  try {
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    return dados[chave] || [];
  } catch {
    return [];
  }
}

// ==========================
// POST /calculo
// ==========================
router.post('/calculo', (req, res) => {
  try {
    const item = req.body;

    if (!item.tipo || !item.quant) {
      return res.status(400).json({ mensagem: "Tipo e quantidade são obrigatórios" });
    }

    let custo_unitario = 0;
    let custo_parcial = 0;
    let detalhes = {};

    // ---------------------
    // SERVIÇO
    // ---------------------
    if (item.tipo === "servico") {
      const servicos = lerJSON(CAMINHO_SERV, "Servico");
      const serv = servicos.find(s => s.id_serv === item.id_ref || s.nome === item.id_ref);
      if (!serv) return res.status(404).json({ mensagem: "Serviço não encontrado" });

      custo_unitario = Number(serv.custo_fixo || 0);
      custo_parcial = custo_unitario * item.quant;
      detalhes = { preco_unitario: custo_unitario };

    // ---------------------
    // PRODUTO
    // ---------------------
    } else if (item.tipo === "produto") {
      const produtos = lerJSON(CAMINHO_PROD, "Produto");
      const prod = produtos.find(p => p.id_prod === item.id_ref || p.nome === item.id_ref);
      if (!prod) return res.status(404).json({ mensagem: "Produto não encontrado" });

      const dim = item.dimensao;
      if (!dim) return res.status(400).json({ mensagem: "Dimensões do produto são obrigatórias" });

      const area_m2 = (dim.cmpr / 100) * (dim.larg / 100); // converte cm para m
      custo_unitario = area_m2 * Number(prod.custo_m2 || 0);
      custo_parcial = custo_unitario * item.quant;
      detalhes = { preco_m2: Number(prod.custo_m2), area_m2 };

    // ---------------------
    // IMPRESSÃO
    // ---------------------
    } else if (item.tipo === "impressao") {
      const impressores = lerJSON(CAMINHO_IMPRES, "Impressora");
      const configs = lerJSON(CAMINHO_CONFIG, "Config");

      const dim = item.dimensao;
      const ref = item.id_ref;

      if (!dim || !ref) return res.status(400).json({ mensagem: "Dimensões e referência da impressão são obrigatórias" });

      const impres = impressores.find(i => i.id_impres == ref.impressora);
      if (!impres) return res.status(404).json({ mensagem: "Impressora não encontrada" });

      const config = configs.find(c => c.id_impres == impres.id_impres && c.id_color == ref.cod_frente) || {};

      // Medidas e margens
      const cmpr_m = dim.cmpr; // metros
      const larg_m = dim.larg;  // metros
      const mrg_branca = dim.mrg_branca || 0;
      const mrg_espaco = dim.mrg_espaco || 0;
      const mrg_sangria = dim.mrg_sangria || 0;

      // Velocidade
      const veloRaw = ref.velo || "1 iph";
      const velo = Number(veloRaw.split(" ")[0]);
      const tipo_velo = veloRaw.split(" ")[1] || "iph";

      let custo_hora_calc = 0;

      switch(tipo_velo) {
        case "iph":
          const area_tecnica = (cmpr_m + mrg_espaco + mrg_sangria) * (larg_m + mrg_espaco + mrg_sangria);
          const qtd_folhas = ((cmpr_m - mrg_branca) * (larg_m - mrg_branca)) / area_tecnica;
          custo_hora_calc = (impres.custo_hora * qtd_folhas) / velo;
          break;

        case "mph":
          custo_hora_calc = (impres.custo_hora * cmpr_m) / velo;
          break;

        case "m2ph":
          const area_impressao = cmpr_m * larg_m;
          custo_hora_calc = (impres.custo_hora * area_impressao) / velo;
          break;

        default:
          return res.status(400).json({ mensagem: "Tipo de velocidade inválido" });
      }

      custo_unitario = custo_hora_calc + (config.custo_acerto || 0) + ((config.custo_m2i || 0) * cmpr_m * larg_m);
      custo_parcial = custo_unitario * item.quant;
      detalhes = { custo_hora_calc, custo_acerto: config.custo_acerto || 0, custo_m2i: config.custo_m2i || 0 };
    }

    return res.json({ tipo: item.tipo, custo_unitario, custo_parcial, detalhes });

  } catch (erro) {
    console.error("❌ Erro no POST /calculo:", erro);
    return res.status(500).json({ mensagem: "Erro interno" });
  }
});

export default router;
