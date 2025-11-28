// ---------------------------------------------
// HABILITAR EDIÇÃO DE DIMENSÃO
// ---------------------------------------------
export async function habilitarEdicaoDimensao() {
  const selecionada = document.getElementById("dimensaoSelecionada").value;
  if (!selecionada) return;

  try {
    // Busca todas as dimensões
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/dimensoes");
    const dados = await resposta.json();
    const lista = Array.isArray(dados.Dimensao) ? dados.Dimensao : [];

    // Encontra a dimensão selecionada
    const dimensao = lista.find(d => String(d.id_dim) === selecionada);
    if (!dimensao) return alert("Dimensão não encontrada");

    const formEditar = document.getElementById("editar-dimensao");
    if (formEditar) formEditar.style.display = "block";

    const campoSelect = document.getElementById("campoEditarDimensao");
    const novoValorInput = document.getElementById("novoValorDimensao");

    // Quando o usuário escolher qual campo editar
    if (campoSelect && novoValorInput) {
      campoSelect.addEventListener('change', () => {
        const campoEscolhido = campoSelect.value;
        novoValorInput.placeholder = `Novo valor para ${campoEscolhido}`;
      });
    }

    // Botão de salvar alteração
    document.getElementById("btnSalvarAlteracaoDimensao").onclick = async () => {
      const campo = campoSelect.value;
      const novoValor = novoValorInput.value.trim();

      if (!campo || !novoValor) return alert("Escolha campo e insira novo valor");

      const payload = { campo, novoValor };

      try {
        const respostaPut = await fetch(`https://grafica-maxima.onrender.com/api/dimensoes/${dimensao.id_dim}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!respostaPut.ok) {
          const erroData = await respostaPut.json().catch(() => ({}));
          throw new Error(erroData.mensagem || "Falha ao atualizar dimensão.");
        }

        alert("Dimensão atualizada com sucesso!");
        if (formEditar) formEditar.style.display = "none";

        // Opcional: atualizar a tabela
        if (window.ConsultarDimensoes) window.ConsultarDimensoes();
      } catch (erro) {
        console.error("Erro ao atualizar dimensão:", erro);
        alert(`Erro: ${erro.message}`);
      }
    };

  } catch (erro) {
    console.error("Erro ao carregar dimensões:", erro);
    alert("Erro ao carregar dimensões.");
  }
}
