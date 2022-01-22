// CONFIGURA A VERSÃO ATUAL DO SISTEMA
function setConfigurarVersao(){
    const nVersao = "Versão 1.2.2.0";
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
    armazenar(despesa){
        let id = this.getProximoId();

        localStorage.setItem(id, JSON.stringify(despesa));

        localStorage.setItem("id", id);
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
        db.armazenar(novaDespesa);
        
        // INSTANCIA O MODAL
        let modal = new bootstrap.Modal(document.getElementById("sucessoNewRegistro"));

        // EXIBE O MODAL
        modal.show();
    }
    else {
        // INSTANCIA O MODAL
        let modal = new bootstrap.Modal(document.getElementById("erroNewRegistro"));

        // EXIBE O MODAL
        modal.show();
    }
        


    
}

// CHAMA ALGUMAS FUNÇÕES
setConfigurarVersao();
setPreencherDia();
setPreencherMes();
setPreencherAno();

