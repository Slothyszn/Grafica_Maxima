export async function habilitarEdicaoFornecedor() {
  const nomeSelecionado = document.getElementById("tipoFornecedor").value;
  if (!nomeSelecionado) return;
  console.log("🟢 Função habilitarEdicaoFornecedor chamada!");

  try {
    const resposta = await fetch("http://localhost:3000/api/fornecedores");
    const dados = await resposta.json();

    console.log("🔍 Resposta do servidor:", dados);

    const fornecedor = dados.Fornecedor.find(m => m.nome === nomeSelecionado); 
    if (!fornecedor) {
      alert("Fornecedor não encontrada!");
      return;
    }

    document.getElementById("editar-fornecedor").style.display = "block";

    document.getElementById("btnSalvarAlteracao").onclick = async () => {
      const campo = document.getElementById("campoEditar").value;
      const novoValor = document.getElementById("novoValor").value.trim();

      if (!campo || !novoValor) {
        alert("Escolha o campo e insira o novo valor!");
        return;
      }

      try {
        const respostaPut = await fetch(`http://localhost:3000/api/fornecedores/${fornecedor.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ campo, novoValor }) // ✅ ajustado
        });

        if (!respostaPut.ok) throw new Error("Falha ao atualizar fornecedor.");

        alert("Fornecedor atualizado com sucesso!");
        document.getElementById("editar-fornecedor").style.display = "none";
      } catch (erro) {
        console.error("Erro ao salvar alterações:", erro);
        alert("Erro ao atualizar a fornecedor.");
      }
    };
  } catch (erro) {
    console.error("Erro ao carregar fornecedor:", erro);
    alert("Erro ao carregar dados da fornecedor.");
  }
}
