import express from "express";
import fs from "fs";

const router = express.Router();

const caminho = "dados/impressao.json";
const caminhoSub = "dados/substrato.json";
const caminhoColor = "dados/colorimetrias.json";
const caminhoImpres = "dados/impressoras.json";

// ===============================
//  Função auxiliar: validar chaves externas
// ===============================
function validarReferencia(id_sub, cod_frente, cod_verso, id_impres) {
  try {
    const subs = JSON.parse(fs.readFileSync(caminhoSub, "utf-8")).Substrato ?? [];
    if (!subs.some(s => s.id_sub == id_sub)) {
      console.log("❌ Substrato inválido:", id_sub, "Substratos disponíveis:", subs.map(s => s.id_sub));
      return false;
    }

    const cores = JSON.parse(fs.readFileSync(caminhoColor, "utf-8")).Colorimetria ?? [];
    if (!cores.some(c => c.id_color == cod_frente)) {
      console.log("❌ Cor frente inválida:", cod_frente, "Cores disponíveis:", cores.map(c => c.id_color));
      return false;
    }
    if (!cores.some(c => c.id_color == cod_verso)) {
      console.log("❌ Cor verso inválida:", cod_verso, "Cores disponíveis:", cores.map(c => c.id_color));
      return false;
    }

    const impres = JSON.parse(fs.readFileSync(caminhoImpres, "utf-8")).Impressora ?? [];
    if (!impres.some(i => i.id_impres == id_impres)) {
      console.log("❌ Impressora inválida:", id_impres, "Impressoras disponíveis:", impres.map(i => i.id_impres));
      return false;
    }
    return true;
  } catch (err) {
    console.error("Erro na validação de referência:", err);
    return false;
  }
}

// ===============================
//  GET – listar todas
// ===============================
router.get("/impressao", (req, res) => {
  try {
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao ler Impressões" });
  }
});

// ===============================
//  GET – buscar por ID
// ===============================
router.get("/impressao/:id_imp", (req, res) => {
  try {
    const { id_imp } = req.params;
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const reg = dados.Impressao.find(i => i.id_imp == id_imp);

    if (!reg) return res.status(404).json({ mensagem: "Impressão não encontrada" });
    res.json(reg);

  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar impressão" });
  }
});

// ===============================
//  POST – Criar nova Impressão
// ===============================
router.post("/impressao", (req, res) => {

  const { id_sub, cod_frente, cod_verso, id_impres, velo, n_pass } = req.body;

  // validação correta (sem !variavel)
  if ([id_sub, cod_frente, cod_verso, id_impres, velo, n_pass].some(v => v === undefined || v === null || v === "")) {
    return res.status(400).json({ erro: "Campos obrigatórios faltando" });
  }

  // validar FKs
  if (!validarReferencia(id_sub, cod_frente, cod_verso, id_impres)) {
    return res.status(400).json({ erro: "Referências inválidas" });
  }

  try {
    if (!fs.existsSync(caminho)) {
      fs.writeFileSync(caminho, JSON.stringify({ Impressao: [] }, null, 2));
    }

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const lista = dados.Impressao || [];

    const novoID = lista.length > 0
      ? Math.max(...lista.map(i => parseInt(i.id_imp))) + 1
      : 1;

    const nova = {
      id_imp: novoID,
      id_sub,
      cod_frente,
      cod_verso,
      id_impres,
      velo,
      n_pass,
      custo_hora: req.body.custo_hora ?? 0,
      custo_exced: req.body.custo_exced ?? 0
    };

    lista.push(nova);

    fs.writeFileSync(caminho, JSON.stringify({ Impressao: lista }, null, 2));

    return res.status(201).json({
      mensagem: "Impressão criada com sucesso!",
      id: novoID
    });

  } catch (erro) {
    console.error("❌ ERRO AO SALVAR IMPRESSÃO:", erro);
    return res.status(500).json({ erro: "Erro ao salvar impressão" });
  }
});


// ------------------------------
// PUT – Atualizar Impressão
// ------------------------------
router.put("/impressao/:id_imp", (req, res) => {
  try {
    const id_imp = parseInt(req.params.id_imp);
    const { campo, novoValor } = req.body;

    if (!campo || novoValor === undefined) {
      return res.status(400).json({
        erro: "Envie 'campo' e 'novoValor' no corpo da requisição"
      });
    }

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const impressao = dados.Impressao.find(i => i.id_imp === id_imp);

    if (!impressao) {
      return res.status(404).json({ erro: "Impressão não encontrada" });
    }

    // Verificar se o campo existe
    if (!(campo in impressao)) {
      return res.status(400).json({
        erro: `Campo '${campo}' não existe em Impressão`
      });
    }

    // Campos que devem ser números
    const camposNumericos = ["id_sub", "cod_frente", "cod_verso", "id_impres", "velo", "n_pass", "custo_hora", "custo_exced"];

    if (camposNumericos.includes(campo)) {
      impressao[campo] = Number(novoValor);
    } else {
      impressao[campo] = novoValor;
    }

    // Validar referências caso sejam IDs
    if (["id_sub", "cod_frente", "cod_verso", "id_impres"].includes(campo)) {
      if (!validarReferencia(
        impressao.id_sub,
        impressao.cod_frente,
        impressao.cod_verso,
        impressao.id_impres
      )) {
        return res.status(400).json({ erro: "Referências inválidas" });
      }
    }

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.json({
      mensagem: "Impressão atualizada com sucesso",
      atualizado: impressao
    });

  } catch (erro) {
    console.error("❌ Erro no PUT de Impressão:", erro);
    res.status(500).json({ erro: "Erro ao atualizar impressão" });
  }
});


// ===============================
//  DELETE – Remover Impressão
// ===============================
router.delete("/impressao/:id_imp", (req, res) => {
  try {
    const { id_imp } = req.params;

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const novoArray = dados.Impressao.filter(i => i.id_imp != id_imp);

    if (novoArray.length === dados.Impressao.length) {
      return res.status(404).json({ mensagem: "Impressão não encontrada" });
    }

    dados.Impressao = novoArray;
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.json({ mensagem: "Impressão removida com sucesso" });

  } catch (erro) {
    console.error("Erro ao deletar:", erro);
    res.status(500).json({ erro: "Erro ao excluir impressão" });
  }
});

export default router;
