import { ConsultarPapeis } from '../modulos/listar_papeis.js';
import { desaparecer } from '../modulos/listar_papeis.js';

document.getElementById("btn-consulta").addEventListener("click", ConsultarPapeis);
document.getElementById("btn-desapareca").addEventListener("click", desaparecer);