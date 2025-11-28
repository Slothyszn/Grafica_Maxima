export async function habilitarEdicaoCategoria() {
  const nomeSelecionado = document.getElementById("tipoCategoria").value;
  if (!nomeSelecionado) return;

  try {
    const resposta = await fetch("http://grafica-maxima.onrender.com/api/categorias");
    const dados = await resposta.json();
    const categorias = Array.isArray(dados) ? dados : dados.Categoria || [];

    const categoria = categorias.find(c => c.nome === nomeSelecionado);
    if (!categoria) {
      alert("Categoria não encontrada!");
      return;
    }

    const formEditar = document.getElementById("editar-categoria");
    formEditar.style.display = "block";

    document.getElementById("btnSalvarAlteracao").onclick = async () => {
      const campo = document.getElementById("campoEditar").value;
      const novoValor = document.getElementById("novoValor").value.trim();

      if (!campo || !novoValor) {
        alert("Escolha o campo e insira o novo valor!");
        return;
      }

      const payload = { campo, novoValor };

      try {
        const respostaPut = await fetch(`http://grafica-maxima.onrender.com/api/categorias/${categoria.id_categ}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!respostaPut.ok) {
          const erroData = await respostaPut.json().catch(() => ({}));
          throw new Error(erroData.mensagem || "Falha ao atualizar categoria.");
        }

        alert("Categoria atualizada com sucesso!");
        formEditar.style.display = "none";
      } catch (erro) {
        console.error("Erro ao salvar alterações:", erro);
        alert(`Erro ao atualizar a categoria: ${erro.message}`);
      }
    };

  } catch (erro) {
    console.error("Erro ao carregar categorias:", erro);
    alert("Erro ao carregar dados das categorias.");
  }
}
