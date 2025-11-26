import express from "express";
import fs from "fs";

const router = express.Router();
const caminho = "dados/formato.json";

// ---------------------------------------
// GET – Buscar todos
// ---------------------------------------
router.get("/formatos", (req, res) => {
  try {
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao ler Formatos" });
  }
});

// ---------------------------------------
// GET – Buscar um
// ---------------------------------------
router.get("/formatos/:id_fmt", (req, res) => {
  try {
    const { id_fmt } = req.params;
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    const reg = dados.Formato.find(f => f.id_fmt == id_fmt);
    if (!reg) {
      return res.status(404).json({ mensagem: "Formato não encontrado" });
    }

    res.json(reg);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar Formato" });
  }
});

// ---------------------------------------
// POST – Criar novo
// ---------------------------------------
router.post("/formatos", (req, res) => {
  try {
    const { tipo, nome, cmpr, larg } = req.body;

    if (!tipo || !nome || !cmpr || !larg) {
      return res.status(400).json({ erro: "Campos obrigatórios faltando" });
    }

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    // Calcular id_fmt automaticamente
    let id_fmt = 1;
    if (Array.isArray(dados.Formato) && dados.Formato.length > 0) {
      const ids = dados.Formato.map(f => f.id_fmt);
      id_fmt = Math.max(...ids) + 1;
    }

    // Verificar se já existe exatamente o mesmo formato (tipo + nome)
    const existe = dados.Formato.some(f => f.tipo === tipo && f.nome === nome);
    if (existe) {
      return res.status(409).json({ erro: "Formato já existe" });
    }

    const novo = { id_fmt, tipo, nome, cmpr, larg };

    dados.Formato.push(novo);
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.status(201).json(novo);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao salvar Formato" });
  }
});


// ---------------------------------------
// PUT – Atualizar
// ---------------------------------------
router.put("/formatos/:id_fmt", (req, res) => {
  try {
    const { id_fmt } = req.params;
    const { campo, novoValor } = req.body;

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    const i = dados.Formato.findIndex(f => f.id_fmt == id_fmt);
    if (i === -1) return res.status(404).json({ mensagem: "Formato não encontrado" });

    dados.Formato[i][campo] = novoValor; // altera só o campo enviado

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.json(dados.Formato[i]);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao atualizar Formato" });
  }
});


// ---------------------------------------
// DELETE – Remover
// ---------------------------------------
router.delete("/formatos/:id_fmt", (req, res) => {
  try {
    const { id_fmt } = req.params;

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const novoArray = dados.Formato.filter(f => f.id_fmt != id_fmt);

    if (novoArray.length === dados.Formato.length) {
      return res.status(404).json({ mensagem: "Formato não encontrado" });
    }

    dados.Formato = novoArray;
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.json({ mensagem: "Removido com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao remover Formato" });
  }
});

export default router;
