const c = (el)=>document.querySelector(el);
//cria funcao para simplificar toda vez que for usar o querry selector
const cs = (el)=>document.querySelectorAll(el); 
//funcao pra simplificar
let modalQt = 1;
let cart = []; //array com as informaçoes do carrinho das pizzas
let modalKey = 0; //variavel da pizza selecionada

//LISTAGEM DAS PIZZAS
pizzaJson.map((item, index)=>{
  let pizzaItem = c('.models .pizza-item').cloneNode(true);
  // preencher as informações em pizzaItem

  pizzaItem.setAttribute('data-key', index); 
  //nsere a chave em cada pizza como se fosse id
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$: ${item.price.toFixed(2)}`;
  //usei o to fixed pra fixar dois digitos dos centavos nos valores
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  //troca o src da tag img 

  pizzaItem.querySelector('a').addEventListener('click', (e)=>{
    e.preventDefault();// cancela a funcao usual da tag a de atualizar a pagina
    let key = e.target.closest('.pizza-item').getAttribute('data-key');
    modalQt = 1;
    modalKey = key; //salva a pizza que esta no modal 
    //procura o elemento mais proximo com a class pizza item com a funcao closest e pega o atributo data key.
    c('.pizzaInfo h1').innerHTML = pizzaJson[key].name; 
    //adiciona o nome no model da pizza clicada com o indice do array sendo o key
    c('.pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[key].description; 
    //adiciona a descrição no model da pizza clicada com o indice do array sendo o key
    c('.pizzaBig img').src = pizzaJson[key].img; 
    //adiciona a imagem no model da pizza clicada com o indice do array sendo o key
    c('.pizzaInfo--actualPrice').innerHTML = `${pizzaJson[key].price.toFixed(2)}`;
    //adiciona o preço fixando em duas casas com toFixed
    c('.pizzaInfo--size.selected').classList.remove('selected');
    cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
      if(sizeIndex == 2){
        size.classList.add('selected');
      }
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    c('.pizzaInfo--qt').innerHTML = modalQt;
    //mantem sempre a quantidade inicial em 01 unidade abrindo ou fechando o modal.

    




    c('.pizzaWindowArea').style.opacity = 0;
    c('.pizzaWindowArea').style.display = 'flex'; //troca o display
    setTimeout(()=>{
      c('.pizzaWindowArea').style.opacity = 1;
    },300); // cria a animação do model
    
  })




  c('.pizza-area').append(pizzaItem);
  //vai inserrir na div pizza area os itens de pizzaiterm

});

//EVENTOS DO MODAL

function closeModal(){
  c('.pizzaWindowArea').style.opacity = 0;
  setTimeout(()=>{
    c('.pizzaWindowArea').style.display = 'none';
  },300); //Fecha o modal
}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
  item.addEventListener('click', closeModal);
}); //cria o evento de click nos buttons de fechar e insere a funcao de fechar
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
  if(modalQt > 1){
    modalQt--;
    c('.pizzaInfo--qt').innerHTML = modalQt;
  };//faz o decremento da variavel modal
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
  modalQt++;
  c('.pizzaInfo--qt').innerHTML = modalQt;
});//incrementa a variavel de qtde
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
  size.addEventListener('click', (e)=>{
    c('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
  })//escolher o tamanho e excluir os outros
});
c('.pizzaInfo--addButton').addEventListener('click', ()=>{ 
  //evento de click no button de adicionar no carrinho
  let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key')); 
  //pega o tamanho da pizza atraves do data-key 
  let identifier = pizzaJson[modalKey].id+'@'+size;
   //cria idenficador para filtrar no carrinho e evitar repeticoes 

   let key = cart.findIndex((item)=>item.identifier == identifier);

   if(key > -1) { //verifica se ja tem o mesmo item no carrinho e adiciona na qtde
      cart[key].qt += modalQt;
   } else {
    cart.push({  // adiciona atraves do push dentro de um objeto as informacoes
      identifier,
      id:pizzaJson[modalKey].id,
      size,
      qt:modalQt
    });
  }
  updateCart();//atualiza o carrinho
  closeModal(); //fecha carrinho apos adicionar
});

c('.menu-openner').addEventListener('click', ()=>{
  if(cart.length > 0 ) {
  c('aside').style.left = '0';
  
};
});
c('.menu-closer').addEventListener('click', ()=>{
  c('aside').style.left = '100vw';

});

function updateCart(){ //atualiza o carrinho e mostra ele na tela
  c('.menu-openner span').innerHTML = cart.length; // atualiza carrinho mobile


  if(cart.length > 0) {
    c('aside').classList.add('show');
    c('.cart').innerHTML = ''; //zera a lista de intens antes de inserir
    let subtotal = 0;
    let desconto = 0;
    let total = 0;
    for(let i in cart) { //cria loop para buscar o item conforme a pizza
      let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
      subtotal += pizzaItem.price * cart[i].qt; //calcula subtotal


      let cartItem = c('.models .cart--item').cloneNode(true); //clona o cart


      let pizzaSizeName;
      switch(cart[i].size) { //substitui o numero do tamanho da pizza por P M G
        case 0:
          pizzaSizeName = 'P';
          break;
        case 1:
          pizzaSizeName = 'M';
          break;
        case 2:
          pizzaSizeName = 'G';
          break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;//cria a variavel nome concatenada com tamanho

      cartItem.querySelector('img').src = pizzaItem.img;//insere a imagem
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;//insere o nome
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
        if(cart[i].qt > 1){
          cart[i].qt--; //faz o decremento da variavel cart
        } else {
          cart.splice(i, 1); //exclui o item do carrinho se for menor que 1
        }         
        updateCart();
      });
      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
        cart[i].qt++;
        updateCart();

      });

      c('.cart').append(cartItem);//preenche o cart do carrinho com o clone
    }
    desconto = subtotal * 0.1; //calcula o desconto de 10%
    total = subtotal - desconto; // calcula o total

    c('.subtotal span:last-child').innerHTML = `R$: ${subtotal.toFixed(2)}`;
    c('.desconto span:last-child').innerHTML = `R$: ${desconto.toFixed(2)}`;
    c('.total span:last-child').innerHTML = `R$: ${total.toFixed(2)}`;


  } else {
    c('aside').classList.remove('show');
    c('aside').style.left = '100vw';

  };

};