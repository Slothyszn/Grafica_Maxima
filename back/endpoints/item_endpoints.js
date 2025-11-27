import express from "express";
import fs from "fs";

const router = express.Router();

const caminho = "dados/itens.json";
const caminhoOrc = "dados/orcamentos.json";
const caminhoImp = "dados/impressao.json";
const caminhoProd = "dados/produto.json";
const caminhoServ = "dados/servico.json";

// ==========================
// Função auxiliar: validar id_ref conforme tipo
// ==========================
// ==========================
// Validação de id_ref para produto ou serviço
// ==========================
function validarIdRef(tipo, id_ref) {
  let dadosTabela = [];
  
  switch (tipo) {
    case "produto":
      dadosTabela = JSON.parse(fs.readFileSync(caminhoProd, "utf-8")).Produto ?? [];
      if (!dadosTabela.some(p => p.id_prod == id_ref)) {
        return { valido: false, msg: `Produto com id_ref ${id_ref} não encontrado` };
      }
      break;

    case "servico":
      dadosTabela = JSON.parse(fs.readFileSync(caminhoServ, "utf-8")).Servico ?? [];
      if (!dadosTabela.some(s => s.id_serv == id_ref)) {
        return { valido: false, msg: `Serviço com id_ref ${id_ref} não encontrado` };
      }
      break;

    default:
      return { valido: false, msg: `Tipo inválido: ${tipo}` };
  }

  return { valido: true };
}

// ==========================
// GET – Listar todos os itens
// ==========================
router.get("/itens", (req, res) => {
  try {
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao ler Itens" });
  }
});

// ==========================
// GET – Buscar um item pelo ID
// ==========================
router.get("/itens/:id_item", (req, res) => {
  try {
    const { id_item } = req.params;
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const item = dados.Item.find(i => i.id_item == id_item);
    if (!item) return res.status(404).json({ mensagem: "Item não encontrado" });
    res.json(item);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao processar requisição" });
  }
});

// ==========================
// POST – Criar novo item
// ==========================
router.post("/itens", (req, res) => {
  try {
    const { id_orc, id_orcRaw, tipo, id_ref, quant, custo_parcial } = req.body;

    if (!id_orc || !tipo || !id_ref || !quant || !custo_parcial) {
      return res.status(400).json({ erro: "Campos obrigatórios faltando" });
    }

    // Validar orçamento
    const orcamentos = JSON.parse(fs.readFileSync(caminhoOrc, "utf-8")).Orcamento ?? [];
    if (!orcamentos.some(o => o.id_orc == id_orc)) {
      return res.status(400).json({ erro: "Orçamento não encontrado" });
    }


    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    if (!Array.isArray(dados.Item)) dados.Item = [];

    const novoID = dados.Item.length > 0
      ? Math.max(...dados.Item.map(i => parseInt(i.id_item))) + 1
      : 1;

    const novo = { id_item: novoID, id_orc, id_orcRaw, tipo, id_ref, quant, custo_parcial };
    dados.Item.push(novo);
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

    res.status(201).json(novo);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao salvar Item" });
  }
});

// ==========================
// PUT – Atualizar item (apenas: { campo, novoValor })
// ==========================
router.put("/itens/:id_item", (req, res) => {
  try {
    const { id_item } = req.params;
    const { campo, novoValor } = req.body;

    if (!campo) return res.status(400).json({ erro: "Envie o campo a ser alterado" });

    // campos permitidos para atualização direta
    const permitidos = ["id_orc", "id_orcRaw", "tipo", "id_ref", "quant", "custo_parcial"];

    if (!permitidos.includes(campo)) {
      return res.status(400).json({ erro: `Campo não permitido: ${campo}` });
    }

    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const index = dados.Item.findIndex(it => it.id_item == id_item);
    if (index === -1) return res.status(404).json({ mensagem: "Item não encontrado" });

    const atual = dados.Item[index];

    // função utilitária pra extrair ID caso o valor venha como "1 | Nome | Data"
    const extrairIdSePrecisar = (v) => {
      if (typeof v !== "string") return v;
      return v.includes(" | ") ? v.split(" | ")[0].trim() : v.trim();
    };

    // prepara valor convertido conforme o campo
    let valorParaSalvar = novoValor;

    // validações específicas
    if (campo === "id_orc") {
      const idOrcExtraido = extrairIdSePrecisar(novoValor);
      // verifica se existe no orcamentos
      const orcamentos = JSON.parse(fs.readFileSync(caminhoOrc, "utf-8")).Orcamento ?? [];
      if (!orcamentos.some(o => o.id_orc == idOrcExtraido)) {
        return res.status(400).json({ erro: "Orçamento não encontrado" });
      }
      // salva numérico (mas não mexe no id_orcRaw)
      valorParaSalvar = Number(idOrcExtraido);
    }

    if (campo === "id_ref") {
      const idRefExtraido = extrairIdSePrecisar(novoValor);
      // usa o tipo atual do item para validar (se tipo for alterado junto, usuário deve primeiro alterar tipo)
      const tipoAtual = atual.tipo;
      if (!validarIdRef(tipoAtual, idRefExtraido)) {
        return res.status(400).json({ erro: `id_ref inválido para o tipo ${tipoAtual}` });
      }
      valorParaSalvar = Number(idRefExtraido);
    }

    if (campo === "tipo") {
      const novoTipo = String(novoValor).trim();
      // se trocar o tipo, valida o id_ref atual contra o novo tipo
      if (!validarIdRef(novoTipo, atual.id_ref)) {
        return res.status(400).json({ erro: `Não é possível mudar tipo para ${novoTipo} porque id_ref atual (${atual.id_ref}) não é válido para esse tipo` });
      }
      valorParaSalvar = novoTipo;
    }

    // campos numéricos simples
    if (campo === "quant" || campo === "custo_parcial") {
      const n = Number(novoValor);
      if (Number.isNaN(n)) return res.status(400).json({ erro: `${campo} deve ser um número válido` });
      valorParaSalvar = n;
    }

    // id_orcRaw deve ser string (texto completo)
    if (campo === "id_orcRaw") {
      valorParaSalvar = String(novoValor);
    }

    // aplica alteração (preservando outros campos)
    dados.Item[index] = {
      ...atual,
      [campo]: valorParaSalvar
    };

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
    return res.json(dados.Item[index]);

  } catch (erro) {
    console.error("PUT /itens erro:", erro);
    return res.status(500).json({ erro: "Erro ao atualizar Item" });
  }
});


// ==========================
// DELETE – Remover item
// ==========================
router.delete("/itens/:id_item", (req, res) => {
  try {
    const { id_item } = req.params;
    const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
    const novoArray = dados.Item.filter(i => i.id_item != id_item);

    if (novoArray.length === dados.Item.length) {
      return res.status(404).json({ mensagem: "Item não encontrado" });
    }

    dados.Item = novoArray;
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
    res.json({ mensagem: "Item removido com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao excluir Item" });
  }
});

export default router;
