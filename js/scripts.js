// CONFIGURA A VERSÃO ATUAL DO SISTEMA
function setConfigurarVersao(){
    const nVersao = "Versão 1.3.1.0";
    document.getElementById("version").textContent = nVersao ;
}

// CONFIGURA QUAL A PAGINA QUE O CLIENTE DESEJA IR
function setIrPara (pagina){
    switch(pagina.toString()){
        case "nova-despesa":
            document.location.href = "nova-despesa.html";
            break;
        case "ver-financas":
            document.location.href = "ver-financas.html"
            break;
        default:
            break;
    }
}

// PREENCHE OS SELECTS DINAMICAMENTE
function setPreencherDia (){
    for(let i=1; i<32; i++) {
        let campo = document.getElementById("dia");

        let opc = document.createElement("option");
        opc.textContent = i;
        opc.value = i;
        
        campo.appendChild(opc);
    }
}
function setPreencherMes (){
    for(let i=1; i<13; i++) {
        let campo = document.getElementById("mes");

        let opc = document.createElement("option");
        opc.textContent = i;
        opc.value = i;
        
        campo.appendChild(opc);
    }
}
function setPreencherAno (){
    let data = new Date();
    for(let i=2015; i< data.getFullYear()+1; i++) {
        let campo = document.getElementById("ano");

        let opc = document.createElement("option");
        opc.textContent = i;
        opc.value = i;
        
        campo.appendChild(opc);
    }
}

// CLASE QUE RECEBE OS DADOS DAS DESPESAS
class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    // VALIDA DE TODOS OS CAMPOS ESTÃO CORRETOS
    setValidarAbas() {
        for(let i in this){
            if((this[i] === "") || (this[i] === undefined) || (this[i] === null) ){
                return false;
            }
        }
        return true;
    }
}

class DataBase{
    constructor(){
        let id = localStorage.getItem("id");

        if(id === null )
            localStorage.setItem("id", 0);
    }

    // INCREMENTA O ID
    getProximoId(){
        let id = localStorage.getItem("id");
        return parseInt(id) + 1;
    }

    // ARMAZENA A NOVA DESPESA NO LOCAL STORAGE DO NAVEGADOR
    setArmazenar(despesa){
        let id = this.getProximoId();

        localStorage.setItem(id, JSON.stringify(despesa));

        localStorage.setItem("id", id);
    }

    // PEGA OS DADOS DE CADA DESPESA ARMAZENADA NO LOCAL STORAGE
    getPegarDados(){
        let allDespesas = Array();
        for(let i = 1; i < parseInt(localStorage.getItem("id"))+1; i++ ) {
            let despesa = JSON.parse(localStorage.getItem(i));

            if(despesa === null)
                continue;

            allDespesas.push(despesa);
        }
        return allDespesas;
    }

    getPesquisarDadosByFiltro(filtro){
        let allDespesas = Array();
        allDespesas = this.getPegarDados();
        
        // FILTRA O DIA
        if(filtro.dia != "") {
            allDespesas = allDespesas.filter(d => d.dia == document.getElementById("dia").value);
        }

        // FILTRA O MÊS
        if(filtro.mes != "") {
            allDespesas = allDespesas.filter(d => d.mes == document.getElementById("mes").value);
        }

        // FILTRA O ANO
        if(filtro.ano != "") {
            allDespesas = allDespesas.filter(d => d.ano == document.getElementById("ano").value);
        }

        // FILTRA O TIPO
        if(filtro.tipo != "") {
            allDespesas = allDespesas.filter(d => d.tipo == document.getElementById("tipo").value);
        }

        // FILTRA O DESCRIÇÃO
        if(filtro.descricao != "") {
            allDespesas = allDespesas.filter(d => d.descricao == document.getElementById("cmp-descricao").value);
        }

        // FILTRA O VALOR
        if(filtro.valor != "") {
            allDespesas = allDespesas.filter(d => d.valor == document.getElementById("cmp-valor").value);
        }

        return allDespesas;
    }
    setPreencherGridPorFiltro(filtro){
        // RECEBE O ARRAY DE TODOS AS DESPESAS
        let despesasFiltradas = db.getPesquisarDadosByFiltro(filtro);
        
        // REMOVE AS LINHAS ANTIGAS NA TABELA
        document.getElementById("lista-despesas").innerHTML = "";
        
        let lista = document.getElementById("lista-despesas");

        /* --- ADICIONA OS VALORES FILTRADOS NA TEBELA --- */
        // PARA CADA POSIÇÃO DO ARRAY...
        despesasFiltradas.forEach(function(desp) {
            // CRIA UMA COLUNA
            let linha = lista.insertRow();

            // ADICIONA AS LINHAS DOS CONTEÚDO
            linha.insertCell(0).append(`${desp.dia}/${desp.mes}/${desp.ano}`);
            linha.insertCell(1).append(`${desp.tipo}`);
            linha.insertCell(2).append(`${desp.descricao}`);
            linha.insertCell(3).append(`${desp.valor}`);
        });
    }
}

let db = new DataBase();

// PREENCHE A CLASSE COM OS VALORES AO SER CHAMADO PELO BOTÃO
function setCadastrarDespesas(){
    let ano = document.getElementById("ano");
    let mes = document.getElementById("mes");
    let dia = document.getElementById("dia");
    let tipo = document.getElementById("tipo");

    let descricao = document.getElementById("cmp-descricao");
    let valor = document.getElementById("cmp-valor");

    let novaDespesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value);
    
    if(novaDespesa.setValidarAbas()){
        db.setArmazenar(novaDespesa);

        // INSERE O TEXTO DENTRO DO MODAL DINAMICAMENTE
        let titulo = document.getElementById("staticBackdropLabel");
        titulo.textContent = "";
        let descricaoModal = document.getElementById("texto-modal");
        let botaoFechar = document.getElementById("btn-modal");

        let newTitulo = document.createElement("h5");
        newTitulo.className = "modal-title d-flex align-items-center text-success";

        let icone = document.createElement("i");
        icone.className = "fs-4 bi bi-check-circle me-2 text-success";

        newTitulo.textContent = "Cadastro efetuado com sucesso";

        titulo.appendChild(icone);
        titulo.appendChild(newTitulo);
        
        document.getElementById("btn-fechar").className = "btn btn-success";
 
        descricaoModal.textContent = "Os dados do registro foram salvos e efetuados com sucesso";

        // INSTANCIA O MODAL
        let modal = new bootstrap.Modal(document.getElementById("modalRegistro"));

        // EXIBE O MODAL
        modal.show();

        // LIMPA OS CAMPOS
        document.getElementById("cmp-descricao").value = "";
        document.getElementById("cmp-valor").value = "";
        document.getElementById("tipo").selectedIndex = 0;
        document.getElementById("dia").selectedIndex = 0;
        document.getElementById("mes").selectedIndex = 0;
        document.getElementById("ano").selectedIndex = 0;
    }
    else {
        // INSERE O TEXTO DENTRO DO MODAL DINAMICAMENTE
        let titulo = document.getElementById("staticBackdropLabel");
        titulo.textContent = "";
        let descricaoModal = document.getElementById("texto-modal");
        let botaoFechar = document.getElementById("btn-modal");

        let newTitulo = document.createElement("h5");
        newTitulo.className = "modal-title d-flex align-items-center text-danger";

        let icone = document.createElement("i");
        icone.className = "fs-4 bi bi-exclamation-square me-2 text-danger";

        newTitulo.textContent = "Impossível efetuar um novo registro";

        titulo.appendChild(icone);
        titulo.appendChild(newTitulo);
        
        document.getElementById("btn-fechar").className = "btn btn-danger";
 
        descricaoModal.textContent = "Ops... algum campo ficou vazio! preencha as lacunas vazias e tente novamente.";

        // INSTANCIA O MODAL
        let modal = new bootstrap.Modal(document.getElementById("modalRegistro"));

        // EXIBE O MODAL
        modal.show();
    } 
}

// PREENCHE A TABELA DE DESPESAS
function setPreencherGrid (){   

    // RECEBE O ARRAY DE TODOS AS DESPESAS
    let despesas = db.getPegarDados();

    let lista = document.getElementById("lista-despesas");
    lista.innerHTML = "";

    // PARA CADA POSIÇÃO DO ARRAY...
    despesas.forEach(function(desp) {
        // CRIA UMA COLUNA
        let linha = lista.insertRow();

        // ADICIONA AS LINHAS DOS CONTEÚDO
        linha.insertCell(0).append(`${desp.dia}/${desp.mes}/${desp.ano}`);
        linha.insertCell(1).append(`${desp.tipo}`);
        linha.insertCell(2).append(`${desp.descricao}`);
        linha.insertCell(3).append(`${desp.valor}`);
    });
}

// FILTRA A TABELA DE DESPESAS DE ACORDO COM AS OPÇÕES
function setFiltrarDespesa (){
    let ano = document.getElementById("ano").value;
    let mes = document.getElementById("mes").value;
    let dia = document.getElementById("dia").value;
    let tipo = document.getElementById("tipo").value;
    let descricao = document.getElementById("cmp-descricao").value;
    let valor = document.getElementById("cmp-valor").value;


    let filtroDespesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    // PREENCHE A TEBELA AO RECEBER ALGUMA FILTRO
    db.setPreencherGridPorFiltro(filtroDespesa);
}

// CHAMA ALGUMAS FUNÇÕES
setConfigurarVersao();
setPreencherDia();
setPreencherMes();
setPreencherAno();
setFiltrarDespesa();
