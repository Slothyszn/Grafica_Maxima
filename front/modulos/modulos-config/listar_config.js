export async function ConsultarConfigs() {
  try {
    // buscar configs e impressoras para mostrar o nome da impressora
    const [resConfigs, resImpr] = await Promise.all([
      fetch("https://grafica-maxima.onrender.com/api/configs"),
      fetch("https://grafica-maxima.onrender.com/api/impressoras")
    ]);

    const dados = await resConfigs.json();
    const dadosImpr = await resImpr.json();

    const configs = Array.isArray(dados) ? dados : dados.Config || [];
    const impressoras = Array.isArray(dadosImpr) ? dadosImpr : dadosImpr.Impressora || [];

    const tabelaBody = document.querySelector("#resultado tbody");
    if (!tabelaBody) return;

    if (!configs.length) {
      tabelaBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhuma configuração encontrada</td></tr>`;
      return;
    }

    tabelaBody.innerHTML = configs.map(c => {
      const imp = impressoras.find(i => String(i.id_impres) === String(c.id_impres)) || {};
      return `
      <tr>
        <td>${c.id_config}</td>
        <td>${c.id_color}</td>
        <td>${imp.nome ? imp.nome : c.id_impres}</td>
        <td>${c.custo_acerto || ''}</td>
        <td>${c.custo_m2i || ''}</td>
      </tr>`;
    }).join("");
  } catch (erro) {
    console.error("Erro ao consultar configs:", erro);
    const tabelaBody = document.querySelector("#resultado tbody");
    if (tabelaBody) tabelaBody.innerHTML = `<tr><td colspan="7">Erro ao carregar configs</td></tr>`;
  }
}

export function desaparecerConfigs() {
  const tabelaBody = document.querySelector("#resultado tbody");
  if (tabelaBody) tabelaBody.textContent = '';
}

export async function carregarOpcoesConfigs() {
  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/configs");
    const dados = await resposta.json();
    const configs = Array.isArray(dados) ? dados : dados.Config || [];

    const datalist = document.getElementById("listaConfig");
    const datalistExcluir = document.getElementById("listaConfigExcluir");
    if (datalist) datalist.innerHTML = "";
    if (datalistExcluir) datalistExcluir.innerHTML = "";

    configs.forEach(conf => {
      const option = document.createElement("option");
      option.value = conf.id_config;
      if (datalist) datalist.appendChild(option.cloneNode());
      if (datalistExcluir) datalistExcluir.appendChild(option.cloneNode());
    });
  } catch (erro) {
    console.error("Erro ao carregar opções de configs:", erro);
  }
}

export async function configurarBuscaConfigs() {
  const input = document.getElementById("busca");
  const tabelaBody = document.querySelector("#resultado tbody");
  if (!input || !tabelaBody) return;

  function renderizarTabela(configs, impressoras = []) {
    if (!configs.length) {
      tabelaBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhuma resultado encontrado</td></tr>`;
      return;
    }

    tabelaBody.innerHTML = configs.map(c => {
      const imp = (impressoras || []).find(i => String(i.id_impres) === String(c.id_impres)) || {};
      return `
      <tr>
        <td>${c.id_config}</td>
        <td>${c.id_color}</td>
        <td>${imp.nome ? imp.nome : c.id_impres}</td>
        <td>${c.custo_acerto || ''}</td>
        <td>${c.custo_m2i || ''}</td>
      </tr>`;
    }).join("");
  }

  try {
    // carregar configs e impressoras para permitir busca por nome da impressora
    const [resInicial, resImpr] = await Promise.all([
      fetch("https://grafica-maxima.onrender.com/api/configs"),
      fetch("https://grafica-maxima.onrender.com/api/impressoras")
    ]);

    const dados = await resInicial.json();
    const dadosImpr = await resImpr.json();

    const configs = Array.isArray(dados) ? dados : dados.Config || [];
    const impressoras = Array.isArray(dadosImpr) ? dadosImpr : dadosImpr.Impressora || [];
    renderizarTabela(configs, impressoras);
  } catch (erro) {
    tabelaBody.innerHTML = `<tr><td colspan="7">Erro ao carregar configs</td></tr>`;
    console.error(erro);
  }

  input.addEventListener("input", async () => {
    const termo = input.value.trim().toLowerCase();

    try {
      const [res, resImpr] = await Promise.all([
        fetch("https://grafica-maxima.onrender.com/api/configs"),
        fetch("https://grafica-maxima.onrender.com/api/impressoras")
      ]);

      const dados = await res.json();
      const dadosImpr = await resImpr.json();

      const configs = Array.isArray(dados) ? dados : dados.Config || [];
      const impressoras = Array.isArray(dadosImpr) ? dadosImpr : dadosImpr.Impressora || [];

      if (!termo) {
        renderizarTabela(configs, impressoras);
        return;
      }

      const filtradas = configs.filter(c => {
        const imp = impressoras.find(i => String(i.id_impres) === String(c.id_impres)) || {};
        return (
          String(c.id_config).toLowerCase().includes(termo) ||
          String(c.id_color).toLowerCase().includes(termo) ||
          (imp.nome || '').toLowerCase().includes(termo) ||
          String(c.id_impres).toLowerCase().includes(termo)
        );
      });

      renderizarTabela(filtradas, impressoras);
    } catch (erro) {
      tabelaBody.innerHTML = `<tr><td colspan="5">Erro na busca</td></tr>`;
      console.error(erro);
    }
  });
}

// Carrega colorimetrias e impressoras para os datalists do formulário de config
export async function carregarTabelasExternasConfig() {
  try {
    const [resColor, resImpr] = await Promise.all([
      fetch("https://grafica-maxima.onrender.com/api/colorimetria"),
      fetch("https://grafica-maxima.onrender.com/api/impressoras")
    ]);

    const dataColor = await resColor.json();
    const dataImpr = await resImpr.json();

    const colorArr = Array.isArray(dataColor) ? dataColor : dataColor.Colorimetria || [];
    const imprArr = Array.isArray(dataImpr) ? dataImpr : dataImpr.Impressora || [];

    const datalistColor = document.getElementById("listaColorimetria");
    const datalistImpr = document.getElementById("listaImpressoras");

    if (datalistColor) datalistColor.innerHTML = "";
    if (datalistImpr) datalistImpr.innerHTML = "";

    colorArr.forEach(c => {
      const option = document.createElement("option");
      option.value = c.id_color;
      option.label = c.cod ? `${c.id_color} - ${c.cod}` : String(c.id_color);
      option.textContent = option.label || option.value;
      datalistColor && datalistColor.appendChild(option);
    });

    imprArr.forEach(i => {
      const option = document.createElement("option");
      option.value = i.id_impres;
      option.label = i.nome ? `${i.id_impres} - ${i.nome}` : String(i.id_impres);
      option.textContent = option.label || option.value;
      datalistImpr && datalistImpr.appendChild(option);
    });

    // não expondo impressoras/colorimetria globalmente — mantemos apenas a população dos datalists

  } catch (erro) {
    console.error("Erro ao carregar tabelas externas para config:", erro);
  }
}
