import express from "express";
import fs from "fs";

const router = express.Router();
const caminho = "dados/substrato.json";

// ------------------------------
// GET – Buscar todos
// ------------------------------
router.get("/substratos", (req, res) => {
  try {
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao ler Substrato" });
  }
});

// ------------------------------
// GET – Buscar por ID
// ------------------------------
router.get("/substratos/:id_sub", (req, res) => {
  try {
    const { id_sub } = req.params;
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    const substrato = dados.Substrato.find(s => s.id_sub == id_sub);

    if (!substrato) {
      return res.status(404).json({ erro: "Substrato não encontrado" });
    }

    res.json(substrato);

  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar Substrato" });
  }
});


// ------------------------------
// POST – Adicionar
// ------------------------------
router.post("/substratos", (req, res) => {
  try {

    const { id_fam, id_categ, med_sub, valor } = req.body;

    if (!id_fam || !id_categ || !med_sub || !valor) {
      return res.status(400).json({ erro: "Campos obrigatórios faltando" });
    }

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    console.log("DADOS LIDOS:", dados);

    // Pegar o ultimo id de substrato.json e incrementar
    const id_sub = dados.Substrato.length > 0 ? dados.Substrato[dados.Substrato.length - 1].id_sub + 1 : 1;

    const novo = { id_sub, id_fam, id_categ, med_sub, valor };
    dados.Substrato.push(novo);

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.status(201).json(novo);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao salvar Substrato" });
  }
});

// ------------------------------
// PUT – Atualizar
// ------------------------------
router.put("/substratos/:id_sub", (req, res) => {
  try {
    const id_sub = parseInt(req.params.id_sub);
    const { campo, novoValor } = req.body;

    if (!campo || novoValor === undefined) {
      return res.status(400).json({
        erro: "Envie 'campo' e 'novoValor' no corpo da requisição"
      });
    }

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const substrato = dados.Substrato.find(s => s.id_sub === id_sub);

    if (!substrato) {
      return res.status(404).json({ erro: "Substrato não encontrado" });
    }

    // Verificar se o campo existe
    if (!(campo in substrato)) {
      return res.status(400).json({
        erro: `Campo '${campo}' não existe em Substrato`
      });
    }

    // Atualizar somente o campo
    substrato[campo] = novoValor;

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.json({
      mensagem: "Substrato atualizado com sucesso",
      atualizado: substrato
    });
  } catch (erro) {
    console.error("❌ Erro no PUT do Substrato:", erro);
    res.status(500).json({ erro: "Erro ao atualizar substrato" });
  }
});

// ------------------------------
// DELETE – Remover
// ------------------------------
router.delete("/substratos/:id_sub", (req, res) => {
  try {
    const { id_sub } = req.params;
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    const novoArray = dados.Substrato.filter(s => s.id_sub != id_sub);

    if (novoArray.length === dados.Substrato.length) {
      return res.status(404).json({ mensagem: "Substrato não encontrado" });
    }

    dados.Substrato = novoArray;

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.json({ mensagem: "Removido com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao deletar Substrato" });
  }
});

export default router;
