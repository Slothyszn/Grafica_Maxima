// ==========================
// LISTAR fornecimentos
// ==========================
export async function ConsultarFornecimentos() {
  try {
    const [resFornc, resFornec, resSubs, resForm] = await Promise.all([
      fetch("https://grafica-maxima.onrender.com/api/fornecimentos"),
      fetch("https://grafica-maxima.onrender.com/api/fornecedores"),
      fetch("https://grafica-maxima.onrender.com/api/substratos"),
      fetch("https://grafica-maxima.onrender.com/api/formatos")
    ]);

    const dadosFornc = await resFornc.json();
    const dadosForn = await resFornec.json();
    const dadosSub = await resSubs.json();
    const dadosForm = await resForm.json();

    const fornecimentos = Array.isArray(dadosFornc.Fornecimento)
      ? dadosFornc.Fornecimento
      : [];

    const fornecedores = Array.isArray(dadosForn.Fornecedor)
      ? dadosForn.Fornecedor
      : [];

    const substratos = Array.isArray(dadosSub.Substrato)
      ? dadosSub.Substrato
      : [];

    const formatos = Array.isArray(dadosForm.Formato)
      ? dadosForm.Formato
      : [];

    const tabela = document.querySelector("#resultado tbody");
    if (!tabela) return;

    if (!fornecimentos.length) {
      tabela.innerHTML =
        `<tr><td colspan="6" style="text-align:center;">Nenhum fornecimento encontrado</td></tr>`;
      return;
    }

    tabela.innerHTML = fornecimentos.map(f => {
      const forn = fornecedores.find(x => x.id_forn == f.id_fornecedor);
      const sub = substratos.find(x => x.id_sub == f.id_sub);
      const form = formatos.find(x => x.id_form == f.id_form);

      return `
        <tr>
          <td>${f.id}</td>
          <td>${forn ? forn.nome : f.id_fornecedor}</td>
          <td>${sub ? sub.id_sub : f.id_sub}</td>
          <td>${form ? form.nome : f.id_form}</td>
          <td>${f.forma || ""}</td>
          <td>${f.custo_pro_m2 || ""}</td>
        </tr>`;
    }).join("");

  } catch (erro) {
    console.error("Erro ao consultar fornecimentos:", erro);
    const tabela = document.querySelector("#resultado tbody");
    if (tabela)
      tabela.innerHTML =
        `<tr><td colspan="6">Erro ao carregar fornecimentos</td></tr>`;
  }
}

// ==========================
// SUMIR DA TABELA
// ==========================
export function desaparecerFornecimentos() {
  const tabela = document.querySelector("#resultado tbody");
  if (tabela) tabela.textContent = "";
}

// ==========================
// BUSCA DINÂMICA (padrão configs)
// ==========================
export async function configurarBuscaFornecimentos() {
  const input = document.getElementById("busca");
  const tabela = document.querySelector("#resultado tbody");
  if (!input || !tabela) return;

  function renderTabela(arr, fornecedores, substratos, formatos) {
    if (!arr.length) {
      tabela.innerHTML =
        `<tr><td colspan="6" style="text-align:center;">Nenhum resultado encontrado</td></tr>`;
      return;
    }

    tabela.innerHTML = arr.map(f => {
      const forn = fornecedores.find(x => x.id_forn == f.id_fornecedor);
      const sub = substratos.find(x => x.id_sub == f.id_sub);
      const form = formatos.find(x => x.id_fmt == f.id_fmt);

      return `
      <tr>
        <td>${f.id_fornec}</td>
        <td>${forn ? forn.id_forn : f.id_forn}</td>
        <td>${sub ? sub.id_sub : f.id_sub}</td>
        <td>${form ? form.nome : f.id_fmt}</td>
        <td>${f.forma || ""}</td>
        <td>${f.custo_m2 || ""}</td>
      </tr>`;
    }).join("");
  }

  // Carrega inicial
  let fornecimentos = [];
  let fornecedores = [];
  let substratos = [];
  let formatos = [];

  try {
    const [resFornc, resForn, resSubs, resForm] = await Promise.all([
      fetch("https://grafica-maxima.onrender.com/api/fornecimentos"),
      fetch("https://grafica-maxima.onrender.com/api/fornecedores"),
      fetch("https://grafica-maxima.onrender.com/api/substratos"),
      fetch("https://grafica-maxima.onrender.com/api/formatos")
    ]);

    const dadosFornc = await resFornc.json();
    const dadosFornec = await resForn.json();
    const dadosSub = await resSubs.json();
    const dadosFormat = await resForm.json();

    fornecimentos = Array.isArray(dadosFornc.Fornecimento) ? dadosFornc.Fornecimento : [];
    fornecedores = Array.isArray(dadosFornec.Fornecedor) ? dadosFornec.Fornecedor : [];
    substratos = Array.isArray(dadosSub.Substrato) ? dadosSub.Substrato : [];
    formatos = Array.isArray(dadosFormat.Formato) ? dadosFormat.Formato : [];

    renderTabela(fornecimentos, fornecedores, substratos, formatos);

  } catch (erro) {
    tabela.innerHTML = `<tr><td colspan="6">Erro ao carregar</td></tr>`;
    console.error(erro);
  }

  // Busca dinâmica
  input.addEventListener("input", () => {
    const termo = input.value.toLowerCase().trim();

    if (!termo) {
      renderTabela(fornecimentos, fornecedores, substratos, formatos);
      return;
    }

    const filtradas = fornecimentos.filter(f => {
      const forn = fornecedores.find(x => x.id_forn == f.id_fornecedor);
      const sub = substratos.find(x => x.id_sub == f.id_sub);
      const form = formatos.find(x => x.id_form == f.id_form);

      return (
        String(f.id).includes(termo) ||
        (forn?.nome || "").toLowerCase().includes(termo) ||
        (sub?.id_sub || "").toLowerCase().includes(termo) ||
        (form?.nome || "").toLowerCase().includes(termo) ||
        (f.forma || "").toLowerCase().includes(termo)
      );
    });

    renderTabela(filtradas, fornecedores, substratos, formatos);
  });
}

// ==========================
// DATALISTS (padrão configs)
// ==========================
export async function carregarOpcoesFornecimentos() {
  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/fornecimentos");
    const dados = await resposta.json();

    const fornecimentos = Array.isArray(dados.Fornecimento)
      ? dados.Fornecimento
      : [];

    const list1 = document.getElementById("listaFornecimentos");
    const list2 = document.getElementById("listaFornecimentosExcluir");

    if (list1) list1.innerHTML = "";
    if (list2) list2.innerHTML = "";

    fornecimentos.forEach(f => {
      const texto = `${f.id_fornec} | ${f.id_forn} | ${f.id_sub} | ${f.id_fmt} | ${f.forma}`;

      const op1 = document.createElement("option");
      op1.value = texto;

      const op2 = document.createElement("option");
      op2.value = texto;

      list1.appendChild(op1);
      list2.appendChild(op2);
    });
  } catch (erro) {
    console.error("Erro ao carregar opções:", erro);
  }
}


// ==========================
// Carregar fornecedores, substratos e formatos
// ==========================
export async function carregarTabelasExternasFornecimento() {
  try {
    const [resF, resS, resFo] = await Promise.all([
      fetch("https://grafica-maxima.onrender.com/api/fornecedores"),
      fetch("https://grafica-maxima.onrender.com/api/substratos"),
      fetch("https://grafica-maxima.onrender.com/api/formatos")
    ]);

    const dadosForn = await resF.json();
    const dadosSub = await resS.json();
    const dadosForm = await resFo.json();

    const fornecedores = Array.isArray(dadosForn.Fornecedor)
      ? dadosForn.Fornecedor
      : [];

    const substratos = Array.isArray(dadosSub.Substrato)
      ? dadosSub.Substrato
      : [];

    const formatos = Array.isArray(dadosForm.Formato)
      ? dadosForm.Formato
      : [];

    const listF = document.getElementById("listaFornecedores");
    const listS = document.getElementById("listaSubstratos");
    const listFo = document.getElementById("listaFormatos");

    if (listF) listF.innerHTML = "";
    if (listS) listS.innerHTML = "";
    if (listFo) listFo.innerHTML = "";

    fornecedores.forEach(f => {
      const op = document.createElement("option");
      op.value = f.nome;
      listF.appendChild(op);
    });

    substratos.forEach(s => {
      const op = document.createElement("option");
      op.value = s.id_sub;
      op.textContent = `Substrato #${s.id_sub}`; // só para o usuário ver algo mais amigável
      listS.appendChild(op);
    });

    formatos.forEach(f => {
      const op = document.createElement("option");
      op.value = f.nome;
      listFo.appendChild(op);
    });

  } catch (erro) {
    console.error("Erro ao carregar tabelas:", erro);
  }
}
