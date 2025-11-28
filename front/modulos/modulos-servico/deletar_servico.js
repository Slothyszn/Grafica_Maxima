export async function carregarServicosParaExcluir() {
  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/servicos");
    if (!resposta.ok) {
      console.warn('carregarServicosParaExcluir: resposta não OK', resposta.status);
      return;
    }
    const dados = await resposta.json();

    const datalist = document.getElementById("listaServicosExcluir");
    if (!datalist) return;
    datalist.innerHTML = "";

    const lista = Array.isArray(dados && dados.Servico) ? dados.Servico : [];
    lista.forEach(p => {
      const option = document.createElement("option");
      option.value = p.nome;
      datalist.appendChild(option);
    });
  } catch (erro) {
    console.error('Erro ao carregar servicos para excluir:', erro);
  }
}

export async function excluirServico() {
  const nome = document.getElementById("servicoExcluir").value;
  if (!nome) return alert("Selecione o servico que deseja excluir");

  const confirmacao = confirm(`Tem certeza que deseja excluir o servico "${nome}"?`);
  if (!confirmacao) return;

  try {
    const resposta = await fetch(`https://grafica-maxima.onrender.com/api/servicos/nome/${encodeURIComponent(nome)}`, {
      method: "DELETE"
    });

    if (!resposta.ok) {
      const err = await resposta.json().catch(() => ({}));
      throw new Error(err.mensagem || 'Erro ao excluir');
    }

    const data = await resposta.json();
    alert(data.mensagem || 'Serviço excluído');
    carregarServicosParaExcluir(); // atualiza lista
    if (window.ConsultarServicos) window.ConsultarServicos();
  } catch (erro) {
    console.error('Erro ao excluir serviço:', erro);
    alert('Erro ao excluir serviço: ' + (erro.message || erro));
  }
}
