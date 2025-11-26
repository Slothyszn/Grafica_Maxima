// listar_categoria.js

export async function ConsultarCategorias() {
	try {
		const resposta = await fetch("http://localhost:3000/api/categorias");
		const dados = await resposta.json();
		const categorias = Array.isArray(dados) ? dados : dados.Categoria || [];

		const tabelaBody = document.querySelector("#resultado tbody");
		if (!tabelaBody) return;

		if (!categorias.length) {
			tabelaBody.innerHTML = `<tr><td colspan="2" style="text-align:center;">Nenhuma categoria encontrada</td></tr>`;
			return;
		}

		tabelaBody.innerHTML = categorias.map(c => `
			<tr>
				<td>${c.id_categ}</td>
				<td>${c.nome}</td>
			</tr>
		`).join("");
	} catch (erro) {
		console.error("Erro ao consultar categorias:", erro);
		const tabelaBody = document.querySelector("#resultado tbody");
		if (tabelaBody) tabelaBody.innerHTML = `<tr><td colspan="2">Erro ao carregar categorias</td></tr>`;
	}
}

export function desaparecerCategorias() {
	const tabelaBody = document.querySelector("#resultado tbody");
	if (tabelaBody) tabelaBody.textContent = '';
}

export async function carregarOpcoesCategorias() {
	try {
		const resposta = await fetch("http://localhost:3000/api/categorias");
		const dados = await resposta.json();
		const categorias = Array.isArray(dados) ? dados : dados.Categoria || [];

		const datalist = document.getElementById("listaCategorias");
		const datalistExcluir = document.getElementById("listaCategoriasExcluir");
		if (datalist) datalist.innerHTML = "";
		if (datalistExcluir) datalistExcluir.innerHTML = "";

		categorias.forEach(cat => {
			const option = document.createElement("option");
			option.value = cat.nome;
			if (datalist) datalist.appendChild(option.cloneNode());
			if (datalistExcluir) datalistExcluir.appendChild(option.cloneNode());
		});
	} catch (erro) {
		console.error("Erro ao carregar opções de categorias:", erro);
	}
}

export async function configurarBuscaCategorias() {
	const input = document.getElementById("busca");
	const tabelaBody = document.querySelector("#resultado tbody");
	if (!input || !tabelaBody) return;

	function renderizarTabela(categorias) {
		if (!categorias.length) {
			tabelaBody.innerHTML = `<tr><td colspan="2" style="text-align:center;">Nenhum resultado encontrado</td></tr>`;
			return;
		}

		tabelaBody.innerHTML = categorias.map(c => `
			<tr>
				<td>${c.id_categ}</td>
				<td>${c.nome}</td>
			</tr>
		`).join("");
	}

	// Carrega todos inicialmente
	try {
		const resInicial = await fetch("http://localhost:3000/api/categorias");
		const dados = await resInicial.json();
		const categorias = Array.isArray(dados) ? dados : dados.Categoria || [];
		renderizarTabela(categorias);
	} catch (erro) {
		tabelaBody.innerHTML = `<tr><td colspan="2">Erro ao carregar categorias</td></tr>`;
		console.error(erro);
	}

	input.addEventListener("input", async () => {
		const termo = input.value.trim().toLowerCase();

		try {
			const res = await fetch("http://localhost:3000/api/categorias");
			const dados = await res.json();
			const categorias = Array.isArray(dados) ? dados : dados.Categoria || [];

			if (!termo) {
				renderizarTabela(categorias);
				return;
			}

			const filtradas = categorias.filter(c => (c.nome || "").toLowerCase().includes(termo) || String(c.id_categ).includes(termo));
			renderizarTabela(filtradas);
		} catch (erro) {
			tabelaBody.innerHTML = `<tr><td colspan="2">Erro na busca</td></tr>`;
			console.error(erro);
		}
	});
}

