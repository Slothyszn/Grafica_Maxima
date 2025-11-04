import { ConsultarPapeis } from '../modulos/listar_papeis.js';
import { desaparecer } from '../modulos/listar_papeis.js';
import { InserirPapel } from '../modulos/inserir_papel.js'

document.getElementById("btn-consulta").addEventListener("click", ConsultarPapeis);
document.getElementById("btn-desapareca").addEventListener("click", desaparecer);

document.getElementById("form-papel").addEventListener("submit", InserirPapel);