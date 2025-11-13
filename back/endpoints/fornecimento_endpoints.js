import fs from 'fs';
import express from 'express';
const router = express.Router();

// ==========================
// GET todos os fornecimentos
// ==========================
router.get('/fornecimentos', (req, res) => {
  try {
    const dados = JSON.parse(fs.readFileSync('dados/fornecimentos.json', 'utf-8'));
    res.json(dados);
  } catch (erro) {
    console.error("❌ Erro no GET:", erro);
    res.status(500).json({ mensagem: "Erro ao ler o arquivo de fornecimentos" });
  }
});

// ==========================
// POST novo fornecimento
// ==========================
router.post('/fornecimentos', (req, res) => {
  try {
    const novoFornecimento = req.body;

    // 🧱 Garante que o arquivo de fornecimentos exista
    let dados = { Fornecimento: [] };
    try {
      const conteudo = fs.readFileSync('dados/fornecimentos.json', 'utf-8');
      if (conteudo.trim()) dados = JSON.parse(conteudo);
    } catch {
      console.warn("⚠️ Arquivo de fornecimentos vazio ou inexistente. Criando novo.");
    }

    if (!Array.isArray(dados.Fornecimento)) dados.Fornecimento = [];

    // ==========================
    // Validação das chaves externas
    // ==========================
    const fornecedores = JSON.parse(fs.readFileSync('dados/fornecedores.json', 'utf-8')).Fornecedor;
    const materiais = JSON.parse(fs.readFileSync('dados/materiais.json', 'utf-8')).Material;

    const fornecedorValido = fornecedores.find(f => f.id == novoFornecimento.id_fornecedor);
    const materialValido = materiais.find(m => m.id == novoFornecimento.id_material);

    if (!fornecedorValido) {
      return res.status(400).json({ mensagem: "Fornecedor inválido" });
    }
    if (!materialValido) {
      return res.status(400).json({ mensagem: "Material inválido" });
    }

    // 🔢 Gera novo ID sequencial
    const ultimoID = dados.Fornecimento.length > 0
      ? Math.max(...dados.Fornecimento.map(f => parseInt(f.id)))
      : 0;
    novoFornecimento.id = ultimoID + 1;

    // 🧩 Organiza os dados
    const FornecimentoOrdenado = {
      id: novoFornecimento.id,
      id_fornecedor: novoFornecimento.id_fornecedor,
      id_material: novoFornecimento.id_material,
      comprimento_base: novoFornecimento.comprimento_base,
      largura_base: novoFornecimento.largura_base,
      unidades: novoFornecimento.unidades,
      custo_total: novoFornecimento.custo_total,
      custo_unitario_estimado: novoFornecimento.custo_unitario_estimado
    };

    // 📦 Adiciona e salva
    dados.Fornecimento.push(FornecimentoOrdenado);
    fs.writeFileSync('dados/fornecimentos.json', JSON.stringify(dados, null, 2));

    console.log(`✅ Novo fornecimento ${novoFornecimento.id} adicionado com sucesso!`);
    res.json({ mensagem: `Fornecimento ${novoFornecimento.id} salvo com sucesso!`, id: novoFornecimento.id });

  } catch (erro) {
    console.error("❌ Erro no POST:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

// ==========================
// PUT atualização de fornecimento
// ==========================
router.put('/fornecimentos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { campo, novoValor } = req.body;

    const dados = JSON.parse(fs.readFileSync('dados/fornecimentos.json', 'utf-8'));
    const fornecimento = dados.Fornecimento.find(f => f.id == id);

    if (!fornecimento) {
      return res.status(404).json({ mensagem: "Fornecimento não encontrado" });
    }

    // ⚠️ Valida campos de chaves externas
    if (campo === 'id_fornecedor') {
      const fornecedores = JSON.parse(fs.readFileSync('dados/fornecedores.json', 'utf-8')).Fornecedor;
      if (!fornecedores.find(f => f.id == novoValor)) {
        return res.status(400).json({ mensagem: "Fornecedor inválido" });
      }
    }
    if (campo === 'id_material') {
      const materiais = JSON.parse(fs.readFileSync('dados/materiais.json', 'utf-8')).Material;
      if (!materiais.find(m => m.id == novoValor)) {
        return res.status(400).json({ mensagem: "Material inválido" });
      }
    }

    fornecimento[campo] = novoValor;

    fs.writeFileSync('dados/fornecimentos.json', JSON.stringify(dados, null, 2));
    res.json({ mensagem: "Fornecimento atualizado com sucesso" });

  } catch (erro) {
    console.error("❌ Erro no PUT:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

// ==========================
// DELETE fornecimento por ID
// ==========================
router.delete('/fornecimentos/:id', (req, res) => {
  try {
    const { id } = req.params;

    const dados = JSON.parse(fs.readFileSync('dados/fornecimentos.json', 'utf-8'));
    const index = dados.Fornecimento.findIndex(f => f.id == id);

    if (index === -1) {
      return res.status(404).json({ mensagem: "Fornecimento não encontrado" });
    }

    dados.Fornecimento.splice(index, 1);
    fs.writeFileSync('dados/fornecimentos.json', JSON.stringify(dados, null, 2));

    res.json({ mensagem: "Fornecimento removido com sucesso" });
  } catch (erro) {
    console.error("❌ Erro no DELETE:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

export default router;
