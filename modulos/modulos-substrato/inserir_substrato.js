export async function InserirSubstrato(event) {
  event.preventDefault();

  const id_fam = document.getElementById("id_familia").value.trim();
  const id_categ = document.getElementById("id_categoria").value.trim();
  const med_sub = document.getElementById("med_sub").value.trim();
  const valor = document.getElementById("valor").value.trim();

  if (!id_fam || !id_categ || !med_sub || !valor) {
    alert("Preencha todos os campos!");
    return;
  }

  const novo = { id_fam, id_categ, med_sub, valor };

  try {
    const resposta = await fetch("http://localhost:3000/api/substratos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novo),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao inserir substrato");
    }

    const data = await resposta.json();
    alert(`Substrato inserido! ID: ${data.id_sub}`);

    document.getElementById("id_familia").value = "";
    document.getElementById("id_categoria").value = "";
    document.getElementById("med_sub").value = "";
    document.getElementById("valor").value = "";

  } catch (erro) {
    console.error(erro);
    alert("Erro ao salvar substrato.");
  }
}
