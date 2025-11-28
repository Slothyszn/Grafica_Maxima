export async function excluirFamilia() {
  const valor = document.getElementById("familiaExcluir").value.trim();
  if (!valor) return alert("Selecione a família que deseja excluir");

  const id_fam = valor.split(" | ")[0]; // pega só o ID

  const confirmacao = confirm(`Tem certeza que deseja excluir a família "${valor}"?`);
  if (!confirmacao) return;

  try {
    const resposta = await fetch(`https://grafica-maxima.onrender.com/api/familias/${id_fam}`, {
      method: "DELETE"
    });

    if (!resposta.ok) {
      const texto = await resposta.text();
      throw new Error(texto);
    }

    const data = await resposta.json();
    alert(data.mensagem || "Família excluída com sucesso");

    // Atualiza a lista de famílias se as funções globais existirem
    if (window.ConsultarFamilias) await window.ConsultarFamilias();
    if (window.carregarOpcoesFamilias) await window.carregarOpcoesFamilias();

  } catch (erro) {
    console.error(erro);
    alert("Ocorreu um erro ao tentar excluir a família.");
  }
}
