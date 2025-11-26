import fs from 'fs';
import express from 'express';
const router = express.Router();

const CAMINHO = 'dados/impressoras.json';

// =====================================================
// Carrega arquivo de forma segura
// =====================================================
function carregarArquivo() {
  try {
    const conteudo = fs.readFileSync(CAMINHO, 'utf-8');
    if (!conteudo.trim()) return { Impressora: [] };

    const dados = JSON.parse(conteudo);
    if (!Array.isArray(dados.Impressora)) return { Impressora: [] };

    return dados;
  } catch {
    return { Impressora: [] };
  }
}

// =====================================================
// GET - listar todas impressoras
// =====================================================
router.get('/impressoras', (req, res) => {
  try {
    const dados = carregarArquivo();
    res.json(dados);
  } catch (erro) {
    console.error("❌ Erro no GET:", erro);
    res.status(500).json({ mensagem: "Erro ao ler o arquivo de impressoras" });
  }
});

// =====================================================
// POST - criar nova impressora
// =====================================================
router.post('/impressoras', (req, res) => {
  try {
    const nova = req.body;
    let dados = carregarArquivo();

    // Gera ID automático
    const ultimoID = dados.Impressora.length > 0
      ? Math.max(...dados.Impressora.map(i => parseInt(i.id_impres)))
      : 0;

    nova.id_impres = ultimoID + 1;

    const impressoraOrganizada = {
      id_impres: nova.id_impres,
      tecno: nova.tecno,
      tipo: nova.tipo,
      nome: nova.nome,
      custo_hora: nova.custo_hora,
      med_velo: nova.med_velo,
      velo_max: nova.velo_max,
      compr_max: nova.compr_max,
      larg_max: nova.larg_max,
      gram_max: nova.gram_max,
      esp_max: nova.esp_max
    };

    dados.Impressora.push(impressoraOrganizada);
    fs.writeFileSync(CAMINHO, JSON.stringify(dados, null, 2));

    res.json({ mensagem: "Impressora adicionada com sucesso!", id: nova.id_impres });

  } catch (erro) {
    console.error("❌ Erro no POST:", erro);
    res.status(500).json({ mensagem: "Erro ao salvar impressora" });
  }
});

// =====================================================
// PUT - atualizar campo específico
// =====================================================
router.put('/impressoras/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { campo, novoValor } = req.body;

    let dados = carregarArquivo();
    const impressora = dados.Impressora.find(i => i.id_impres == id);

    if (!impressora) {
      return res.status(404).json({ mensagem: "Impressora não encontrada" });
    }

    impressora[campo] = novoValor;

    fs.writeFileSync(CAMINHO, JSON.stringify(dados, null, 2));
    res.json({ mensagem: "Impressora atualizada com sucesso" });

  } catch (erro) {
    console.error("❌ Erro no PUT:", erro);
    res.status(500).json({ mensagem: "Erro ao atualizar impressora" });
  }
});

// =====================================================
// DELETE - remover por ID
// =====================================================
router.delete('/impressoras/:id', (req, res) => {
  try {
    const { id } = req.params;

    let dados = carregarArquivo();
    const index = dados.Impressora.findIndex(i => i.id_impres == id);

    if (index === -1) {
      return res.status(404).json({ mensagem: "Impressora não encontrada" });
    }

    dados.Impressora.splice(index, 1);
    fs.writeFileSync(CAMINHO, JSON.stringify(dados, null, 2));

    res.json({ mensagem: "Impressora removida com sucesso" });

  } catch (erro) {
    console.error("❌ Erro no DELETE:", erro);
    res.status(500).json({ mensagem: "Erro ao remover impressora" });
  }
});

export default router;
