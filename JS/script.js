// VARIAVEIS DECLARADAS
let modalQtd = 1;
let cart = [];
let modalkey = 0;
let modalPrice = 0;
let subtotal = 0;
let screenW = 0;
const dqS = (element)=> document.querySelector(element);
const dqSA = (element)=> document.querySelectorAll(element);

window.addEventListener('resize', atualScreen);

function atualScreen() {
    screenW = dqS('body').offsetWidth;
}

//APLICANDO ELEMENTOS NA TELA A PARTIR DO JSON
pizzaJson.map(function(item, index){
    let pizzaItem = dqS('.models .pizza-item').cloneNode(true);    

    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').setAttribute('src', item.img);
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `A partir de ${item.price[0].toLocaleString("pt-br", { style: "currency", currency: "BRL" })}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click',(event)=>{
        event.preventDefault();
        let key = event.target.closest('.pizza-item').getAttribute('data-key');
        modalkey = key;
        
        modalQtd = 1;
        dqS('.pizzaInfo--qt').innerHTML = modalQtd;
        dqS('.pizzaWindowArea .pizzaBig img').setAttribute('src',pizzaJson[key].img);
        dqS('.pizzaWindowArea .pizzaInfo h1').innerHTML = pizzaJson[key].name;
        dqS('.pizzaWindowArea .pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        dqS('.pizzaInfo--pricearea .pizzaInfo--actualPrice').innerHTML = `${pizzaJson[key].price[2].toLocaleString("pt-br", { style: "currency", currency: "BRL" })}`;
        dqSA('.pizzaInfo--size').forEach((classItem)=> {
            if (classItem.classList.contains('selected')) {
                classItem.classList.remove('selected');
            }
            if (classItem.getAttribute('data-key') == 2) {
                classItem.classList.add('selected');
            }
        })
        dqSA('.pizzaInfo--size').forEach((sizeItem, sizeIndex)=> {
            sizeItem.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        dqS('.pizzaInfo--qt').innerHTML = modalQtd;
        

        dqS('.pizzaWindowArea').style.opacity = 0;
        dqS('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            dqS('.pizzaWindowArea').style.opacity = 1;
        }, 200);


    })

    dqS('.pizza-area').append(pizzaItem);
});

//FECHA MODAL
dqSA('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(
    function(item){
        item.addEventListener('click', closeModal)
    }
);

function closeModal() {
    dqS('.pizzaWindowArea').style.opacity = 0;;
    setTimeout(()=>{
        dqS('.pizzaWindowArea').style.display = 'none';
    }, 500);    
};

//AÇÂO DE CLICK QUANTIDADE 
dqS('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQtd > 1){
        modalQtd--
        dqS('.pizzaInfo--qt').innerHTML = modalQtd;   
    } 
});

dqS('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQtd++;
    dqS('.pizzaInfo--qt').innerHTML = modalQtd;
});

function inputClass(event){
    let clickedItem = event.currentTarget;
    let dataKey = clickedItem.getAttribute('data-key')
    dqSA('.pizzaInfo--size').forEach((element)=>{
        element.classList.remove("selected");
    });
    clickedItem.classList.add("selected");
    dqS('.pizzaInfo--pricearea .pizzaInfo--actualPrice').innerHTML = `${pizzaJson[modalkey].price[dataKey].toLocaleString("pt-br", { style: "currency", currency: "BRL" })}`;
}

dqSA('.pizzaInfo--size').forEach((element)=>{
    element.addEventListener('click', inputClass);
});

dqS('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(dqS('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalkey].id+'@'+size;
    let key = cart.findIndex((item)=>item.identifier == identifier);
    if (key > -1) {
        cart[key].qt += modalQtd;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalkey].id,
            price: pizzaJson[modalkey].price[size],
            size,
            qt: modalQtd
        });
    };
    updateCart();
    closeModal();
    atualScreen();
    verification();
});

dqS('header .menu-openner').addEventListener('click', ()=> {
    if (cart.length > 0) {
        dqS('aside').style.width = '100vw';
    }
    updateCart();
    atualScreen();
});

dqS('.menu-closer').addEventListener('click', ()=>{
    dqS('aside').style.width = '0vw';
    atualScreen();
});

function updateCart() {
    
    if(cart.length > 0) {
        dqS('aside').classList.add("show");
        if (screenW > 840) {
            dqS('main').style.marginRight = '30vw';
        }
        
        dqS('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for (let i in cart){
            let cartItem = dqS('.cart--item').cloneNode(true);
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);     
            subtotal += cart[i].price * cart[i].qt;       
            
            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = "(P)";
                    break;
                case 1:
                    pizzaSizeName = "(M)";
                    break;
                case 2:
                    pizzaSizeName = "(G)";
                    break;
            };
            
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.name}, ${pizzaSizeName}`;
            cartItem.querySelector('.cart--item--qtarea .cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector(".cart--item-qtmenos").addEventListener('click', () => {        
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i,1);
                    if (cart.length == 0) {
                        verification();
                    };
                };
                updateCart();
            });
            cartItem.querySelector(".cart--item-qtmais").addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            let qtdItens = cart.length;
            dqS("header .menu-openner span").innerHTML = qtdItens;

            dqS('.cart').append(cartItem);    
        };
         
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        dqS('.subtotal span:last-child').innerHTML = subtotal.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
        dqS('.desconto span:last-child').innerHTML = desconto.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
        dqS('.total span:last-child').innerHTML = total.toLocaleString("pt-br", { style: "currency", currency: "BRL" });

    } else {
        dqS('aside').classList.remove("show");
        dqS('main').style.marginRight = '0vw';
        dqS("header .menu-openner span").innerHTML = cart.length
    };
};

window.addEventListener('resize', verification);

function verification() {
    if (screenW > 840 && cart.length > 0){
        dqS('aside').classList.add("show");
        dqS('aside').style.width = '30vw';
        dqS('main').style.marginRight = '30vw';
    } else {
        if (screenW > 840 && cart.length == 0) {
            dqS('aside').classList.remove("show");
            dqS('aside').style.width = '0vw';
            dqS('main').style.marginRight = '0vw';
        };
    };

    if (screenW < 840 && cart.length > 0) {
        dqS('aside').classList.add("show");
        dqS('aside').style.width = '0vw';
        dqS('main').style.marginRight = '0vw';
    } else {
        if (screenW < 840 && cart.length == 0) {
            dqS('aside').classList.remove("show");
            dqS('aside').style.width = '0vw';
            dqS('main').style.marginRight = '0vw';
        };
    };
};
