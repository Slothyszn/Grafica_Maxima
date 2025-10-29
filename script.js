/* FUNÇÂO DE CRIAR NOVO ORCAMENTO */
function novoOrcamento() {
    const div = document.createElement("div");
    div.classList.add("orcamento")
    document.getElementById("lista-orcamentos").appendChild(div);
}

/*Função promtp de "Orçamento criado"*/
function orcamentoCriado() {
    swal({
    title: "Orçamento Criado com sucesso",
    icon: "success",
});
}

function erro() {
    swal({
    icon: "error",
    title: "Oops...",
    text: "Algo deu errado."
});
}