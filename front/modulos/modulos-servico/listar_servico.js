// ===============================
// LISTAR SERVIÇOS
// ===============================

export async function ConsultarServicos() {
  try {
    const res = await fetch('https://grafica-maxima.onrender.com/api/servicos');
    if (!res.ok) {
      console.warn('ConsultarServicos: resposta não OK', res.status);
      const tbodyErr = document.querySelector('#resultado tbody');
      if (tbodyErr) tbodyErr.innerHTML = '<tr><td colspan="3">Erro ao carregar serviços</td></tr>';
      return;
    }

    const dados = await res.json();
    const lista = Array.isArray(dados && dados.Servico) ? dados.Servico : [];

    const tbody = document.querySelector('#resultado tbody');
    if (!tbody) return;

    tbody.innerHTML = lista.map(s => `
      <tr>
        <td>${s.id_serv}</td>
        <td>${s.nome || ''}</td>
        <td>${s.custo_fixo || ''}</td>
      </tr>
    `).join('');

    // expõe globalmente
    window.ConsultarServicos = ConsultarServicos;

  } catch (erro) {
    console.error('Erro ao consultar serviços:', erro);
    const tbody = document.querySelector('#resultado tbody');
    if (tbody) tbody.innerHTML = `<tr><td colspan="3">Erro ao carregar serviços</td></tr>`;
  }
}

// ===============================
// LIMPAR TABELA
// ===============================
export function desaparecerServicos() {
  const tbody = document.querySelector('#resultado tbody');
  if (tbody) tbody.innerHTML = '';
}

// ===============================
// CARREGAR DATALISTS (editar/excluir)
// ===============================
export async function carregarOpcoesServicos() {
  try {
    const res = await fetch('https://grafica-maxima.onrender.com/api/servicos');
    if (!res.ok) return;

    const dados = await res.json();
    const lista = Array.isArray(dados && dados.Servico) ? dados.Servico : [];

    const dlEditar = document.getElementById('listaServicos');
    const dlExcluir = document.getElementById('listaServicosExcluir');

    if (dlEditar) {
      dlEditar.innerHTML = '';
      lista.forEach(s => {
        const option = document.createElement('option');
        option.value = `${s.id_serv} | ${s.nome}`;
        dlEditar.appendChild(option);
      });
    }

    if (dlExcluir) {
      dlExcluir.innerHTML = '';
      lista.forEach(s => {
        const option = document.createElement('option');
        option.value = `${s.id_serv} | ${s.nome}`;
        dlExcluir.appendChild(option);
      });
    }

  } catch (erro) {
    console.error('Erro ao carregar opções de serviços:', erro);
  }
}
