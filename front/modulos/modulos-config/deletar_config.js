export async function carregarConfigsParaExcluir() {
  try {
    const resposta = await fetch("http://localhost:3000/api/configs");
    const dados = await resposta.json();
    const configs = Array.isArray(dados) ? dados : dados.Config || [];

    const datalist = document.getElementById("listaConfigExcluir");
    if (!datalist) return;
    datalist.innerHTML = "";

    configs.forEach(c => {
      const option = document.createElement("option");
      option.value = c.id_config;
      datalist.appendChild(option);
    });
  } catch (erro) {
    console.error("Erro ao carregar configs para excluir:", erro);
  }
}

export async function excluirConfig() {
  const valor = document.getElementById("configExcluir").value.trim();
  if (!valor) return alert("Selecione a config que deseja excluir");

  const confirmacao = confirm(`Tem certeza que deseja excluir a config "${valor}"?`);
  if (!confirmacao) return;

  try {
    const del = await fetch(`http://localhost:3000/api/configs/${valor}`, {
      method: "DELETE"
    });

    if (!del.ok) {
      const texto = await del.text().catch(() => "");
      throw new Error(texto || "Erro ao deletar config");
    }

    const data = await del.json().catch(() => ({}));
    alert(data.mensagem || "Config excluída com sucesso");
  } catch (erro) {
    console.error(erro);
    alert("Ocorreu um erro ao tentar excluir a config.");
  }
}
