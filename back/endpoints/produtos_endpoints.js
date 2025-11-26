import fs from 'fs/promises';
import express from 'express';
const router = express.Router();

const CAMINHO_JSON = 'dados/produtos.json';

// ==========================
// Função auxiliar: ler JSON
// ==========================
async function lerProdutos() {
  try {
    const conteudo = await fs.readFile(CAMINHO_JSON, 'utf-8');
    if (!conteudo.trim()) return { Produto: [] };
    const dados = JSON.parse(conteudo);
    if (!Array.isArray(dados.Produto)) dados.Produto = [];
    return dados;
  } catch {
    return { Produto: [] };
  }
}

// ==========================
// Função auxiliar: salvar JSON
// ==========================
async function salvarProdutos(dados) {
  await fs.writeFile(CAMINHO_JSON, JSON.stringify(dados, null, 2));
}

// ==========================
// GET todos os produtos
// ==========================
router.get('/produtos', async (req, res) => {
  try {
    const dados = await lerProdutos();
    res.json(dados);
  } catch (erro) {
    console.error("❌ Erro no GET:", erro);
    res.status(500).json({ mensagem: "Erro ao ler produtos" });
  }
});

// ==========================
// POST novo produto
// ==========================
router.post('/produtos', async (req, res) => {
  try {
    const { id_fam, id_categ, custo_m2 } = req.body;

    if (id_fam == null || id_categ == null || custo_m2 == null) {
      return res.status(400).json({ mensagem: "Campos obrigatórios: id_fam, id_categ, custo_m2" });
    }

    const dados = await lerProdutos();

    // Verifica índice único (id_fam, id_categ)
    const existente = dados.Produto.find(p => p.id_fam === id_fam && p.id_categ === id_categ);
    if (existente) {
      return res.status(400).json({ mensagem: "Produto com essa família e categoria já existe" });
    }

    const ultimoID = dados.Produto.length > 0
      ? Math.max(...dados.Produto.map(p => Number(p.id_prod)))
      : 0;

    const novoProduto = { 
      id_prod: ultimoID + 1, 
      id_fam: Number(id_fam), 
      id_categ: Number(id_categ), 
      custo_m2: Number(custo_m2) 
    };

    dados.Produto.push(novoProduto);
    await salvarProdutos(dados);

    res.json({ mensagem: "Produto criado", id_prod: novoProduto.id_prod });
  } catch (erro) {
    console.error("❌ Erro no POST Produto:", erro);
    res.status(500).json({ mensagem: "Erro interno" });
  }
});

// ==========================
// PUT atualizar produto
// ==========================
router.put('/produtos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { campo, novoValor } = req.body;

    const camposPermitidos = ["id_fam", "id_categ", "custo_m2"];
    if (!camposPermitidos.includes(campo)) {
      return res.status(400).json({ mensagem: "Campo inválido para atualização" });
    }

    const dados = await lerProdutos();
    const produto = dados.Produto.find(p => p.id_prod === id);
    if (!produto) return res.status(404).json({ mensagem: "Produto não encontrado" });

    // Atualiza e verifica índice único se for id_fam ou id_categ
    if (campo === "id_fam" || campo === "id_categ") {
      const novoValorNum = Number(novoValor);
      const outroValor = campo === "id_fam" ? produto.id_categ : produto.id_fam;
      const existe = dados.Produto.find(p => 
        p.id_prod !== id && 
        ((campo === "id_fam" ? novoValorNum : outroValor) === p.id_fam) &&
        ((campo === "id_categ" ? novoValorNum : outroValor) === p.id_categ)
      );
      if (existe) {
        return res.status(400).json({ mensagem: "Produto com essa família e categoria já existe" });
      }
      produto[campo] = novoValorNum;
    } else {
      produto[campo] = Number(novoValor);
    }

    await salvarProdutos(dados);
    res.json({ mensagem: "Produto atualizado com sucesso" });
  } catch (erro) {
    console.error("❌ Erro no PUT Produto:", erro);
    res.status(500).json({ mensagem: "Erro interno" });
  }
});

// ==========================
// DELETE produto
// ==========================
router.delete('/produtos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const dados = await lerProdutos();

    const index = dados.Produto.findIndex(p => p.id_prod === id);
    if (index === -1) return res.status(404).json({ mensagem: "Produto não encontrado" });

    dados.Produto.splice(index, 1);
    await salvarProdutos(dados);

    res.json({ mensagem: "Produto removido" });
  } catch (erro) {
    console.error("❌ Erro no DELETE Produto:", erro);
    res.status(500).json({ mensagem: "Erro interno" });
  }
});

export default router;
