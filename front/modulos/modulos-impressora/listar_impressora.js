export async function ConsultarImpressoras() {
  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/impressoras");
    const dados = await resposta.json();
    const impressoras = Array.isArray(dados) ? dados : dados.Impressora || [];

    const tabelaBody = document.querySelector("#resultado tbody");
    if (!tabelaBody) return;

    if (!impressoras.length) {
      tabelaBody.innerHTML = `<tr><td colspan="11" style="text-align:center;">Nenhuma impressora encontrada</td></tr>`;
      return;
    }

    tabelaBody.innerHTML = impressoras.map(i => `
      <tr>
        <td>${i.id_impres}</td>
        <td>${i.nome || ''}</td>
        <td>${i.tecno || ''}</td>
        <td>${i.tipo || ''}</td>
        <td>${i.med_velo || ''}</td>
        <td>${i.velo_max || ''}</td>
        <td>${i.compr_max || ''}</td>
        <td>${i.larg_max || ''}</td>
        <td>${i.gram_max || ''}</td>
        <td>${i.esp_max || ''}</td>
        <td>${i.custo_hora || ''}</td>
      </tr>
    `).join("");
  } catch (erro) {
    console.error("Erro ao consultar impressoras:", erro);
    const tabelaBody = document.querySelector("#resultado tbody");
    if (tabelaBody) tabelaBody.innerHTML = `<tr><td colspan="11">Erro ao carregar impressoras</td></tr>`;
  }
}

export function desaparecerImpressoras() {
  const tabelaBody = document.querySelector("#resultado tbody");
  if (tabelaBody) tabelaBody.textContent = '';
}

export async function carregarOpcoesImpressoras() {
  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/impressoras");
    const dados = await resposta.json();
    const impressoras = Array.isArray(dados) ? dados : dados.Impressora || [];

    const datalist = document.getElementById("listaImpressoras");
    const datalistExcluir = document.getElementById("listaImpressorasExcluir");
    if (datalist) datalist.innerHTML = "";
    if (datalistExcluir) datalistExcluir.innerHTML = "";

    impressoras.forEach(i => {
      const option = document.createElement("option");
      option.value = i.id_impres;
      option.textContent = i.nome ? `${i.id_impres} - ${i.nome}` : String(i.id_impres);
      if (datalist) datalist.appendChild(option.cloneNode(true));
      if (datalistExcluir) datalistExcluir.appendChild(option.cloneNode(true));
    });
  } catch (erro) {
    console.error("Erro ao carregar opções de impressoras:", erro);
  }
}

export async function configurarBuscaImpressoras() {
  const input = document.getElementById("busca");
  const tabelaBody = document.querySelector("#resultado tbody");
  if (!input || !tabelaBody) return;

  function renderizarTabela(impressoras) {
    if (!impressoras.length) {
      tabelaBody.innerHTML = `<tr><td colspan="11" style="text-align:center;">Nenhum resultado encontrado</td></tr>`;
      return;
    }

    tabelaBody.innerHTML = impressoras.map(i => `
      <tr>
        <td>${i.id_impres}</td>
        <td>${i.nome || ''}</td>
        <td>${i.tecno || ''}</td>
        <td>${i.tipo || ''}</td>
        <td>${i.med_velo || ''}</td>
        <td>${i.velo_max || ''}</td>
        <td>${i.compr_max || ''}</td>
        <td>${i.larg_max || ''}</td>
        <td>${i.gram_max || ''}</td>
        <td>${i.esp_max || ''}</td>
        <td>${i.custo_hora || ''}</td>
      </tr>
    `).join("");
  }

  try {
    const resInicial = await fetch("https://grafica-maxima.onrender.com/api/impressoras");
    const dados = await resInicial.json();
    const impressoras = Array.isArray(dados) ? dados : dados.Impressora || [];
    renderizarTabela(impressoras);
  } catch (erro) {
    tabelaBody.innerHTML = `<tr><td colspan="4">Erro ao carregar impressoras</td></tr>`;
    console.error(erro);
  }

  input.addEventListener("input", async () => {
    const termo = input.value.trim();

    try {
      const res = await fetch("https://grafica-maxima.onrender.com/api/impressoras");
      const dados = await res.json();
      const impressoras = Array.isArray(dados) ? dados : dados.Impressora || [];

      if (!termo) {
        renderizarTabela(impressoras);
        return;
      }

      const filtradas = impressoras.filter(i => (i.nome || '').toLowerCase().includes(termo.toLowerCase()) || String(i.id_impres).includes(termo));
      renderizarTabela(filtradas);
    } catch (erro) {
      tabelaBody.innerHTML = `<tr><td colspan="4">Erro na busca</td></tr>`;
      console.error(erro);
    }
  });
}
