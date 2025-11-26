import fs from 'fs';
import express from 'express';
const router = express.Router();

const CAMINHO = 'dados/servicos.json';

// Função segura para carregar arquivo JSON
function carregarArquivo() {
  try {
    const conteudo = fs.readFileSync(CAMINHO, 'utf-8');
    if (!conteudo.trim()) return { Servico: [] };
    const json = JSON.parse(conteudo);
    if (!Array.isArray(json.Servico)) return { Servico: [] };
    return json;
  } catch {
    return { Servico: [] };
  }
}

// GET todos os serviços
router.get('/servicos', (req, res) => {
  try {
    const dados = carregarArquivo();
    res.json(dados);
  } catch (erro) {
    console.error("❌ Erro no GET:", erro);
    res.status(500).json({ mensagem: "Erro ao ler o arquivo de serviços" });
  }
});

// POST novo serviço
router.post('/servicos', (req, res) => {
  try {
    const novoServico = req.body;
    let dados = carregarArquivo();

    // Geração automática do ID
    const ultimoID = dados.Servico.length > 0
      ? Math.max(...dados.Servico.map(s => parseInt(s.id_serv)))
      : 0;

    novoServico.id_serv = ultimoID + 1;

    const servOrganizado = {
      id_serv: novoServico.id_serv,
      nome: novoServico.nome,
      custo_fixo: novoServico.custo_fixo
    };

    dados.Servico.push(servOrganizado);
    fs.writeFileSync(CAMINHO, JSON.stringify(dados, null, 2));
    res.status(201).json({ mensagem: 'Serviço criado', id: novoServico.id_serv });
  } catch (erro) {
    console.error("❌ Erro no POST:", erro);
    res.status(500).json({ mensagem: 'Erro ao salvar serviço' });
  }
});

// PUT atualizar campo de serviço
router.put('/servicos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { campo, novoValor } = req.body;

    const dados = carregarArquivo();
    const serv = dados.Servico.find(s => String(s.id_serv) === String(id));
    if (!serv) return res.status(404).json({ mensagem: 'Serviço não encontrado' });

    serv[campo] = novoValor;
    fs.writeFileSync(CAMINHO, JSON.stringify(dados, null, 2));
    res.json({ mensagem: 'Serviço atualizado' });
  } catch (erro) {
    console.error("❌ Erro no PUT:", erro);
    res.status(500).json({ mensagem: 'Erro ao atualizar serviço' });
  }
});

// DELETE serviço por nome
router.delete('/servicos/nome/:nome', (req, res) => {
  try {
    const { nome } = req.params;
    const dados = carregarArquivo();
    const index = dados.Servico.findIndex(s => String(s.nome).trim() === String(nome).trim());
    if (index === -1) return res.status(404).json({ mensagem: 'Serviço não encontrado' });

    dados.Servico.splice(index, 1);
    fs.writeFileSync(CAMINHO, JSON.stringify(dados, null, 2));
    res.json({ mensagem: 'Serviço removido' });
  } catch (erro) {
    console.error("❌ Erro no DELETE:", erro);
    res.status(500).json({ mensagem: 'Erro ao remover serviço' });
  }
});

export default router;