import { ConsultarPapeis } from '../modulos/listar_papeis.js';
import { desaparecer } from '../modulos/listar_papeis.js';
import { InserirPapel } from '../modulos/inserir_papel.js'
import { carregarOpcoesPapeis } from '../modulos/listar_papeis.js';
import { habilitarEdicao } from '../modulos/editar_papel.js'
import { carregarPapeisParaExcluir, excluirPapel} from '../modulos/deletar_papel.js'


document.getElementById("btn-consulta").addEventListener("click", ConsultarPapeis);
document.getElementById("btn-desapareca").addEventListener("click", desaparecer);

document.getElementById("form-papel").addEventListener("submit", InserirPapel);

window.addEventListener("DOMContentLoaded", carregarOpcoesPapeis);

document.getElementById("tipoPapel").addEventListener("change", habilitarEdicao);

document.getElementById("btnExcluir").addEventListener("click", excluirPapel);
window.onload = carregarPapeisParaExcluir;
