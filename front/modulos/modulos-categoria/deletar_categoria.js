export async function carregarCategoriasParaExcluir() {
  try {
    const resposta = await fetch("http://localhost:3000/api/categorias");
    const dados = await resposta.json();
    const categorias = Array.isArray(dados) ? dados : dados.Categoria || [];

    const datalist = document.getElementById("listaCategoriasExcluir");
    if (!datalist) return;
    datalist.innerHTML = "";

    categorias.forEach(p => {
      const option = document.createElement("option");
      option.value = p.nome;
      datalist.appendChild(option);
    });
  } catch (erro) {
    console.error("Erro ao carregar categorias para excluir:", erro);
  }
}

export async function excluirCategoria() {
  const nome = document.getElementById("categoriaExcluir").value.trim();
  if (!nome) return alert("Selecione a categoria que deseja excluir");

  const confirmacao = confirm(`Tem certeza que deseja excluir a categoria "${nome}"?`);
  if (!confirmacao) return;

  try {
    const resposta = await fetch("http://localhost:3000/api/categorias");
    const dados = await resposta.json();
    const categorias = Array.isArray(dados) ? dados : dados.Categoria || [];

    const categoria = categorias.find(c => c.nome === nome);
    if (!categoria) return alert("Categoria não encontrada");

    const del = await fetch(`http://localhost:3000/api/categorias/${categoria.id_categ}`, {
      method: "DELETE"
    });

    if (!del.ok) {
      const texto = await del.text().catch(() => "");
      throw new Error(texto || "Erro ao deletar categoria");
    }

    const data = await del.json().catch(() => ({}));
    alert(data.mensagem || "Categoria excluída com sucesso");
  } catch (erro) {
    console.error(erro);
    alert("Ocorreu um erro ao tentar excluir a categoria.");
  }
}
