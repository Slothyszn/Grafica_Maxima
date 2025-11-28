export async function ConsultarColorimetria() {
  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/colorimetria");
    const dados = await resposta.json();
    const registros = Array.isArray(dados) ? dados : dados.Colorimetria || [];

    const tabelaBody = document.querySelector("#resultado tbody");
    if (!tabelaBody) return;

    if (!registros.length) {
      tabelaBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhuma colorimetria encontrada</td></tr>`;
      return;
    }

    tabelaBody.innerHTML = registros.map(r => `
      <tr>
        <td>${r.id_color}</td>
        <td>${r.cod}</td>
        <td>${r.num_cores}</td>
        <td>${r.descricao || ''}</td>
      </tr>
    `).join("");
  } catch (erro) {
    console.error("Erro ao consultar colorimetria:", erro);
    const tabelaBody = document.querySelector("#resultado tbody");
    if (tabelaBody) tabelaBody.innerHTML = `<tr><td colspan="4">Erro ao carregar colorimetria</td></tr>`;
  }
}

export function desaparecerColorimetria() {
  const tabelaBody = document.querySelector("#resultado tbody");
  if (tabelaBody) tabelaBody.textContent = '';
}

export async function carregarOpcoesColorimetria() {
  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/colorimetria");
    const dados = await resposta.json();
    const registros = Array.isArray(dados) ? dados : dados.Colorimetria || [];

    const datalist = document.getElementById("listaColorimetria");
    const datalistExcluir = document.getElementById("listaColorimetriaExcluir");
    if (datalist) datalist.innerHTML = "";
    if (datalistExcluir) datalistExcluir.innerHTML = "";

    registros.forEach(r => {
      const option = document.createElement("option");
      option.value = r.cod || r.id_color;
      if (datalist) datalist.appendChild(option.cloneNode());
      if (datalistExcluir) datalistExcluir.appendChild(option.cloneNode());
    });
  } catch (erro) {
    console.error("Erro ao carregar opções de colorimetria:", erro);
  }
}

export async function configurarBuscaColorimetria() {
  const input = document.getElementById("busca");
  const tabelaBody = document.querySelector("#resultado tbody");
  if (!input || !tabelaBody) return;

  function renderizarTabela(registros) {
    if (!registros.length) {
      tabelaBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhum resultado encontrado</td></tr>`;
      return;
    }

    tabelaBody.innerHTML = registros.map(r => `
      <tr>
        <td>${r.id_color}</td>
        <td>${r.cod}</td>
        <td>${r.num_cores}</td>
        <td>${r.descricao || ''}</td>
      </tr>
    `).join("");
  }

  // Carrega todos inicialmente
  try {
    const resInicial = await fetch("https://grafica-maxima.onrender.com/api/colorimetria");
    const dados = await resInicial.json();
    const registros = Array.isArray(dados) ? dados : dados.Colorimetria || [];
    renderizarTabela(registros);
  } catch (erro) {
    tabelaBody.innerHTML = `<tr><td colspan="4">Erro ao carregar colorimetria</td></tr>`;
    console.error(erro);
  }

  input.addEventListener("input", async () => {
    const termo = input.value.trim().toLowerCase();

    try {
      const res = await fetch("https://grafica-maxima.onrender.com/api/colorimetria");
      const dados = await res.json();
      const registros = Array.isArray(dados) ? dados : dados.Colorimetria || [];

      if (!termo) {
        renderizarTabela(registros);
        return;
      }

      const filtradas = registros.filter(r => (r.cod || "").toLowerCase().includes(termo) || String(r.id_color).includes(termo));
      renderizarTabela(filtradas);
    } catch (erro) {
      tabelaBody.innerHTML = `<tr><td colspan="4">Erro na busca</td></tr>`;
      console.error(erro);
    }
  });
}
