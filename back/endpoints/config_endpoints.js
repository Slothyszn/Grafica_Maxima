import fs from 'fs';
import express from 'express';
const router = express.Router();

const CAMINHO = 'dados/config.json';
const CAMINHO_COLOR = 'dados/colorimetrias.json';
const CAMINHO_IMPRES = 'dados/impressoras.json';

// =====================================================
// Função segura para carregar arquivo
// =====================================================
function carregarArquivo() {
  try {
    const conteudo = fs.readFileSync(CAMINHO, 'utf-8');
    if (!conteudo.trim()) return { Config: [] };

    const dados = JSON.parse(conteudo);
    if (!Array.isArray(dados.Config)) return { Config: [] };

    return dados;
  } catch {
    return { Config: [] };
  }
}

// =====================================================
// GET - listar todas configs
// =====================================================
router.get('/configs', (req, res) => {
  try {
    const dados = carregarArquivo();
    res.json(dados);
  } catch (erro) {
    console.error("❌ Erro no GET:", erro);
    res.status(500).json({ mensagem: "Erro ao ler o arquivo de configs" });
  }
});

// =====================================================
// POST - criar nova config
// =====================================================
router.post('/configs', (req, res) => {
  try {
    const nova = req.body;
    let dados = carregarArquivo();

    // -----------------------------
    // ⚠️ Validação das chaves externas
    // -----------------------------
    const colorimetrias = JSON.parse(fs.readFileSync(CAMINHO_COLOR, 'utf-8')).Colorimetria;
    const impressoras = JSON.parse(fs.readFileSync(CAMINHO_IMPRES, 'utf-8')).Impressora;

    const colorValido = colorimetrias.find(c => c.id_color == nova.id_color);
    const impresValida = impressoras.find(i => i.id_impres == nova.id_impres);

    if (!colorValido) {
      return res.status(400).json({ mensagem: "Colorimetria inválida" });
    }
    if (!impresValida) {
      return res.status(400).json({ mensagem: "Impressora inválida" });
    }

    // Gerar ID sequencial
    const ultimoID = dados.Config.length > 0
      ? Math.max(...dados.Config.map(c => parseInt(c.id_config)))
      : 0;

    nova.id_config = ultimoID + 1;

    const configOrganizada = {
      id_config: nova.id_config,
      id_color: nova.id_color,
      id_impres: nova.id_impres,
      custo_acerto: nova.custo_acerto,
      custo_m2i: nova.custo_m2i
    };

    dados.Config.push(configOrganizada);
    fs.writeFileSync(CAMINHO, JSON.stringify(dados, null, 2));

    res.json({ mensagem: "Config adicionada com sucesso!", id: nova.id_config });

  } catch (erro) {
    console.error("❌ Erro no POST:", erro);
    res.status(500).json({ mensagem: "Erro ao salvar config" });
  }
});

// =====================================================
// PUT - atualizar campo de uma config
// =====================================================
router.put('/configs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { campo, novoValor } = req.body;

    let dados = carregarArquivo();
    const config = dados.Config.find(c => c.id_config == id);

    if (!config) {
      return res.status(404).json({ mensagem: "Config não encontrada" });
    }

    // ------------------------------------------
    // Validação das chaves externas ANTES de alterar
    // ------------------------------------------
    if (campo === "id_color") {
      const colorimetrias = JSON.parse(fs.readFileSync(CAMINHO_COLOR, 'utf-8')).Colorimetria;
      if (!colorimetrias.find(c => c.id_color == novoValor)) {
        return res.status(400).json({ mensagem: "Colorimetria inválida" });
      }
    }

    if (campo === "id_impres") {
      const impressoras = JSON.parse(fs.readFileSync(CAMINHO_IMPRES, 'utf-8')).Impressora;
      if (!impressoras.find(i => i.id_impres == novoValor)) {
        return res.status(400).json({ mensagem: "Impressora inválida" });
      }
    }

    config[campo] = novoValor;

    fs.writeFileSync(CAMINHO, JSON.stringify(dados, null, 2));
    res.json({ mensagem: "Config atualizada com sucesso" });

  } catch (erro) {
    console.error("❌ Erro no PUT:", erro);
    res.status(500).json({ mensagem: "Erro ao atualizar config" });
  }
});

// =====================================================
// DELETE - remover config por ID
// =====================================================
router.delete('/configs/:id', (req, res) => {
  try {
    const { id } = req.params;

    let dados = carregarArquivo();
    const index = dados.Config.findIndex(c => c.id_config == id);

    if (index === -1) {
      return res.status(404).json({ mensagem: "Config não encontrada" });
    }

    dados.Config.splice(index, 1);
    fs.writeFileSync(CAMINHO, JSON.stringify(dados, null, 2));

    res.json({ mensagem: "Config removida com sucesso" });

  } catch (erro) {
    console.error("❌ Erro no DELETE:", erro);
    res.status(500).json({ mensagem: "Erro ao remover config" });
  }
});

export default router;
