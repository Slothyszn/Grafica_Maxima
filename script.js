/* FUNÇÂO DE CRIAR NOVO ORCAMENTO */
function novoOrcamento() {
    const div = document.createElement("div");
    div.classList.add("orcamento")
    document.getElementById("lista-orcamentos").appendChild(div);
}