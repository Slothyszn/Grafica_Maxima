// ---------------------------------------------
// EDITAR – Atualizar orçamento
// ---------------------------------------------
export async function habilitarEdicaoOrcamento() {
  const selecionado = document.getElementById("orcEditar").value.split(" | ")[0];
  if (!selecionado) return;

  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/orcamentos");
    const dados = await resposta.json();
    const lista = Array.isArray(dados.Orcamento) ? dados.Orcamento : [];

    const orc = lista.find(o => String(o.id_orc) === selecionado);
    if (!orc) return alert("Orçamento não encontrado");

    const formEditar = document.getElementById("editar-orcamento");
    if (formEditar) formEditar.style.display = "block";

    document.getElementById("btnSalvarAlteracaoOrc").onclick = async () => {
      const campo = document.getElementById("campoEditarOrc").value;
      const novoValor = document.getElementById("novoValorOrc").value.trim();
      if (!campo || !novoValor) return alert("Escolha campo e insira novo valor");

      const payload = { [campo]: novoValor };

      try {
        const respostaPut = await fetch(`https://grafica-maxima.onrender.com/api/orcamentos/${orc.id_orc}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!respostaPut.ok) {
          const erroData = await respostaPut.json().catch(() => ({}));
          throw new Error(erroData.mensagem || "Falha ao atualizar orçamento.");
        }

        alert("Orçamento atualizado com sucesso!");
        formEditar.style.display = "none";
      } catch (erro) {
        console.error("Erro ao atualizar orçamento:", erro);
        alert(`Erro: ${erro.message}`);
      }
    };

  } catch (erro) {
    console.error("Erro ao carregar orçamentos:", erro);
    alert("Erro ao carregar orçamentos.");
  }
}
