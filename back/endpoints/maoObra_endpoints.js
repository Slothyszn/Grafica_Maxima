import express from "express";
import fs from "fs";

const router = express.Router();
const caminho = "dados/maoObra.json";

// ------------------------------
// GET – Buscar todos ou filtrar por id_serv / id_item
// ------------------------------
router.get("/maoObras", (req, res) => {
  try {
    const { id_serv, id_item } = req.query;
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    let resultado = dados.MaoObra;
    if (id_serv) resultado = resultado.filter(m => m.id_serv === Number(id_serv));
    if (id_item) resultado = resultado.filter(m => m.id_item === Number(id_item));

    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao ler MaoObra" });
  }
});

// ------------------------------
// POST – Adicionar
// ------------------------------
router.post("/maoObras", (req, res) => {
  try {
    const { id_serv, id_item } = req.body;

    if (id_serv == null || id_item == null) {
      return res.status(400).json({ erro: "Campos obrigatórios faltando" });
    }

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    // Verifica se já existe
    const existe = dados.MaoObra.some(
      m => m.id_serv === Number(id_serv) && m.id_item === Number(id_item)
    );
    if (existe) return res.status(409).json({ erro: "Registro já existe" });

    const novo = { id_serv: Number(id_serv), id_item: Number(id_item) };
    dados.MaoObra.push(novo);

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
    res.status(201).json(novo);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao salvar MaoObra" });
  }
});

// ------------------------------
// PUT – Atualizar (id_serv ou id_item)
// ------------------------------
router.put("/maoObras", (req, res) => {
  try {
    const { id_serv, id_item, campo, novo_valor } = req.body;

    if (!id_serv || !id_item || !campo || novo_valor === undefined) {
      return res
        .status(400)
        .json({ erro: "Informe id_serv, id_item, campo e novo_valor" });
    }

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));

    const indice = dados.MaoObra.findIndex(
      m => m.id_serv === Number(id_serv) && m.id_item === Number(id_item)
    );

    if (indice === -1) return res.status(404).json({ erro: "Registro não encontrado" });

    // Atualiza somente o campo especificado
    dados.MaoObra[indice][campo] = isNaN(Number(novo_valor)) ? novo_valor : Number(novo_valor);

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
    res.json({ mensagem: "Atualizado com sucesso", atualizado: dados.MaoObra[indice] });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao atualizar MaoObra" });
  }
});

// ------------------------------
// DELETE – Remover
// ------------------------------
router.delete("/maoObras", (req, res) => {
  try {
    const { id_serv, id_item } = req.body;

    if (id_serv == null || id_item == null) {
      return res.status(400).json({ erro: "Informe id_serv e id_item para deletar" });
    }

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const novoArray = dados.MaoObra.filter(
      m => !(m.id_serv === Number(id_serv) && m.id_item === Number(id_item))
    );

    if (novoArray.length === dados.MaoObra.length) {
      return res.status(404).json({ mensagem: "Registro não encontrado" });
    }

    dados.MaoObra = novoArray;
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.json({ mensagem: "Removido com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao deletar MaoObra" });
  }
});

export default router;
