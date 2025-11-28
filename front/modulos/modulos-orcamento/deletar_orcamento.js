export async function excluirOrcamento() {
  const input = document.getElementById("orcExcluir").value.trim();
  if (!input) return alert("Escolha um orçamento para excluir");

  // pega só a primeira parte antes do " | "
  const id = input.split(" | ")[0];

  const confirmacao = confirm(`Tem certeza que deseja excluir o orçamento "${input}"?`);
  if (!confirmacao) return;

  try {
    const resposta = await fetch(`https://grafica-maxima.onrender.com/api/orcamentos/${id}`, {
      method: "DELETE",
    });

    if (!resposta.ok) {
      const erroData = await resposta.json().catch(() => ({}));
      throw new Error(erroData.mensagem || "Erro ao excluir orçamento");
    }

    alert("Orçamento excluído com sucesso!");
    // atualizar datalist ou tabela se precisar
  } catch (erro) {
    console.error("Erro ao excluir orçamento:", erro);
    alert(`Erro: ${erro.message}`);
  }
}
