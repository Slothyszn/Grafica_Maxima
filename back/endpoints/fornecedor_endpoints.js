import fs from 'fs';
import express from 'express';
const router = express.Router();

router.get('/fornecedores', (req, res) => {
  try {
    const dados = JSON.parse(fs.readFileSync('dados/fornecedores.json', 'utf-8'));
    res.json(dados);
  } catch (erro) {
    console.error("❌ Erro no GET:", erro);
    res.status(500).json({ mensagem: "Erro ao ler o arquivo de fornecedores" });
  }
});

router.post('/fornecedores', (req, res) => {
  try {
    const novoFornecedor = req.body;

    // 🧱 Garante que o arquivo exista e seja válido
    let dados = { Fornecedor: [] };
    try {
      const conteudo = fs.readFileSync('dados/fornecedores.json', 'utf-8');
      if (conteudo.trim()) dados = JSON.parse(conteudo);
    } catch {
      console.warn("⚠️ Arquivo vazio ou inexistente. Criando novo.");
    }

    if (!Array.isArray(dados.Fornecedor)) dados.Fornecedor = [];

    // 🔢 Pega o último ID, mesmo se estiver vazio
    const ultimoID = dados.Fornecedor.length > 0
      ? Math.max(...dados.Fornecedor.map(p => parseInt(p.id)))
      : 0;

    const novoId = ultimoID + 1;
    novoFornecedor.id = novoId;

    // 🧩 Organiza os dados
    const FornecedorOrdenada = {
      id: novoFornecedor.id,
      nome: novoFornecedor.nome,
      contato: novoFornecedor.contato
    };

    // 📦 Adiciona e salva
    dados.Fornecedor.push(FornecedorOrdenada);
    fs.writeFileSync('dados/fornecedores.json', JSON.stringify(dados, null, 2));

    console.log(`✅ Novo fornecedor ${novoId} adicionado com sucesso!`);
    res.json({ mensagem: `Fornecedor ${novoId} salvo com sucesso!`, id: novoId });

  } catch (erro) {
    console.error("❌ Erro no POST:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

router.put('/fornecedores/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { campo, novoValor } = req.body;

    const dados = JSON.parse(fs.readFileSync('dados/fornecedores.json', 'utf-8'));
    const fornecedor = dados.Fornecedor.find(m => m.id == id);

    if (!fornecedor) {
      return res.status(404).json({ mensagem: "Fornecedor não encontrada" });
    }

    fornecedor[campo] = novoValor;

    fs.writeFileSync('dados/fornecedores.json', JSON.stringify(dados, null, 2), 'utf-8');
    res.json({ mensagem: "Fornecedor atualizado com sucesso" });

  } catch (erro) {
    console.error("❌ Erro no PUT:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

router.delete('/fornecedores/nome/:nome', (req, res) => {
  try {
    const { nome } = req.params;

    const dados = JSON.parse(fs.readFileSync('dados/fornecedores.json', 'utf-8'));
    const index = dados.Fornecedor.findIndex(p => p.nome.trim() === nome.trim());

    if (index === -1) {
      return res.status(404).json({ mensagem: "Fornecedor não encontrada" });
    }

    dados.Fornecedor.splice(index, 1);
    fs.writeFileSync('dados/fornecedores.json', JSON.stringify(dados, null, 2), 'utf-8');

    res.json({ mensagem: "Fornecedor removida com sucesso" });
  } catch (erro) {
    console.error("❌ Erro no DELETE:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});


export default router;