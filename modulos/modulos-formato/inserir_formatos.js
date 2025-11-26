export async function InserirFormato(event) {
  event.preventDefault();

  const tipo = document.getElementById('tipo').value.trim();
  const nome = document.getElementById('nome').value.trim();
  const cmpr = document.getElementById('comprimento').value.trim();
  const larg = document.getElementById('largura').value.trim();

  if (!tipo || !nome || !cmpr || !larg) {
    alert('Preencha todos os campos obrigatórios: tipo, nome, comprimento e largura.');
    return;
  }

  const payload = { tipo, nome, cmpr, larg };

  try {
    const res = await fetch('http://localhost:3000/api/formatos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.mensagem || 'Erro ao inserir formato');
    }

    const data = await res.json().catch(() => ({}));
    alert(data.mensagem || 'Formato inserido com sucesso');

    document.getElementById('tipo').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('comprimento').value = '';
    document.getElementById('largura').value = '';

    // Atualiza a lista de formatos se a função global existir
    if (window.ConsultarFormatos) await window.ConsultarFormatos();
    if (window.carregarOpcoesFormatos) await window.carregarOpcoesFormatos();

  } catch (erro) {
    console.error('Erro ao inserir formato:', erro);
    alert('Não foi possível inserir o formato: ' + (erro.message || erro));
  }
}
