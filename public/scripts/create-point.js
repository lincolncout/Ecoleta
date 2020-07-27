// utilizar no console do site

// document.querySelector("form") = procurar um elemento em uma página
// document.querySelectorAll("form") = procurar todos os formularios de uma página
//fetch --> retorna um objeto(promise) --> talvez um dado

// retorna todos os objetos 
/*
fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados").then
    (function(res){
         return res.json() 
    }).then
    (function(data){
        console.log(data)
    })
*/

function populateUFs(){
    const ufSelect = document.querySelector("select[name=uf]")
    /*
        API do ibge: ibge serviços api -> api de localidades -> ufs -> get https
    */
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res => res.json() )
    .then( states => {
        // for (cada estado de etsados)
        for(const state of states){
            /*
                innerHTML -> propriedade de elementos html(para utilizar html)
                tem que colocar crase por usar interpolar
                coloca no html as options com os estados
            */
            ufSelect.innerHTML += `<option value = "${state.id}">${state.nome}</option>`
        }
    })
}

populateUFs()


function getCities(event){
    // posso colocar select[name=city] ou [name=city]
    // do mesmo modo posso colocar input[name=state] ou [name=state]
    const citySelect = document.querySelector("[name=city]")
    const stateInput = document.querySelector("[name=state]")
    // ufValue pega o id da uf 
    const ufValue = event.target.value
    // id do estado selecionado 
    const indexOfSelectedState = event.target.selectedIndex
    // pega o id do estado selecionado e transforma em texto
    stateInput.value = event.target.options[indexOfSelectedState].text
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`
    /*
        a cada vez que seleciona um estado:
            esconde a opção de cidades
            aparece selecione a cidade
    */
    citySelect.innerHTML = "<option value>Selecione a cidade</option>"
    citySelect.disabled = true
    fetch(url)
    .then( res => res.json() )
    .then( cities => {    
        // for (cada estado de estados)
        for(const city of cities){
            citySelect.innerHTML += `<option value = "${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false
    })
}

document
    // query: seleciona um select com name=uf
    .querySelector("select[name=uf]")
    // "ouvidor de eventos" ex: carregar página, clique, mudar...
    // () => {} arrow function
    // não é necessário abrir e fechar parênteses pois a função só sera executada caso selecione a uf
    .addEventListener("change", getCities)

// Itens de coleta
// pegar todos os li's
const itemsToCollect = document.querySelectorAll(".items-grid li")

for(const item of itemsToCollect){
    item.addEventListener("click",handleSelectedItem)
}

const collectedItems = document.querySelector("input[name=items]")
// let pois os valores mudam(sçao sobrescritos)
let selectedItems = []

function handleSelectedItem(event){
    const itemLi = event.target
    // adicionar ou remover uma classe com javascript
    // para quando clicarmos aparecer que foi ou não clicado
    itemLi.classList.toggle("selected")
    // dataset para pegar a informação dentro da variável
    const itemId = event.target.dataset.id
    // console.log(" ITEM ID:", itemId)
    
    
    // verificar se existem itens selecionados, se sim
    // pegar os itens selecionados
    // () => {} arrow function 
    const alreadySelected  = selectedItems.findIndex( item => {
        return item == itemId
    })
    /* 
        -1 nenhum item encontrado
        >= 0 pelo menos um item encontrado(posição do item no array)
    */

    // se já estiver selecionado
    if(alreadySelected >= 0){
        //tirar da seleção 
        const filteredItems = selectedItems.filter( item => {
            const itemIsDifferent = item != itemId
            return itemIsDifferent
        })

        selectedItems = filteredItems

    }else{
        // se não estiver selecionado
        // adicionar à seleção
        selectedItems.push(itemId)
    }

    // console.log("selectedItems:", selectedItems)

    // atualizar o campo escondido com os itens selecionados
    collectedItems.value = selectedItems
}