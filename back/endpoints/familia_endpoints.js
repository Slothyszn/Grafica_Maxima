import express from "express";
import fs from "fs";
const router = express.Router();
const caminho = "dados/familias.json";

// -------------------------------------------------
// GET – Buscar todas as famílias
// -------------------------------------------------
router.get("/familias", (req, res) => {
  try {
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao ler Famílias" });
  }
});

// Buscar família por nome (query)
router.get("/familias/buscar", (req, res) => {
  const query = req.query.q?.toLowerCase() || "";
  try {
    const dadosJson = fs.readFileSync(caminho, "utf-8");
    const familias = JSON.parse(dadosJson).Familia || [];
    const resultado = familias.filter(f => f.nome.toLowerCase().includes(query));
    res.json(resultado);
  } catch (erro) {
    console.error("Erro ao buscar famílias:", erro);
    res.status(500).json({ mensagem: "Erro interno do servidor", erro: erro.message });
  }
});

// -------------------------------------------------
// GET – Buscar família por ID
// -------------------------------------------------
router.get("/familias/:id_fam", (req, res) => {
  try {
    const { id_fam } = req.params;
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const familia = dados.Familia.find(f => f.id_fam == id_fam);
    if (!familia) {
      return res.status(404).json({ mensagem: "Família não encontrada" });
    }
    res.json(familia);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar Família" });
  }
});

// -------------------------------------------------
// POST – Criar nova família
// -------------------------------------------------
router.post("/familias", (req, res) => {
  try {
    const { tipo, nome } = req.body;
    if (!tipo || !nome) {
      return res.status(400).json({ erro: "Campos obrigatórios 'tipo' e 'nome' faltando" });
    }
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const familias = dados.Familia || [];
    const novoId = familias.length > 0 ? Math.max(...familias.map(f => f.id_fam)) + 1 : 1;
    const novo = { id_fam: novoId, tipo, nome };
    familias.push(novo);
    dados.Familia = familias;
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
    res.status(201).json(novo);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao salvar Família" });
  }
});

// -------------------------------------------------
// PUT – Atualizar família
// -------------------------------------------------
router.put("/familias/:id_fam", (req, res) => {
  try {
    const { id_fam } = req.params;
    const { campo, novoValor } = req.body; // recebe apenas campo e novoValor
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    const index = dados.Familia.findIndex(f => f.id_fam == id_fam);
    if (index === -1) {
      return res.status(404).json({ mensagem: "Família não encontrada" });
    }

    // Atualiza dinamicamente o campo
    if (!["tipo", "nome"].includes(campo)) {
      return res.status(400).json({ mensagem: "Campo inválido" });
    }

    dados.Familia[index][campo] = novoValor;

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
    res.json(dados.Familia[index]);

  } catch (erro) {
    res.status(500).json({ erro: "Erro ao atualizar Família" });
  }
});


// -------------------------------------------------
// DELETE – Remover família por nome
// -------------------------------------------------
router.delete("/familias/:id_fam", (req, res) => {
  try {
    const { id_fam } = req.params;
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const novoArray = dados.Familia.filter(f => f.id_fam != id_fam);

    if (novoArray.length === dados.Familia.length) {
      return res.status(404).json({ mensagem: "Família não encontrada" });
    }

    dados.Familia = novoArray;
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
    res.json({ mensagem: "Família removida com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao remover Família" });
  }
});

export default router;
