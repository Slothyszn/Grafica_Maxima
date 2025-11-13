import fs from 'fs';
import express from 'express';
const router = express.Router();

router.get('/maquinas', (req, res) => {
  try {
    const dados = JSON.parse(fs.readFileSync('dados/maquinas.json', 'utf-8'));
    res.json(dados);
  } catch (erro) {
    console.error("❌ Erro no GET:", erro);
    res.status(500).json({ mensagem: "Erro ao ler o arquivo de máquinas" });
  }
});

router.post('/maquinas', (req, res) => {
  try {
    const novaMaquina = req.body;

    // 🧱 Garante que o arquivo exista e seja válido
    let dados = { Maquina: [] };
    try {
      const conteudo = fs.readFileSync('dados/maquinas.json', 'utf-8');
      if (conteudo.trim()) dados = JSON.parse(conteudo);
    } catch {
      console.warn("⚠️ Arquivo vazio ou inexistente. Criando novo.");
    }

    if (!Array.isArray(dados.Maquina)) dados.Maquina = [];

    // 🔢 Pega o último ID, mesmo se estiver vazio
    const ultimoID = dados.Maquina.length > 0
      ? Math.max(...dados.Maquina.map(p => parseInt(p.id)))
      : 0;

    const novoId = ultimoID + 1;
    novaMaquina.id = novoId;

    // 🧩 Organiza os dados
    const MaquinaOrdenada = {
      id: novaMaquina.id,
      tipo: novaMaquina.tipo,
      variacao: novaMaquina.variacao,
      marca: novaMaquina.marca,
      modelo: novaMaquina.modelo,
      comprimento_maximo: novaMaquina.comprimento_maximo,
      largura_maxima: novaMaquina.largura_maxima
    };

    // 📦 Adiciona e salva
    dados.Maquina.push(MaquinaOrdenada);
    fs.writeFileSync('dados/maquinas.json', JSON.stringify(dados, null, 2));

    console.log(`✅ Nova máquina ${novoId} adicionada com sucesso!`);
    res.json({ mensagem: `Máquina ${novoId} salva com sucesso!`, id: novoId });

  } catch (erro) {
    console.error("❌ Erro no POST:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});


router.put('/maquinas/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { campo, novoValor } = req.body;

    const dados = JSON.parse(fs.readFileSync('dados/maquinas.json', 'utf-8'));
    const maquina = dados.Maquina.find(m => m.id == id);

    if (!maquina) {
      return res.status(404).json({ mensagem: "Máquina não encontrada" });
    }

    maquina[campo] = novoValor;

    fs.writeFileSync('dados/maquinas.json', JSON.stringify(dados, null, 2), 'utf-8');
    res.json({ mensagem: "Máquina atualizada com sucesso" });

  } catch (erro) {
    console.error("❌ Erro no PUT:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

router.delete('/maquinas/tipo/:tipo', (req, res) => {
  try {
    const { tipo } = req.params;

    const dados = JSON.parse(fs.readFileSync('dados/maquinas.json', 'utf-8'));
    const index = dados.Maquina.findIndex(p => p.tipo.trim() === tipo.trim());

    if (index === -1) {
      return res.status(404).json({ mensagem: "Máquina não encontrada" });
    }

    dados.Maquina.splice(index, 1);
    fs.writeFileSync('dados/maquinas.json', JSON.stringify(dados, null, 2), 'utf-8');

    res.json({ mensagem: "Máquina removida com sucesso" });
  } catch (erro) {
    console.error("❌ Erro no DELETE:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});



export default router;