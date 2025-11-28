export async function carregarColorimetriaParaExcluir() {
  try {
    const resposta = await fetch("http://localhost:3000/api/colorimetria");
    const dados = await resposta.json();
    const registros = Array.isArray(dados) ? dados : dados.Colorimetria || [];

    const datalist = document.getElementById("listaColorimetriaExcluir");
    if (!datalist) return;
    datalist.innerHTML = "";

    registros.forEach(r => {
      const option = document.createElement("option");
      option.value = r.cod || r.id_color;
      datalist.appendChild(option);
    });
  } catch (erro) {
    console.error("Erro ao carregar colorimetrias para excluir:", erro);
  }
}

export async function excluirColorimetria() {
  const valor = document.getElementById("colorimetriaExcluir").value.trim();
  if (!valor) return alert("Selecione a colorimetria que deseja excluir");

  const confirmacao = confirm(`Tem certeza que deseja excluir a colorimetria "${valor}"?`);
  if (!confirmacao) return;

  try {
    const resposta = await fetch("http://localhost:3000/api/colorimetria");
    const dados = await resposta.json();
    const registros = Array.isArray(dados) ? dados : dados.Colorimetria || [];

    const registro = registros.find(r => r.cod === valor || String(r.id_color) === valor);
    if (!registro) return alert("Colorimetria não encontrada");

    const del = await fetch(`http://localhost:3000/api/colorimetria/${registro.id_color}`, {
      method: "DELETE"
    });

    if (!del.ok) {
      const texto = await del.text().catch(() => "");
      throw new Error(texto || "Erro ao deletar colorimetria");
    }

    const data = await del.json().catch(() => ({}));
    alert(data.mensagem || "Colorimetria excluída com sucesso");
  } catch (erro) {
    console.error(erro);
    alert("Ocorreu um erro ao tentar excluir a colorimetria.");
  }
}
