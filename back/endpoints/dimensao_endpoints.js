// ==========================
// DIMENSAO
// ==========================

import fs from 'fs';
import express from 'express';
const router = express.Router();

// ==========================
// GET todas dimensões
// ==========================
router.get('/dimensoes', (req, res) => {
  try {
    const dados = JSON.parse(fs.readFileSync('dados/dimensoes.json', 'utf-8'));
    res.json(dados);
  } catch (erro) {
    console.error("❌ Erro no GET:", erro);
    res.status(500).json({ mensagem: "Erro ao ler o arquivo de dimensões" });
  }
});

// ==========================
// POST nova dimensão
// ==========================
router.post('/dimensoes', (req, res) => {
  try {
    const nova = req.body;

    let dados = { Dimensao: [] };
    try {
      const conteudo = fs.readFileSync('dados/dimensoes.json', 'utf-8');
      if (conteudo.trim()) dados = JSON.parse(conteudo);
    } catch {
      console.warn("⚠️ Arquivo de dimensões inexistente. Criando novo.");
    }

    if (!Array.isArray(dados.Dimensao)) dados.Dimensao = [];

    // Gerar novo ID correto
    const ultimoID = dados.Dimensao.length > 0
      ? Math.max(...dados.Dimensao.map(d => parseInt(d.id_dim)))
      : 0;

    nova.id_dim = ultimoID + 1;

    dados.Dimensao.push({
      id_dim: nova.id_dim,
      id_item: nova.id_item,
      cmpr: nova.cmpr,
      larg: nova.larg,
      mrg_interna: nova.mrg_interna,
      mrg_sangria: nova.mrg_sangria,
      mrg_branca: nova.mrg_branca,
      mrg_espaco: nova.mrg_espaco
    });



    fs.writeFileSync('dados/dimensoes.json', JSON.stringify(dados, null, 2));

    console.log(`✅ Dimensão ${nova.id_dim} adicionada com sucesso!`);
    res.json({ mensagem: `Dimensão ${nova.id_dim} salva com sucesso!`, id_dim: nova.id_dim });

  } catch (erro) {
    console.error("❌ Erro no POST:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

// ==========================
// PUT atualizar dimensão
// ==========================
router.put('/dimensoes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { campo, novoValor } = req.body;

    const dados = JSON.parse(fs.readFileSync('dados/dimensoes.json', 'utf-8'));
    const dimensao = dados.Dimensao.find(d => d.id_dim == id);

    if (!dimensao) {
      return res.status(404).json({ mensagem: "Dimensão não encontrada" });
    }

    // Atualiza qualquer campo
    dimensao[campo] = novoValor;

    fs.writeFileSync('dados/dimensoes.json', JSON.stringify(dados, null, 2));
    res.json({ mensagem: "Dimensão atualizada com sucesso" });

  } catch (erro) {
    console.error("❌ Erro no PUT:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

// ==========================
// DELETE dimensão por ID
// ==========================
router.delete('/dimensoes/:id', (req, res) => {
  try {
    const { id } = req.params;

    const dados = JSON.parse(fs.readFileSync('dados/dimensoes.json', 'utf-8'));
    const index = dados.Dimensao.findIndex(d => d.id_dim == id);

    if (index === -1) {
      return res.status(404).json({ mensagem: "Dimensão não encontrada" });
    }

    dados.Dimensao.splice(index, 1);
    fs.writeFileSync('dados/dimensoes.json', JSON.stringify(dados, null, 2));

    res.json({ mensagem: "Dimensão removida com sucesso" });

  } catch (erro) {
    console.error("❌ Erro no DELETE:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

export default router;
