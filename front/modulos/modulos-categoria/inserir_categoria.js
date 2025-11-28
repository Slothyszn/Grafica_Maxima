export async function InserirCategoria(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();

  if (!nome) {
    alert("Preencha o nome da categoria!");
    return;
  }

  const novaCategoria = { nome };

  try {
    const resposta = await fetch("http://grafica-maxima.onrender.com/api/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaCategoria)
    });

    if (!resposta.ok) {
      const erroData = await resposta.json().catch(() => ({}));
      throw new Error(erroData.mensagem || "Erro ao inserir categoria");
    }

    const data = await resposta.json();
    alert(`Categoria inserida com sucesso! ID: ${data.id_categ}`);

    document.getElementById("nome").value = "";
  } catch (erro) {
    console.error("Erro ao inserir categoria:", erro);
    alert(`Não foi possível inserir a categoria: ${erro.message}`);
  }
}
