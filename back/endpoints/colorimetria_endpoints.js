import fs from 'fs';
import express from 'express';
const router = express.Router();

const CAMINHO = 'dados/colorimetrias.json';

// =====================================================
// Função segura para carregar arquivo JSON
// =====================================================
function carregarArquivo() {
  try {
    const conteudo = fs.readFileSync(CAMINHO, 'utf-8');
    if (!conteudo.trim()) return { Colorimetria: [] };
    const json = JSON.parse(conteudo);
    if (!Array.isArray(json.Colorimetria)) return { Colorimetria: [] };
    return json;
  } catch {
    return { Colorimetria: [] };
  }
}

// =====================================================
// GET todas as colorimetrias
// =====================================================
router.get('/colorimetria', (req, res) => {
  try {
    const dados = carregarArquivo();
    res.json(dados);
  } catch (erro) {
    console.error("❌ Erro no GET:", erro);
    res.status(500).json({ mensagem: "Erro ao ler o arquivo de colorimetrias" });
  }
});

// =====================================================
// POST nova colorimetria
// =====================================================
router.post('/colorimetria', (req, res) => {
  try {
    const nova = req.body;
    let dados = carregarArquivo();

    // Geração automática do ID
    const ultimoID = dados.Colorimetria.length > 0
      ? Math.max(...dados.Colorimetria.map(c => parseInt(c.id_color)))
      : 0;

    nova.id_color = ultimoID + 1;

    const colorimetriaOrganizada = {
      id_color: nova.id_color,
      cod: nova.cod,
      num_cores: nova.num_cores,
      descricao: nova.descricao
    };

    dados.Colorimetria.push(colorimetriaOrganizada);
    fs.writeFileSync(CAMINHO, JSON.stringify(dados, null, 2));

    res.json({ mensagem: "Colorimetria adicionada com sucesso!", id: nova.id_color });

  } catch (erro) {
    console.error("❌ Erro no POST:", erro);
    res.status(500).json({ mensagem: "Erro ao salvar colorimetria" });
  }
});

// =====================================================
// PUT atualização de colorimetria
// =====================================================
router.put('/colorimetria/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { campo, novoValor } = req.body;

    let dados = carregarArquivo();
    const registro = dados.Colorimetria.find(c => c.id_color == id);

    if (!registro) {
      return res.status(404).json({ mensagem: "Colorimetria não encontrada" });
    }

    registro[campo] = novoValor;

    fs.writeFileSync(CAMINHO, JSON.stringify(dados, null, 2));
    res.json({ mensagem: "Colorimetria atualizada com sucesso" });

  } catch (erro) {
    console.error("❌ Erro no PUT:", erro);
    res.status(500).json({ mensagem: "Erro ao atualizar colorimetria" });
  }
});

// =====================================================
// DELETE colorimetria por ID
// =====================================================
router.delete('/colorimetria/:id', (req, res) => {
  try {
    const { id } = req.params;

    let dados = carregarArquivo();
    const index = dados.Colorimetria.findIndex(c => c.id_color == id);

    if (index === -1) {
      return res.status(404).json({ mensagem: "Colorimetria não encontrada" });
    }

    dados.Colorimetria.splice(index, 1);
    fs.writeFileSync(CAMINHO, JSON.stringify(dados, null, 2));

    res.json({ mensagem: "Colorimetria removida com sucesso" });

  } catch (erro) {
    console.error("❌ Erro no DELETE:", erro);
    res.status(500).json({ mensagem: "Erro ao remover colorimetria" });
  }
});

export default router;
