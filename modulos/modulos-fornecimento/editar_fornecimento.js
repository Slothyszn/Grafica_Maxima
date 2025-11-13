export async function habilitarEdicaoFornecimento() {
  const valorSelecionado = document.getElementById("fornecimentoEditar").value;
  if (!valorSelecionado) return;

  const idSelecionado = valorSelecionado.split(" | ")[0]; // pega só o ID

  try {
    const resposta = await fetch("http://localhost:3000/api/fornecimentos");
    const dados = await resposta.json();

    const fornecimento = dados.Fornecimento.find(f => f.id == idSelecionado);
    if (!fornecimento) return alert("Fornecimento não encontrado!");

    document.getElementById("editar-fornecimento").style.display = "block";

    document.getElementById("btnSalvarAlteracao").onclick = async () => {
      const campo = document.getElementById("campoEditar").value;
      const novoValor = document.getElementById("novoValor").value.trim();
      if (!campo || !novoValor) return alert("Escolha o campo e insira o novo valor!");

      let corpoPut = { campo, novoValor };

      if (campo === "id_fornecedor") {
        const fornecedores = await (await fetch("http://localhost:3000/api/fornecedores")).json();
        const f = fornecedores.Fornecedor.find(f => f.nome === novoValor);
        if (!f) return alert("Fornecedor não encontrado!");
        corpoPut.novoValor = f.id;
      }

      if (campo === "id_material") {
        const materiais = await (await fetch("http://localhost:3000/api/materiais")).json();
        const m = materiais.Material.find(m => m.nome === novoValor);
        if (!m) return alert("Material não encontrado!");
        corpoPut.novoValor = m.id;
      }

      try {
        const respostaPut = await fetch(`http://localhost:3000/api/fornecimentos/${fornecimento.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(corpoPut)
        });

        if (!respostaPut.ok) throw new Error("Falha ao atualizar fornecimento.");
        alert("Fornecimento atualizado com sucesso!");
        document.getElementById("editar-fornecimento").style.display = "none";

      } catch (erro) {
        console.error("Erro ao salvar alterações:", erro);
        alert("Erro ao atualizar fornecimento.");
      }
    };

  } catch (erro) {
    console.error("Erro ao carregar fornecimento:", erro);
    alert("Erro ao carregar dados do fornecimento.");
  }
}
