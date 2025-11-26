import express from "express";
import fs from "fs";

const router = express.Router();
const caminho = "dados/fornecimentos.json";

// ---------------------------------------
// GET – Buscar todos
// ---------------------------------------
router.get("/fornecimentos", (req, res) => {
  try {
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao ler Fornecimento" });
  }
});

// ---------------------------------------
// GET – Buscar um pelo id_fornec
// ---------------------------------------
router.get("/fornecimentos/:id_fornec", (req, res) => {
  try {
    const { id_fornec } = req.params;
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    const reg = dados.Fornecimento.find(f => f.id_fornec == id_fornec);

    if (!reg) {
      return res.status(404).json({ mensagem: "Fornecimento não encontrado" });
    }

    res.json(reg);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao processar requisição" });
  }
});

// ---------------------------------------
// POST – Criar
// ---------------------------------------
router.post("/fornecimentos", (req, res) => {
  try {
    const { id_forn, id_sub, id_fmt, forma, custo_m2 } = req.body;

    // Validar campos obrigatórios
    if (!id_forn || !id_sub || !id_fmt || !forma || !custo_m2) {
      return res.status(400).json({ erro: "Campos obrigatórios faltando" });
    }

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    // Gerar id_fornec automaticamente
    const ultimoId = dados.Fornecimento.length > 0 
      ? Math.max(...dados.Fornecimento.map(f => Number(f.id_fornec)))
      : 0;
    const novoId = ultimoId + 1;

    const novo = {
      id_fornec: novoId,
      id_forn,
      id_sub,
      id_fmt,
      forma,
      custo_m2
    };

    dados.Fornecimento.push(novo);
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.status(201).json(novo);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao salvar Fornecimento" });
  }
});

// ---------------------------------------
// PUT – Atualizar
// ---------------------------------------
router.put("/fornecimentos/:id_fornec", (req, res) => {
  try {
    const { id_fornec } = req.params;
    const { campo, novoValor } = req.body;

    console.log("PUT recebendo:", id_fornec, req.body);

    if (!campo || novoValor === undefined) {
      return res.status(400).json({ erro: "Campo ou novo valor não informado" });
    }

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    const i = dados.Fornecimento.findIndex(f => f.id_fornec == id_fornec);
    if (i === -1) return res.status(404).json({ erro: "Fornecimento não encontrado" });

    // Atualiza somente o campo enviado
    dados.Fornecimento[i][campo] = novoValor;

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.json(dados.Fornecimento[i]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao atualizar Fornecimento" });
  }
});

// ---------------------------------------
// DELETE – Remover
// ---------------------------------------
router.delete("/fornecimentos/:id_fornec", (req, res) => {
  try {
    const { id_fornec } = req.params;
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    const novoArray = dados.Fornecimento.filter(f => f.id_fornec != id_fornec);

    if (novoArray.length === dados.Fornecimento.length) {
      return res.status(404).json({ mensagem: "Fornecimento não encontrado" });
    }

    dados.Fornecimento = novoArray;

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.json({ mensagem: "Removido com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao excluir Fornecimento" });
  }
});

export default router;
