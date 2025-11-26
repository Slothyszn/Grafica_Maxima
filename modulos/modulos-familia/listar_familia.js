// ---------------------------------------------
// LISTAR famílias e expor a função globalmente
// ---------------------------------------------
export async function ConsultarFamilias() {
  try {
    const res = await fetch('http://localhost:3000/api/familias');


    if (!res.ok) {
      console.warn('ConsultarFamilias: resposta não OK', res.status);
      const tbodyErr = document.querySelector('#resultado tbody');
      if (tbodyErr) tbodyErr.innerHTML = '<tr><td colspan="3">Erro ao carregar famílias</td></tr>';
      return;
    }

    const dados = await res.json();
    const lista = Array.isArray(dados && dados.Familia) ? dados.Familia : [];

    console.log('Dados recebidos do backend:', dados);

    const tbody = document.querySelector('#resultado tbody');
    if (!tbody) return;

    tbody.innerHTML = lista.map(f => `
      <tr>
        <td>${f.id_fam}</td>
        <td>${f.tipo || ''}</td>
        <td>${f.nome || ''}</td>
      </tr>
    `).join('');

    // expõe a função globalmente para outros módulos usarem
    window.ConsultarFamilias = ConsultarFamilias;

  } catch (erro) {
    console.error('Erro ao consultar famílias:', erro);
    const tbody = document.querySelector('#resultado tbody');
    if (tbody) tbody.innerHTML = `<tr><td colspan="3">Erro ao carregar famílias</td></tr>`;
  }
}

// ---------------------------------------------
// FAZER INFORMAÇÕES SUMIREM
// ---------------------------------------------
export function desaparecerFamilias() {
  const tbody = document.querySelector('#resultado tbody');
  if (tbody) tbody.innerHTML = '';
}

// ---------------------------------------------
// PREENCHE DATALISTS PARA EDIÇÃO E EXCLUSÃO
// ---------------------------------------------
export async function carregarOpcoesFamilias() {
  try {
    const res = await fetch("http://localhost:3000/api/familias");
    if (!res.ok) return;
    const dados = await res.json();
    const lista = Array.isArray(dados && dados.Familia) ? dados.Familia : [];

    const dlEditar = document.getElementById("listaFamilias");
    const dlExcluir = document.getElementById("listaFamiliasExcluir");

    if (dlEditar) {
      dlEditar.innerHTML = "";
      lista.forEach(f => {
        const option = document.createElement("option");
        option.value = `${f.id_fam} | ${f.tipo} | ${f.nome}`;
        dlEditar.appendChild(option);
      });
    }

    if (dlExcluir) {
      dlExcluir.innerHTML = "";
      lista.forEach(f => {
        const option = document.createElement("option");
        option.value = `${f.id_fam} | ${f.tipo} | ${f.nome}`;
        dlExcluir.appendChild(option);
      });
    }
  } catch (erro) {
    console.error("Erro ao carregar opções de famílias:", erro);
  }
}
