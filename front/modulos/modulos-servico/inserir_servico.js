export async function InserirServico(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const custo_fixo = document.getElementById('custo_fixo').value.trim();

  if (!nome) {
    alert('Preencha o nome do serviço.');
    return;
  }

  const payload = { nome, custo_fixo };

  try {
    const res = await fetch('https://grafica-maxima.onrender.com/api/servicos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.mensagem || 'Erro ao inserir serviço');
    }

    const data = await res.json().catch(() => ({}));
    alert(data.mensagem || 'Serviço inserido com sucesso');

    document.getElementById('nome').value = '';
    document.getElementById('custo_fixo').value = '';

    // tenta atualizar a lista se a função existir no escopo global
    if (window.ConsultarServicos) await window.ConsultarServicos();
  } catch (erro) {
    console.error('Erro ao inserir serviço:', erro);
    alert('Não foi possível inserir o serviço: ' + (erro.message || erro));
  }
}
