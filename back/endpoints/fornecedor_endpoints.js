import express from "express";
import fs from "fs";

const router = express.Router();
const caminho = "dados/fornecedores.json";

// -------------------------------------------------
// GET – Buscar todos os fornecedores
// -------------------------------------------------
router.get("/fornecedores", (req, res) => {
  try {
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao ler Fornecedores" });
  }
});

// Buscar fornecedores

router.get("/fornecedores/buscar", (req, res) => {
  const query = req.query.q?.toLowerCase() || "";
  try {
    const dadosJson = fs.readFileSync(caminho, "utf-8");
    const fornecedores = JSON.parse(dadosJson).Fornecedor || []; // ⬅️ aqui, 'Fornecedor' com F maiúsculo
    const resultado = fornecedores.filter(f => f.nome.toLowerCase().includes(query));
    res.json(resultado);
  } catch (erro) {
    console.error("Erro ao buscar fornecedores:", erro);
    res.status(500).json({ mensagem: "Erro interno do servidor", erro: erro.message });
  }
});

// -------------------------------------------------
// GET – Buscar fornecedor por ID
// -------------------------------------------------
router.get("/fornecedores/:id_forn", (req, res) => {
  try {
    const { id_forn } = req.params;
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    const fornecedor = dados.Fornecedor.find(f => f.id_forn == id_forn);
    if (!fornecedor) {
      return res.status(404).json({ mensagem: "Fornecedor não encontrado" });
    }

    res.json(fornecedor);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar Fornecedor" });
  }
});

// -------------------------------------------------
// POST – Criar novo fornecedor
// -------------------------------------------------
router.post("/fornecedores", (req, res) => {
  try {
    const { nome, contato } = req.body;

    if (!nome || !contato) {
      return res.status(400).json({ erro: "Campos obrigatórios faltando" });
    }

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const fornecedores = dados.Fornecedor || [];

    // Gera ID automaticamente
    const novoId = fornecedores.length > 0 
      ? Math.max(...fornecedores.map(f => f.id_forn)) + 1 
      : 1;

    const novo = { id_forn: novoId, nome, contato };

    fornecedores.push(novo);
    dados.Fornecedor = fornecedores;
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.status(201).json(novo);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao salvar Fornecedor" });
  }
});


// -------------------------------------------------
// PUT – Atualizar fornecedor
// -------------------------------------------------
router.put("/fornecedores/:id_forn", (req, res) => {
  try {
    const { id_forn } = req.params;
    const { nome, contato } = req.body;

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    const index = dados.Fornecedor.findIndex(f => f.id_forn == id_forn);
    if (index === -1) {
      return res.status(404).json({ mensagem: "Fornecedor não encontrado" });
    }

    const atual = dados.Fornecedor[index];

    dados.Fornecedor[index] = {
      id_forn: atual.id_forn,
      nome: nome ?? atual.nome,
      contato: contato ?? atual.contato
    };

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.json(dados.Fornecedor[index]);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao atualizar Fornecedor" });
  }
});

// -------------------------------------------------
// DELETE – Remover fornecedor
// -------------------------------------------------
router.delete("/fornecedores/nome/:nome", (req, res) => {
  try {
    const { nome } = req.params;
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const novoArray = dados.Fornecedor.filter(f => f.nome !== nome);

    if (novoArray.length === dados.Fornecedor.length) {
      return res.status(404).json({ mensagem: "Fornecedor não encontrado" });
    }

    dados.Fornecedor = novoArray;
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
    res.json({ mensagem: "Fornecedor removido com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao remover Fornecedor" });
  }
});

export default router;
