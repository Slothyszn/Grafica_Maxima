import fs from 'fs';
import express from 'express';
const router = express.Router();

router.get('/materiais', (req, res) => {
  try {
    const dados = JSON.parse(fs.readFileSync('dados/materiais.json', 'utf-8'));
    res.json(dados);
  } catch (erro) {
    console.error("❌ Erro no GET:", erro);
    res.status(500).json({ mensagem: "Erro ao ler o arquivo de materiais" });
  }
});

router.post('/materiais', (req, res) => {
  try {
    const novoMaterial = req.body;

    // 🧱 Garante que o arquivo exista e seja válido
    let dados = { Material: [] };
    try {
      const conteudo = fs.readFileSync('dados/materiais.json', 'utf-8');
      if (conteudo.trim()) dados = JSON.parse(conteudo);
    } catch {
      console.warn("⚠️ Arquivo vazio ou inexistente. Criando novo.");
    }

    if (!Array.isArray(dados.Material)) dados.Material = [];

    // 🔢 Pega o último ID, mesmo se estiver vazio
    const ultimoID = dados.Material.length > 0
      ? Math.max(...dados.Material.map(p => parseInt(p.id)))
      : 0;

    const novoId = ultimoID + 1;
    novoMaterial.id = novoId;

    // 🧩 Organiza os dados
    const MaterialOrdenada = {
      id: novoMaterial.id,
      nome: novoMaterial.nome,
      tipo: novoMaterial.tipo,
      variacao: novoMaterial.variacao,
      gramatura: novoMaterial.gramatura,
      espessura: novoMaterial.espessura,
      custo_unitario: novoMaterial.custo_unitario,
      custo_area: novoMaterial.custo_area
    };

    // 📦 Adiciona e salva
    dados.Material.push(MaterialOrdenada);
    fs.writeFileSync('dados/materiais.json', JSON.stringify(dados, null, 2));

    console.log(`✅ Novo material ${novoId} adicionado com sucesso!`);
    res.json({ mensagem: `Material ${novoId} salvo com sucesso!`, id: novoId });

  } catch (erro) {
    console.error("❌ Erro no POST:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

router.put('/materiais/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { campo, novoValor } = req.body;

    const dados = JSON.parse(fs.readFileSync('dados/materiais.json', 'utf-8'));
    const material = dados.Material.find(m => m.id == id);

    if (!material) {
      return res.status(404).json({ mensagem: "Material não encontrada" });
    }

    material[campo] = novoValor;

    fs.writeFileSync('dados/materiais.json', JSON.stringify(dados, null, 2), 'utf-8');
    res.json({ mensagem: "Material atualizado com sucesso" });

  } catch (erro) {
    console.error("❌ Erro no PUT:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

router.delete('/materiais/nome/:nome', (req, res) => {
  try {
    const { nome } = req.params;

    const dados = JSON.parse(fs.readFileSync('dados/materiais.json', 'utf-8'));
    const index = dados.Material.findIndex(p => p.nome.trim() === nome.trim());

    if (index === -1) {
      return res.status(404).json({ mensagem: "Material não encontrado" });
    }

    dados.Material.splice(index, 1);
    fs.writeFileSync('dados/materiais.json', JSON.stringify(dados, null, 2), 'utf-8');

    res.json({ mensagem: "Material removido com sucesso" });
  } catch (erro) {
    console.error("❌ Erro no DELETE:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});


export default router;