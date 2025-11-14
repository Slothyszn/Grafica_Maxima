import fs from 'fs';
import express from 'express';
const router = express.Router();

router.get('/servicos', (req, res) => {
  try {
    const dados = JSON.parse(fs.readFileSync('dados/servicos.json', 'utf-8'));
    res.json(dados);
  } catch (erro) {
    console.error("❌ Erro no GET:", erro);
    res.status(500).json({ mensagem: "Erro ao ler o arquivo de serviços" });
  }
});

router.post('/servicos', (req, res) => {
  try {
    const novoServico = req.body;

    // 🧱 Garante que o arquivo exista e seja válido
    let dados = { Servico: [] };
    try {
      const conteudo = fs.readFileSync('dados/servicos.json', 'utf-8');
      if (conteudo.trim()) dados = JSON.parse(conteudo);
    } catch {
      console.warn("⚠️ Arquivo vazio ou inexistente. Criando novo.");
    }

    if (!Array.isArray(dados.Servico)) dados.Servico = [];

    // 🔢 Pega o último ID, mesmo se estiver vazio
    const ultimoID = dados.Servico.length > 0
      ? Math.max(...dados.Servico.map(p => parseInt(p.id)))
      : 0;

    const novoId = ultimoID + 1;
    novoServico.id = novoId;

    // 🧩 Organiza os dados
    const servicoOrdenada = {
        id: novoServico.id,
        nome: novoServico.nome,
        tipo: novoServico.tipo,
        variacao: novoServico.variacao,
        custo_fixo: novoServico.custo_fixo,
        custo_area: novoServico.custo_area,
        custo_quantidade: novoServico.custo_quantidade
    };

    // 📦 Adiciona e salva
    dados.Servico.push(servicoOrdenada);
    fs.writeFileSync('dados/servicos.json', JSON.stringify(dados, null, 2));

    console.log(`✅ Novo serviço ${novoId} adicionado com sucesso!`);
    res.json({ mensagem: `Serviço ${novoId} salvo com sucesso!`, id: novoId });

  } catch (erro) {
    console.error("❌ Erro no POST:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

router.put('/servicos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { campo, novoValor } = req.body;

    const dados = JSON.parse(fs.readFileSync('dados/servicos.json', 'utf-8'));
    const servico = dados.Servico.find(m => m.id == id);

    if (!servico) {
      return res.status(404).json({ mensagem: "Serviço não encontrado" });
    }

    servico[campo] = novoValor;

    fs.writeFileSync('dados/servicos.json', JSON.stringify(dados, null, 2), 'utf-8');
    res.json({ mensagem: "Serviço atualizado com sucesso" });

  } catch (erro) {
    console.error("❌ Erro no PUT:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

router.delete('/servicos/nome/:nome', (req, res) => {
  try {
    const { nome } = req.params;

    const dados = JSON.parse(fs.readFileSync('dados/servicos.json', 'utf-8'));
    const index = dados.Servico.findIndex(p => p.nome.trim() === nome.trim());

    if (index === -1) {
      return res.status(404).json({ mensagem: "Serviço não encontrada" });
    }

    dados.Servico.splice(index, 1);
    fs.writeFileSync('dados/servicos.json', JSON.stringify(dados, null, 2), 'utf-8');

    res.json({ mensagem: "Serviço removido com sucesso" });
  } catch (erro) {
    console.error("❌ Erro no DELETE:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});


export default router;