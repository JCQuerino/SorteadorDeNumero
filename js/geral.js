var list = [];
var lastWinners = [];
onload = function(){
    if(localStorage.getItem('qtdNumero')){
        if(localStorage.getItem('lastWinner')){
            lastWinners = JSON.parse(localStorage.getItem('lastWinner'));
            inputListLastWinners();
        }
        if(localStorage.getItem('list')){
            list = JSON.parse(localStorage.getItem('list'));
            inputList();
        }
        removeOrAddSameCamps('none');
        newCampsVisibleOrNo('block');
    }
}
let qtdNumberList = document.querySelector('#qtd-number');
let wrapperListNumber = document.querySelector('.wrapper-numbers');
let wrapperLastWinners = document.querySelector('.winners-wrapper');
let btnSend = document.querySelector('#send');
let btnMenu = document.querySelector('.btn-menu');
let btnReset = document.querySelector('#reset');
let btnSorteio = document.querySelector('.sortear');  
let btnLastWinners = document.querySelector('.last-winners');
let modalLastWinner = document.querySelector('.modal-last-winners');
let newCamps = document.querySelector('.wrapper-cad');
let nameCad = document.querySelector('.name');
let numberCad = document.querySelector('.number');
let btnCad = document.querySelector('.cad');
let displayWinner = document.querySelector('.winner');
let displayMenu = document.querySelector('.menu');
var wrapperqtdnumber = document.querySelector('.input-wrapper-qtd-number');

function removeOrAddSameCamps(opcao){
    wrapperqtdnumber.style.display = `${opcao}`;
}
function newCampsVisibleOrNo(opcao){
    newCamps.style.display = `${opcao}`;
}
function reset(){
    closeMenu();
    localStorage.clear();
    wrapperLastWinners.innerHTML = '';
    lastWinners = [];
    wrapperListNumber.innerHTML = '';
    list = [];
    qtdNumberList.value = '';
    removeOrAddSameCamps('block');
    newCampsVisibleOrNo('none');
}
function generateList(e){
    e.preventDefault();
    if(qtdNumberList.value <= 1000){
        if(qtdNumberList.value > 0){
            localStorage.setItem('qtdNumero',JSON.stringify(qtdNumberList.value));
            removeOrAddSameCamps('none');
            newCampsVisibleOrNo('block');
        }else{
            alert('Sua rifa não pode ter 0 números');
            return;
        }
    }else{
        alert('Sua rifa não pode passar dos 1000 números');
        return;
    }
}

function inputList(){
    wrapperListNumber.innerHTML = '';
    list.map((el,index)=>{
        wrapperListNumber.innerHTML += `
            <div class="number-single">
                <i class="fas fa-edit edit-cad" onclick=(editCadList(${index}))></i>
                <i class="fas fa-times del-cad" onclick=(delItemList(${index}))></i>
                <p class='bold'>${el.number}</p>
                <p>${el.nome}</p>
            </div>
        `
    })
}

function cadastroNumberAndName(){
    let codItem = document.querySelector('.codEdit').getAttribute('codEdit');
    let qtdN = parseInt(JSON.parse(localStorage.getItem('qtdNumero')));
    if(btnCad.classList.contains('edit')){
        list[codItem].nome = '';
        list[codItem].number = '';
    }
    if(numberCad.value <= qtdN){
        let index = list.findIndex(val => val.number == numberCad.value);
        if(index < 0) {
            if(numberCad.value.substr(0,1) != 0){
                if(btnCad.classList.contains('edit')){
                    list[codItem].number = numberCad.value;
                    list[codItem].nome = nameCad.value;
                    localStorage.setItem('list',JSON.stringify(list));
                    btnCad.value = 'Cadastrar';
                    btnCad.classList.remove('edit');
                }else{
                    list.push({
                        nome:nameCad.value,
                        number:numberCad.value
                    })
                    localStorage.setItem('list',JSON.stringify(list))
                }
                nameCad.value = '';
                numberCad.value = '';
                inputList();
            }else{
                alert('O Número não pode começar com 0');
                return;
            }
        } else {
            alert('esse número já foi cadastrado');
            return;
        }
    }else{
        alert('Número maior que o solicitado da rifa');
        return;
    }
}

function delItemList(index){
    list.splice(index,1);
    localStorage.setItem('list',JSON.stringify(list));
    inputList();
}

function editCadList(index){
    btnCad.value = 'Alterar';
    nameCad.value = list[index].nome;
    numberCad.value = list[index].number;
    document.querySelector('.codEdit').setAttribute('codEdit',index);
    btnCad.classList.add('edit');
}

function openMenu(){
    closeLastWinners();
    closeShowWinner();
    displayMenu.style.display = 'block';
    let btnCloseMenu = document.querySelector('.menu i');
    btnCloseMenu.addEventListener('click',closeMenu);
}

function closeMenu(){
    displayMenu.style.display = 'none';
}

function sorteio(){
    let qtdNumeroCad = list.length;
    if(qtdNumeroCad){
        let randomNumber = Math.floor(Math.random() * qtdNumeroCad);
        mergeWinners(list[randomNumber].nome,list[randomNumber].number);
        
    }else{
        alert('Nenhum número cadastrado');
    }
}

function closeShowWinner(){
    displayWinner.style.display = 'none';
}

function mergeWinners(nome,numero){
    closeMenu();
    function winner(){
        document.querySelector('.numWinner').innerHTML = numero;
        document.querySelector('.nameWinner').innerHTML = `Parabéns <strong>${nome}</strong>, você ganhou!`;
        displayWinner.style.display = 'block';
        let btnCloseShowWinner = document.querySelector('.winner i');
        btnCloseShowWinner.addEventListener('click',closeShowWinner);
    }
    function pushLastWinner(){
        lastWinners.push({
            nome,
            numero
        })
        localStorage.setItem('lastWinner',JSON.stringify(lastWinners));   
        inputListLastWinners();
    }
    winner();
    pushLastWinner();
}

function inputListLastWinners(){
    if(lastWinners.length > 0){
        wrapperLastWinners.innerHTML = '';
        lastWinners.map((el,index)=>{
            wrapperLastWinners.innerHTML += `
                <div class="winner-single">
                    <p>${index+1}º Número: <strong>${el.numero}</strong> - <strong>${el.nome}</strong></p>
                    <i class="fas fa-trash" onclick=(delItemLastWinners(${index}))></i>
                </div>
            `
        })
    }else{
        closeLastWinners();
    }
}

function showLastWinners(){
    if(lastWinners.length){
        modalLastWinner.style.display = 'block';
        closeMenu();
        document.querySelector('.modal-last-winners i.close-modal-winners').addEventListener('click',closeLastWinners);
    }else{
        alert('Ainda não há ganhadores');
    }
}

function closeLastWinners(){
    modalLastWinner.style.display = 'none';
}

function delItemLastWinners(index){
    lastWinners.splice(index, 1);
    localStorage.setItem('lastWinner',JSON.stringify(lastWinners));
    inputListLastWinners();
}

btnLastWinners.addEventListener('click',showLastWinners);
btnSend.addEventListener('click',generateList);
btnMenu.addEventListener('click',openMenu);
btnReset.addEventListener('click',reset);
btnCad.addEventListener('click',cadastroNumberAndName);
btnSorteio.addEventListener('click',sorteio);

