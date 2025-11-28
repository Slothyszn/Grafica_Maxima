let respostaPost = null;

// ===============================
// INSERIR ITEM
// ===============================
export async function InserirItem(event) {
  event.preventDefault();

  const id_orcRaw = document.getElementById("id_orc").value.trim();
  const tipo = document.getElementById("tipo").value;
  const id_ref = document.getElementById("id_ref").value.trim();
  const quant = document.getElementById("quant").value.trim();
  const custo_parcial = document.getElementById("custo_parcial").value.trim();

  const id_orc = id_orcRaw.split(" | ")[0]; // → só "1"

  // Validação básica
  if (!id_orc || !tipo || !id_ref || !quant || !custo_parcial) {
    alert("Preencha todos os campos!");
    return;
  }

  const novoItem = {
    id_orc: Number(id_orc),
    id_orcRaw: id_orcRaw,
    tipo,
    id_ref: id_ref,
    quant: Number(quant),
    custo_parcial: Number(custo_parcial)
  };

  console.log("Novo item enviado:", novoItem);

  try {
    const resposta = await fetch("http://localhost:3000/api/itens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoItem)
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.erro || "Erro ao inserir item");
      
    }

    const data = await resposta.json();
    respostaPost = data;
    alert(`Item inserido com sucesso! ID: ${data.id_item}`);

    // limpar campos
    document.getElementById("id_orc").value = "";
    document.getElementById("tipo").value = "";
    document.getElementById("id_ref").value = "";
    document.getElementById("quant").value = "";
    document.getElementById("custo_parcial").value = "";

    // Atualiza a tabela/listas
    if (window.ConsultarItens) window.ConsultarItens();
    if (window.carregarOpcoesItens) window.carregarOpcoesItens();

  } catch (erro) {
    console.error(erro);
    alert("Erro ao salvar item: " + erro.message);
  }
}

// ---------------------------------------------
// INSERIR – Adicionar nova dimensão
// ---------------------------------------------
export async function InserirDimensao(event) {
  event.preventDefault();

  const cmpr = document.getElementById("cmpr").value.trim();
  const larg = document.getElementById("larg").value.trim();
  const mrg_interna = document.getElementById("mrg_interna").value.trim();
  const mrg_sangria = document.getElementById("mrg_sangria").value.trim();
  const mrg_branca = document.getElementById("mrg_branca").value.trim();
  const mrg_espaco = document.getElementById("mrg_espaco").value.trim();

  console.log(cmpr, larg);

  // validação mínima
  if (!cmpr || !larg) {
    alert("Preencha comprimento e largura!");
    return;
  }

  const id_itemm = respostaPost.id_item;

  if (!id_itemm) {
    alert("Primeiro insira o item antes de adicionar dimensões!");
    return;
  }

  console.log(id_itemm);

  const novaDimensao = { id_item: id_itemm, cmpr, larg, mrg_interna, mrg_sangria, mrg_branca, mrg_espaco };

  try {
    const resposta = await fetch("http://localhost:3000/api/dimensoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaDimensao)
    });

    if (!resposta.ok) {
      const erroData = await resposta.json().catch(() => ({}));
      throw new Error(erroData.mensagem || "Erro ao inserir dimensão");
    }

    const data = await resposta.json().catch(() => ({}));
    alert(`Dimensão adicionada com sucesso! ID: ${data.id_dim || ''}`);

    // limpar formulário
    document.getElementById("cmpr").value = "";
    document.getElementById("larg").value = "";
    document.getElementById("mrg_interna").value = "";
    document.getElementById("mrg_sangria").value = "";
    document.getElementById("mrg_branca").value = "";
    document.getElementById("mrg_espaco").value = "";

  } catch (erro) {
    console.error("Erro ao inserir dimensão:", erro);
    alert(`Não foi possível inserir a dimensão: ${erro.message}`);
  }
}




export async function InserirImpressao(event) {
  event.preventDefault();

  function extrairID(campo) {
    return Number(document.getElementById(campo).value.split(" | ")[0]);
  }

  const id_sub = extrairID("id_sub");
  const cod_frente = extrairID("cod_frente");
  const cod_verso = extrairID("cod_verso");
  const id_impres = extrairID("id_impres");
  const velo = Number(document.getElementById("velo").value);


  // VALIDAÇÃO COMPLETA
  if (
    Number.isNaN(id_sub) ||
    Number.isNaN(cod_frente) ||
    Number.isNaN(cod_verso) ||
    Number.isNaN(id_impres) ||
    Number.isNaN(velo) 
  ) {
    alert("Preencha todos os campos!");
    return;
  }

  const novaImpressao = {
    id_sub,
    cod_frente,
    cod_verso,
    id_impres,
    velo,
  };

  try {
    const resposta = await fetch("http://localhost:3000/api/impressao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaImpressao)
    });

    const dados = await fetch("http://localhost:3000/api/impressao");
    const data = await dados.json();

    if (!resposta.ok) {
      throw new Error(data.erro || "Erro ao inserir impressão");
    }

    alert(`Impressão adicionada! ID: ${data.id_imp}`);

    document.querySelector("form").reset();

  } catch (erro) {
    console.error("Erro ao inserir impressão:", erro);
    alert("Erro ao inserir impressão: " + erro.message);
  }
}
