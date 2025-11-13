export async function carregarMaterialParaExcluir() {
  const resposta = await fetch("http://localhost:3000/api/materiais");
  const dados = await resposta.json();

  const datalist = document.getElementById("listaMateriaisExcluir");
  datalist.innerHTML = "";
  dados.Material.forEach(p => {
    const option = document.createElement("option");
    option.value = p.nome;
    datalist.appendChild(option);
  });
}

export async function excluirMaterial() {
  const nome = document.getElementById("materialExcluir").value.trim(); // remove espaços
  if (!nome) return alert("Selecione o material que deseja excluir");

  const confirmacao = confirm(`Tem certeza que deseja excluir o material "${nome}"?`);
  if (!confirmacao) return;

  try {
    const resposta = await fetch(`http://localhost:3000/api/materiais/nome/${encodeURIComponent(nome)}`, {
      method: "DELETE"
    });

    if (!resposta.ok) {
      const texto = await resposta.text(); // pega mensagem de erro
      throw new Error(texto);
    }

    const data = await resposta.json();
    alert(data.mensagem);
  } catch (erro) {
    console.error(erro);
    alert("Ocorreu um erro ao tentar excluir o material.");
  }
}

