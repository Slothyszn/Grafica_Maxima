import express from "express";
import fs from "fs";

const router = express.Router();
const caminho = "dados/categorias.json";

// -------------------------------------------------
// GET – Buscar todas as categorias
// -------------------------------------------------
router.get("/categorias", (req, res) => {
  try {
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    res.json(dados.Categoria || []);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao ler Categorias" });
  }
});

// -------------------------------------------------
// GET – Buscar categorias por nome (query ?q=...)
// -------------------------------------------------
router.get("/categorias/buscar", (req, res) => {
  const query = req.query.q?.toLowerCase() || "";

  try {
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const categorias = dados.Categoria || [];

    const resultado = categorias.filter(c =>
      c.nome.toLowerCase().includes(query)
    );

    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar Categorias" });
  }
});

// -------------------------------------------------
// GET – Buscar categoria por ID
// -------------------------------------------------
router.get("/categorias/:id_categ", (req, res) => {
  try {
    const { id_categ } = req.params;
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const categoria = dados.Categoria.find(c => c.id_categ == id_categ);

    if (!categoria) {
      return res.status(404).json({ mensagem: "Categoria não encontrada" });
    }

    res.json(categoria);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar Categoria" });
  }
});

// -------------------------------------------------
// POST – Criar nova categoria
// -------------------------------------------------
router.post("/categorias", (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: "Campo obrigatório 'nome' faltando" });
    }

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const categorias = dados.Categoria || [];

    // Verificar duplicado
    if (categorias.some(c => c.nome.toLowerCase() === nome.toLowerCase())) {
      return res.status(400).json({ erro: "Categoria já existe" });
    }

    const novoId =
      categorias.length > 0
        ? Math.max(...categorias.map(c => c.id_categ)) + 1
        : 1;

    const nova = { id_categ: novoId, nome };

    categorias.push(nova);
    dados.Categoria = categorias;

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.status(201).json(nova);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao salvar Categoria" });
  }
});

// -------------------------------------------------
// PUT – Atualizar categoria
// -------------------------------------------------
router.put("/categorias/:id_categ", (req, res) => {
  try {
    const { id_categ } = req.params;
    const { campo, novoValor } = req.body;

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    const index = dados.Categoria.findIndex(c => c.id_categ == id_categ);

    if (index === -1) {
      return res.status(404).json({ mensagem: "Categoria não encontrada" });
    }

    if (campo !== "nome") {
      return res.status(400).json({ mensagem: "Campo inválido" });
    }

    dados.Categoria[index][campo] = novoValor;

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.json(dados.Categoria[index]);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao atualizar Categoria" });
  }
});

// -------------------------------------------------
// DELETE – Remover categoria
// -------------------------------------------------
router.delete("/categorias/:id_categ", (req, res) => {
  try {
    const { id_categ } = req.params;

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const novaLista = dados.Categoria.filter(c => c.id_categ != id_categ);

    if (novaLista.length === dados.Categoria.length) {
      return res.status(404).json({ mensagem: "Categoria não encontrada" });
    }

    dados.Categoria = novaLista;

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.json({ mensagem: "Categoria removida com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao remover Categoria" });
  }
});

export default router;
