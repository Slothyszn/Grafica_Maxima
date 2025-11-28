export async function carregarImpressorasParaExcluir() {
  try {
    const resposta = await fetch("https://grafica-maxima.onrender.com/api/impressoras");
    const dados = await resposta.json();
    const impressoras = Array.isArray(dados) ? dados : dados.Impressora || [];

    const datalist = document.getElementById("listaImpressorasExcluir");
    if (!datalist) return;
    datalist.innerHTML = "";

    impressoras.forEach(i => {
      const option = document.createElement("option");
      option.value = i.id_impres;
      option.textContent = i.nome ? `${i.id_impres} - ${i.nome}` : String(i.id_impres);
      datalist.appendChild(option);
    });
  } catch (erro) {
    console.error("Erro ao carregar impressoras para excluir:", erro);
  }
}

export async function excluirImpressora() {
  const valor = document.getElementById("impressoraExcluir").value.trim();
  if (!valor) return alert("Selecione a impressora que deseja excluir");

  const confirmacao = confirm(`Tem certeza que deseja excluir a impressora "${valor}"?`);
  if (!confirmacao) return;

  try {
    const del = await fetch(`https://grafica-maxima.onrender.com/api/impressoras/${valor}`, {
      method: "DELETE"
    });

    if (!del.ok) {
      const texto = await del.text().catch(() => "");
      throw new Error(texto || "Erro ao deletar impressora");
    }

    const data = await del.json().catch(() => ({}));
    alert(data.mensagem || "Impressora excluída com sucesso");
  } catch (erro) {
    console.error(erro);
    alert("Ocorreu um erro ao tentar excluir a impressora.");
  }
}
