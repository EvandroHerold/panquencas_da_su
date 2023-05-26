// variavel para saber qual panqueca estarei alterando
let modalKey = 0

//variavel para controlar a quantidade de panquecas no modal
let quantPanquecas = 1

//carrinho
let cart = []


// funções auxiliares 
const selector = (element) => document.querySelector(element)
const selectorAll = (element) => document.querySelectorAll(element)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
}

const formatoMonetario = (valor) => {
    if(valor){
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    selector('.panquecaWindowArea').style.opacity = 0
    selector('.panquecaWindowArea').style.display = 'flex'
    setTimeout(() => {
        selector('.panquecaWindowArea').style.opacity = 1
    }, 100)
}

const fecharModal = () => {
    selector('.panquecaWindowArea').style.opacity = 0
    setTimeout(() => {
        selector('.panquecaWindowArea').style.display = 'none'
    }, 500)
}

const botoesFechar = () => {
    selectorAll('.panquecaInfo--cancelButton, .panquecaInfo--cancelMobileButton').forEach((item) => {
        item.addEventListener('click', fecharModal)
    })
}

const preencherDadosPanqueca = (panquecaItem, item, index) => {
    panquecaItem.setAttribute('data-key', index)
    panquecaItem.querySelector('.panqueca-item--img img').src = item.img
    panquecaItem.querySelector('.panqueca-item--price').innerHTML = formatoReal(item.price[1])
    panquecaItem.querySelector('.panqueca-item--name').innerHTML = item.name
    panquecaItem.querySelector('.panqueca-item--desc').innerHTML = item.description
}

const preencherDadosModal = (item) => {
    selector('.panquecaBig img').src = item.img
    selector('.panquecaInfo h1').innerHTML = item.name
    selector('.panquecaInfo--desc').innerHTML = item.description
    selector('.panquecaInfo--actualPrice').innerHTML = formatoReal(item.price[1])
}

const pegarKey = (event) => {
    //.closest retorna o elemento mais proximo com a classe passada
    let key = event.target.closest('.panqueca-item').getAttribute('data-key')

    console.log('Panqueca' + key)
    console.log(panquecasJson[key])

    //garantir que a quantidade inicial seja sempre 1
    quantPanquecas = 1

    //manter informação de qual panqueca foi clicada
    modalKey = key

    return key
}

const preencherTamanhos = (key) => {
    //manter o tamanho medio sempre como selecionado tirando a seleção anterior
    //selector('.panquecaInfo--size.selected').classList.remove('selected')

    //selecionar todos os tamanhos
    selectorAll('.panquecaInfo--size').forEach((size, sizeIndex) => {
        //seleciona o tamanho medio
        (sizeIndex == 1) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = formatoReal(panquecasJson[key].sizes[sizeIndex])
    })
}

const escolherTamanho = (key) => {
    //Selecionar o tamanho 
    selectorAll('.panquecaInfo--size').forEach((size, sizeIndex) =>{
        size.addEventListener('click', (event) => {
            //marcar o tamanho selecionado
            selector('.panquecaInfo--size.selected').classList.remove('selected')

            size.classList.add('selected')

            //mudar o preço de acordo com o tamanho
            selector('.pizzaInfo--actualPrice').innerHTML = formatoReal(panquecasJson[key].price[sizeIndex])
        })
    })
}

const escolherTamanhoPreco = (key) => {
    //ações botões de tamanho
    //selecionar todos os tamanhos
    selectorAll('.panquecaInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (event) => {
            //clicou em um item tirar a seleçãoi dos outros e marca o que vc clicou
            //tirar a seleção de tamanho atual e seleciionar o tamanho m 
            selector('.panquecaInfo--size.selected').classList.remove('selected')
            //marcar o clicado
            size.classList.add('selected')
            //mudar o preço conforme o tamanho selecionado
            selector('.panquecaInfo--actualPrice').innerHTML = formatoReal(panquecasJson[key].price[sizeIndex])
        })
    })
}

const mudarQtd = () => {
    //Ações dos botoões de mais e menos 
    selector('.panquecaInfo--qtmais').addEventListener('click', ()=>{
        quantPanquecas++
        selector('.panquecaInfo--qt').innerHTML = quantPanquecas
    })

    selector('.panquecaInfo--qtmenos').addEventListener('click', ()=>{
        if(quantPanquecas > 1){
            quantPanquecas--
            selector('.panquecaInfo--qt').innerHTML = quantPanquecas
        }
    })
}

const adicionarNoCarrinho = () => {
    selector('.panquecaInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')
        //pegar dados da panqueca selecionada no modal
        console.log('panqueca' + modalKey)
        //tamanho
        let size = selector('.panquecaInfo--size.selected').getAttribute('data-key')
        console.log('Tamanho' + size)
        console.log('Quantidade' + quantPanquecas)
        //preço
        let price = selector('.panquecaInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')

        //criar identificador que junto o id e o tamanho 
        let identificador = panquecasJson[modalKey].id + 't' + size

        //adicionar a quantidade
        let key = cart.findIndex((item) => item.identificador == identificador)
        console.log(key)

        if(key > -1){
            cart[key].qt += quantPanquecas
        } else {
            //objeto panqueca
            let panqueca = {
                identificador,
                id: panquecasJson[modalKey].id,
                size,
                qt: quantPanquecas,
                price: parseFloat(price)
            }

            cart.push(panqueca)
            console.log(panqueca)
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    if(cart.length > 0){
        selector('aside').classList.add('show')
        selector('header').style.display = 'flex'
    }

    selector('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0){
            selector('aside').classList.add('show')
            selector('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    selector('.menu-closer').addEventListener('click', () => {
        selector('aside').style.left = '100vw'
        selector('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    //exibir o numero de itens no carrinho 
    selector('.menu-openner span').innerHTML = cart.length

    //mostrar ou nao o carrinho
    if(cart.length > 0){
        selector('aside').classList.add('show')

        //zerar o cart para nao fazer inserções duplicadas
        selector('.cart').innerHTML = ''

        let subtotal = 0
        let desconto = 0
        let total = 0

        for(let i in cart){
            //find para pegar o item por id
            let panquecaItem = panquecasJson.find((item) => item.id == cart[i].id)
            
            //em cada item pegar o subtotal
            subtotal += cart[i].price * cart[i].qt

            //fazer clone exibir na tela e depois preencher as informações
            let cartItem = selector('.models .cart--item').cloneNode(true)
            selector('.cart').append(cartItem)

            let panquecaSizeName = cart[i].size
            let panquecaName = `${panquecaItem.name} (${panquecaSizeName})`

            //preencher dados 
            cartItem.querySelector('img').src = panquecaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = panquecaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

            //selecionar botoes + e -
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++
                atualizarCarrinho()
            })

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1){
                    cart[i].qt--
                } else{
                    cart.splice(i, 1)
                }
                
                (cart.length < 1) ? selector('header').style.display = 'flex' : ''

                atualizarCarrinho()
            })

            selector('.cart').append(cartItem)
        }

        //calcular desconto e total
        desconto = subtotal * 0
        total = subtotal - desconto

        //exibir os resultados 
        console.log('Preços ' + total + subtotal + desconto)
        selector('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
        selector('.desconto span:last-child').innerHTML = formatoReal(desconto)
        selector('.total span:last-child').innerHTML = formatoReal(total)
    } else{
        //ocultar o carrinho caso seja zerado 
        selector('aside').classList.remove('show')
        selector('aside').style.left = '100vw'
    }
}

panquecasJson.map((item, index ) => {
    //console.log(item)
    let panquecaItem = selector('.models .panqueca-item').cloneNode(true)
    console.log(panquecaItem)
    selector('.panqueca-area').append(panquecaItem)

    // preencher os dados de cada panqueca
    preencherDadosPanqueca(panquecaItem, item, index)

    // quando for clicado
    panquecaItem.querySelector('.panqueca-item a').addEventListener('click', (event)=>{
        event.preventDefault()
        let chave = pegarKey(event)

        //abrir janela modal
        abrirModal()

        //preenchimento dos dados 
        preencherDadosModal(item)

        //pegar tamanho selecionado
        preencherTamanhos(chave)

        //definir quantidade inicial como 1
        selector('.panquecaInfo--qt').innerHTML = quantPanquecas

        //preenecher o preço conforme o tamanho selecionado 
        escolherTamanhoPreco(chave)


    })

    //fechar janela modal
    botoesFechar()
})

mudarQtd()

adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
