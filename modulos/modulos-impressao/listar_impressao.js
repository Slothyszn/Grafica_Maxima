// ===============================
// CONSULTAR IMPRESSÕES
// ===============================
export async function ConsultarImpressao() {
  try {
    const resposta = await fetch("http://localhost:3000/api/impressao");
    const dados = await resposta.json();

    const impressoes = Array.isArray(dados) ? dados : dados.Impressao || [];

    const tabelaBody = document.querySelector("#resultado tbody");
    if (!tabelaBody) return;

    if (!impressoes.length) {
      tabelaBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Nenhuma impressão encontrada</td></tr>`;
      return;
    }

    tabelaBody.innerHTML = impressoes.map(i => `
      <tr>
        <td>${i.id_imp}</td>
        <td>${i.id_sub || ""}</td>
        <td>${i.cod_frente || ""}</td>
        <td>${i.cod_verso || ""}</td>
        <td>${i.id_impres || ""}</td>
        <td>${i.velo || ""}</td>
        <td>${i.n_pass || ""}</td>
        <td>${i.custo_hora || ""}</td>
        <td>${i.custo_exced || ""}</td>
      </tr>
    `).join("");

  } catch (erro) {
    console.error("Erro ao consultar impressões:", erro);
    const tabelaBody = document.querySelector("#resultado tbody");
    if (tabelaBody) tabelaBody.innerHTML = `<tr><td colspan="7">Erro ao carregar impressões</td></tr>`;
  }
}


// ===============================
// SUMIR TABELA
// ===============================
export function desaparecerImpressao() {
  const tabelaBody = document.querySelector("#resultado tbody");
  if (tabelaBody) tabelaBody.textContent = '';
}



// ===============================
// CARREGAR DATALISTS
// (INSERÇÃO / EDIÇÃO / EXCLUSÃO)
// ===============================
export async function carregarOpcoesImpressao() {
  try {
    const resposta = await fetch("http://localhost:3000/api/impressao");
    const dados = await resposta.json();

    const impressoes = Array.isArray(dados) ? dados : dados.Impressao || [];

    const listaEditar = document.getElementById("listaImpressaoEditar");
    const listaExcluir = document.getElementById("listaImpressaoExcluir");

    if (listaEditar) listaEditar.innerHTML = "";
    if (listaExcluir) listaExcluir.innerHTML = "";

    impressoes.forEach(i => {
      const op = document.createElement("option");
      op.value = `${i.id_imp} | ${i.cod_frente} / ${i.cod_verso}`;

      if (listaEditar) listaEditar.appendChild(op.cloneNode());
      if (listaExcluir) listaExcluir.appendChild(op.cloneNode());
    });

  } catch (erro) {
    console.error("Erro ao carregar opções:", erro);
  }
}



// ===============================
// BUSCA DINÂMICA
// ===============================
export async function configurarBuscaImpressao() {
  const input = document.getElementById("busca");
  const tabelaBody = document.querySelector("#resultado tbody");
  if (!input || !tabelaBody) return;

  function renderizarTabela(lista) {
    if (!lista.length) {
      tabelaBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Nenhum resultado encontrado</td></tr>`;
      return;
    }

    tabelaBody.innerHTML = lista.map(i => `
      <tr>
        <td>${i.id_imp}</td>
        <td>${i.id_sub || ""}</td>
        <td>${i.cod_frente || ""}</td>
        <td>${i.cod_verso || ""}</td>
        <td>${i.id_impres || ""}</td>
        <td>${i.velo || ""}</td>
        <td>${i.n_pass || ""}</td>
        <td>${i.custo_hora || ""}</td>
        <td>${i.custo_exced || ""}</td>
      </tr>
    `).join("");
  }

  async function carregarTudo() {
    const resposta = await fetch("http://localhost:3000/api/impressao");
    const dados = await resposta.json();
    return Array.isArray(dados) ? dados : dados.Impressao || [];
  }

  let impressoes = [];
  try {
    impressoes = await carregarTudo();
    renderizarTabela(impressoes);
  } catch {
    tabelaBody.innerHTML = `<tr><td colspan="7">Erro ao carregar impressões</td></tr>`;
  }

  input.addEventListener("input", () => {
    const termo = input.value.trim().toLowerCase();

    if (!termo) {
      renderizarTabela(impressoes);
      return;
    }

    const filtradas = impressoes.filter(i =>
      String(i.id_imp).includes(termo) ||
      (i.cod_frente || "").toLowerCase().includes(termo) ||
      (i.cod_verso || "").toLowerCase().includes(termo)
    );

    renderizarTabela(filtradas);
  });
}



// ===============================
// CARREGAR SUBSTRATOS / FRENTE / VERSO / IMPRESSORAS
// ===============================
export async function carregarTabelasExternasImpressao() {
  try {
    const [resSub, resCor, resImp] = await Promise.all([
      fetch("http://localhost:3000/api/substratos"),
      fetch("http://localhost:3000/api/colorimetria"),
      fetch("http://localhost:3000/api/impressoras")
    ]);

    const dadosSub = await resSub.json();
    const dadosCor = await resCor.json();
    const dadosImp = await resImp.json();

    const substratos = Array.isArray(dadosSub) ? dadosSub : dadosSub.Substrato || [];
    const cores = Array.isArray(dadosCor) ? dadosCor : dadosCor.Colorimetria || [];
    const impressoras = Array.isArray(dadosImp) ? dadosImp : dadosImp.Impressora || [];

    const listaSub = document.getElementById("listaSubstratos");
    const listaFrente = document.getElementById("listaFrente");
    const listaVerso = document.getElementById("listaVerso");
    const listaImpressoras = document.getElementById("listaImpressoras");

    if (listaSub) listaSub.innerHTML = "";
    if (listaFrente) listaFrente.innerHTML = "";
    if (listaVerso) listaVerso.innerHTML = "";
    if (listaImpressoras) listaImpressoras.innerHTML = "";

    // Substratos
    substratos.forEach(s => {
      const op = document.createElement("option");
      op.value = `${s.id_sub}`;
      op.label = `${s.id_sub} - ${s.med_sub} ${s.valor}`;
      listaSub.appendChild(op);
    });

    // Frente e Verso (colorimetria)
    cores.forEach(c => {
      const op = document.createElement("option");
      op.value = `${c.id_color}`;
      op.label = `${c.id_color} - ${c.descricao}`;
      listaFrente.appendChild(op.cloneNode());
      listaVerso.appendChild(op.cloneNode());
    });

    // Impressoras
    impressoras.forEach(i => {
      const op = document.createElement("option");
      op.value = `${i.id_impres}`;
      op.label = `${i.id_impres} - ${i.nome}`;
      listaImpressoras.appendChild(op);
    });

  } catch (erro) {
    console.error("Erro ao carregar tabelas externas:", erro);
  }
}
