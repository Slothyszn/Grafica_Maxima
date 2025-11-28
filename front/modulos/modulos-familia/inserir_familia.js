export async function InserirFamilia(event) {
  event.preventDefault();

  const tipo = document.getElementById('tipo').value.trim();
  const nome = document.getElementById('nome').value.trim();

  if (!tipo || !nome) {
    alert('Preencha todos os campos obrigatórios: tipo e nome.');
    return;
  }

  const payload = { tipo, nome };

  try {
    const res = await fetch('http://localhost:3000/api/familias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.mensagem || 'Erro ao inserir família');
    }

    const data = await res.json().catch(() => ({}));
    alert(data.mensagem || 'Família inserida com sucesso');

    // Limpa os campos do formulário
    document.getElementById('tipo').value = '';
    document.getElementById('nome').value = '';

    // Atualiza a lista de famílias se as funções globais existirem
    if (window.ConsultarFamilias) await window.ConsultarFamilias();
    if (window.carregarOpcoesFamilias) await window.carregarOpcoesFamilias();

  } catch (erro) {
    console.error('Erro ao inserir família:', erro);
    alert('Não foi possível inserir a família: ' + (erro.message || erro));
  }
}
