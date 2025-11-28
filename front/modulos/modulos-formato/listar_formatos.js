// ---------------------------------------------
// LISTAR formatos e expor a função globalmente
// ---------------------------------------------
export async function ConsultarFormatos() {
  try {
    const res = await fetch('https://grafica-maxima.onrender.com/api/formatos');
    if (!res.ok) {
      console.warn('ConsultarFormatos: resposta não OK', res.status);
      const tbodyErr = document.querySelector('#resultado tbody');
      if (tbodyErr) tbodyErr.innerHTML = '<tr><td colspan="5">Erro ao carregar formatos</td></tr>';
      return;
    }

    const dados = await res.json();
    const lista = Array.isArray(dados && dados.Formato) ? dados.Formato : [];

    const tbody = document.querySelector('#resultado tbody');
    if (!tbody) return;

    tbody.innerHTML = lista.map(f => `
      <tr>
        <td>${f.id_fmt}</td>
        <td>${f.tipo || ''}</td>
        <td>${f.nome || ''}</td>
        <td>${f.cmpr || ''}</td>
        <td>${f.larg || ''}</td>
      </tr>
    `).join('');

    // expõe a função globalmente para outros módulos usarem
    window.ConsultarFormatos = ConsultarFormatos;

  } catch (erro) {
    console.error('Erro ao consultar formatos:', erro);
    const tbody = document.querySelector('#resultado tbody');
    if (tbody) tbody.innerHTML = `<tr><td colspan="5">Erro ao carregar formatos</td></tr>`;
  }
}

// ---------------------------------------------
// FAZER INFORMAÇÕES SUMIREM
// ---------------------------------------------
export function desaparecerFormatos() {
  const tbody = document.querySelector('#resultado tbody');
  if (tbody) tbody.innerHTML = '';
}

// ---------------------------------------------
// PREENCHE DATALISTS PARA EDIÇÃO E EXCLUSÃO
// ---------------------------------------------
export async function carregarOpcoesFormatos() {
  try {
    const res = await fetch("https://grafica-maxima.onrender.com/api/formatos");
    if (!res.ok) return;
    const dados = await res.json();
    const lista = Array.isArray(dados && dados.Formato) ? dados.Formato : [];

    const dlEditar = document.getElementById("listaFormatos");
    const dlExcluir = document.getElementById("listaFormatosExcluir");

    if (dlEditar) {
      dlEditar.innerHTML = "";
      lista.forEach(f => {
        const option = document.createElement("option");
        option.value = `${f.id_fmt} | ${f.nome}`;  // << ID junto com o nome
        dlEditar.appendChild(option);
      });
    }

    if (dlExcluir) {
      dlExcluir.innerHTML = "";
      lista.forEach(f => {
        const option = document.createElement("option");
        option.value = `${f.id_fmt} | ${f.nome}`;  // << ID junto com o nome
        dlExcluir.appendChild(option);
      });
    }
  } catch (erro) {
    console.error("Erro ao carregar opções de formatos:", erro);
  }
}
