export async function excluirFormato() {
  const valor = document.getElementById("formatoExcluir").value.trim();
  if (!valor) return alert("Selecione o formato que deseja excluir");

  const id_form = valor.split(" | ")[0]; // pega só o ID

  const confirmacao = confirm(`Tem certeza que deseja excluir o formato "${valor}"?`);
  if (!confirmacao) return;

  try {
    const resposta = await fetch(`http://localhost:3000/api/formatos/${id_form}`, {
      method: "DELETE"
    });

    if (!resposta.ok) {
      const texto = await resposta.text();
      throw new Error(texto);
    }

    const data = await resposta.json();
    alert(data.mensagem);

  } catch (erro) {
    console.error(erro);
    alert("Ocorreu um erro ao tentar excluir o formato.");
  }
}
