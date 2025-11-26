import express from "express";
import fs from "fs";

const router = express.Router();
const caminho = "dados/orcamentos.json";

// -----------------------------------------------
// GET – Buscar todos os orçamentos
// -----------------------------------------------
router.get("/orcamentos", (req, res) => {
  try {
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao ler Orçamentos" });
  }
});

// -----------------------------------------------
// GET – Buscar orçamento por ID
// -----------------------------------------------
router.get("/orcamentos/:id_orc", (req, res) => {
  try {
    const { id_orc } = req.params;
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    const orc = dados.Orcamento.find(o => o.id_orc == id_orc);
    if (!orc) {
      return res.status(404).json({ mensagem: "Orçamento não encontrado" });
    }

    res.json(orc);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar Orçamento" });
  }
});

// -----------------------------------------------
// POST – Criar novo orçamento
// -----------------------------------------------
router.post("/orcamentos", (req, res) => {
  try {
    const { nome_cli, telefone, perc_lucro, adicional, total, dt_criacao, dt_limite } = req.body;

    if (!nome_cli) {
      return res.status(400).json({ erro: "Campo 'nome_cli' é obrigatório" });
    }

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    // Gera novo ID automaticamente
    const novoId = dados.Orcamento.length
      ? Math.max(...dados.Orcamento.map(o => o.id_orc)) + 1
      : 1;

    const novo = {
      id_orc: novoId,
      nome_cli,
      telefone: telefone || "",
      perc_lucro,
      adicional,
      total,
      dt_criacao,
      dt_limite
    };

    dados.Orcamento.push(novo);
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.status(201).json(novo);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao criar Orçamento" });
  }
});

// -----------------------------------------------
// PUT – Atualizar orçamento
// -----------------------------------------------
router.put("/orcamentos/:id_orc", (req, res) => {
  try {
    const { id_orc } = req.params;
    const { nome_cli, telefone, perc_lucro, adicional, total, dt_criacao, dt_limite } = req.body;

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    const index = dados.Orcamento.findIndex(o => o.id_orc == id_orc);
    if (index === -1) {
      return res.status(404).json({ mensagem: "Orçamento não encontrado" });
    }

    const atual = dados.Orcamento[index];

    dados.Orcamento[index] = {
      id_orc: atual.id_orc,
      nome_cli: nome_cli ?? atual.nome_cli,
      telefone: telefone ?? atual.telefone, // permite atualizar telefone
      perc_lucro: perc_lucro ?? atual.perc_lucro,
      adicional: adicional ?? atual.adicional,
      total: total ?? atual.total,
      dt_criacao: dt_criacao ?? atual.dt_criacao,
      dt_limite: dt_limite ?? atual.dt_limite
    };

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.json(dados.Orcamento[index]);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao atualizar Orçamento" });
  }
});

// -----------------------------------------------
// DELETE – Remover orçamento
// -----------------------------------------------
router.delete("/orcamentos/:id_orc", (req, res) => {
  try {
    const { id_orc } = req.params;

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const novoArray = dados.Orcamento.filter(o => o.id_orc != id_orc);

    if (novoArray.length === dados.Orcamento.length) {
      return res.status(404).json({ mensagem: "Orçamento não encontrado" });
    }

    dados.Orcamento = novoArray;
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.json({ mensagem: "Orçamento removido com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao remover Orçamento" });
  }
});

export default router;
