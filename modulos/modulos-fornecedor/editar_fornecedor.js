export async function habilitarEdicaoFornecedor() {
  const nomeSelecionado = document.getElementById("tipoFornecedor").value;
  if (!nomeSelecionado) return;
  console.log("🟢 Função habilitarEdicaoFornecedor chamada!");

  try {
    // 1️⃣ Buscar todos os fornecedores
    const resposta = await fetch("http://localhost:3000/api/fornecedores");
    const dados = await resposta.json();
    const fornecedores = Array.isArray(dados) ? dados : dados.Fornecedor || [];

    console.log("🔍 Resposta do servidor:", fornecedores);

    // 2️⃣ Encontrar fornecedor pelo nome
    const fornecedor = fornecedores.find(f => f.nome === nomeSelecionado);
    if (!fornecedor) {
      alert("Fornecedor não encontrado!");
      return;
    }

    // 3️⃣ Exibe o formulário de edição
    const formEditar = document.getElementById("editar-fornecedor");
    formEditar.style.display = "block";

    // 4️⃣ Configura o botão de salvar alterações
    document.getElementById("btnSalvarAlteracao").onclick = async () => {
      const campo = document.getElementById("campoEditar").value; // "nome" ou "contato"
      const novoValor = document.getElementById("novoValor").value.trim();

      if (!campo || !novoValor) {
        alert("Escolha o campo e insira o novo valor!");
        return;
      }

      // Monta objeto de atualização com a chave correta
      const dadosAtualizados = { [campo]: novoValor };

      try {
        const respostaPut = await fetch(`http://localhost:3000/api/fornecedores/${fornecedor.id_forn}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosAtualizados)
        });

        if (!respostaPut.ok) {
          const erroData = await respostaPut.json().catch(() => ({}));
          throw new Error(erroData.erro || "Falha ao atualizar fornecedor.");
        }

        alert("Fornecedor atualizado com sucesso!");
        formEditar.style.display = "none";
      } catch (erro) {
        console.error("Erro ao salvar alterações:", erro);
        alert(`Erro ao atualizar o fornecedor: ${erro.message}`);
      }
    };

  } catch (erro) {
    console.error("Erro ao carregar fornecedor:", erro);
    alert("Erro ao carregar dados do fornecedor.");
  }
}
