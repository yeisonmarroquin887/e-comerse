//se encarga de traerme los productos
async function extractingproducts(){
    try{ 
        const data = await fetch(
            "https://ecommercebackend.fundamentos-29.repl.co/"
        );
        const result = await data.json();

        window.localStorage.setItem("products", JSON.stringify(result))
        
        return result
    }catch(error){
        console.log(error)
    }
}


function priproducts(products){
    const productHTML = document.querySelector(".products")
    let html = ""
    for(const product of products){
        html += `
        <div class="product">
    <div class="product__img">
        <img src="${product.image}" alt="image">
    </div>

    <div class="product__info">
    <div id="agre"> 
    ${product.quantity ? `<i class="bx bx-plus" id="${product.id}"></i>`
                      : "<span>Agotado</span>"}
    </div>

    <h4>
    $${product.price}
    <span>${product.category}</span>: ${product.quantity}</span>
  
    </h4>
    <h3 class="lett">${product.name}</h3>
       
    </div>
</div>
        

        `
        }
        
       productHTML.innerHTML=html;
 
}
function hedshowld(){
    const runHTML = document.querySelector(".bx-shopping-bag")
    const bxcartHTML = document.querySelector(".run")
    
    runHTML.addEventListener("click", function (){
        bxcartHTML.classList.toggle("run__show")
    })
}
function ingresomenu(){
    const runHTML = document.querySelector(".bxs-dashboard")
    const bxcartHTML = document.querySelector(".menu")
    
    runHTML.addEventListener("click", function (){
        bxcartHTML.classList.toggle("run__show")
    })
}
function handleShowcarts(DB){
    const productHTML = document.querySelector(".products")
    productHTML.addEventListener("click", function (d){
        if(d.target.classList.contains("bx-plus")){
            const id = Number(d.target.id);
            let productfin = null;
            for(const product of DB.products){
                if(product.id === id){
                    productfin = product
                    break;
                }
            }
            if(DB.carts[productfin.id]){
                if(productfin.quantity===DB.carts[productfin.id].amount){
                    return alert("agotado...")
                }
                DB.carts[productfin.id].amount++;
            } else {
                DB.carts[productfin.id] = {...productfin, amount: 1};
            }
           window.localStorage.setItem("carts",JSON.stringify(DB.carts))
           
        }
        prinproducstcarts(DB)
        printotal(DB)
        cantiofproducts(DB)
    })
}
function prinproducstcarts(DB){
    const cartsproducts = document.querySelector(".pro")
    let html = "";
    
    for(const product in DB.carts){
        const {quantity, price, name, image, id, amount} = DB.carts[product];
         html += `
         <div class="prop">
         <div class="tien">
         <img src="${image}" alt="image">
         </div>
         <div class="pm">
         <div class="tien__body">
         <h4>${name} | ${price}</h4> 
         <p>Stock: ${quantity}</p>
         </div>
          
         <div class="tien__body_pre"id="${id}">
          <i class="bx bx-minus"></i>
           <span>${amount}</span>
           <i class="bx bx-plus"></i>
           <i class="bx bx-trash"></i>
           </div>
         </div>
         </div>
         `
    }
    
    cartsproducts.innerHTML=html
    
}
function handelproductsincarts(DB){
    const proincre = document.querySelector(".pro")
    proincre.addEventListener("click", function(d){
        if(d.target.classList.contains("bx-plus")){
            const id = Number(d.target.parentElement.id);
            for(const product of DB.products){
                if(product.id === id){
                    productfin = product
                    break;
                }
            }
            if(DB.carts[productfin.id]){
                if(productfin.quantity===DB.carts[productfin.id].amount){
                    return alert("Lo siento no tenemos mas este producto en bodega se nos ha agotado...");
                }
         DB.carts[id].amount++;
                }
            
        }
        if(d.target.classList.contains("bx-minus")){
            const id = Number(d.target.parentElement.id);
            if(DB.carts[id].amount===1){
                const response = confirm("estas seguro de eliminar el producto??")
                delete DB.carts[id];
                if(!response)return;
                delete DB.carts[id];
            } else {
                DB.carts[id].amount--;
            }
        
        }
        if(d.target.classList.contains("bx-trash")){
            const id = Number(d.target.parentElement.id);
            delete DB.carts[id];
        }

        window.localStorage.setItem("carts", JSON.stringify(DB.carts))
         prinproducstcarts(DB)  
         printotal(DB)     
         cantiofproducts(DB)
       
    });
}
function printotal(DB){
    const cantiHTML = document.querySelector(".canti")
    const dinerHTML = document.querySelector(".dine")
    let totalproduct = 0;
    let totaldiner = 0;
   for (const product  in DB.carts) {
    const { amount, price } = DB.carts[product];
    totalproduct += price * amount;
     totaldiner += amount;
   }
   dinerHTML.textContent = totaldiner + "units";
   cantiHTML.textContent = "$" + totalproduct + ".00";
}
function incremtpro(DB){

    const btnHTML = document.querySelector(".btn")
    btnHTML.addEventListener("click", function(){
      if(!Object.values(DB.carts).length) return alert("selecciona algun producto...")
     const  response = confirm("seguro que quieres hacer la compra 😻😺")
     if(!response) return;
     const currentproducts = [] 
     for (const product of DB.products) {
         const productcurt = DB.carts[product.id]
         if(product.id === productcurt?.id){
             currentproducts.push({
                 ...product,
                 quantity: product.quantity-productcurt.amount
             })
         }else{
             currentproducts.push(product)
         }
     }
     products = currentproducts
     DB.carts = {}
     window.localStorage.setItem("products", JSON.stringify(DB.products));
     window.localStorage.setItem("carts", JSON.stringify(DB.carts));
     printotal(DB);
     prinproducstcarts(DB);
     priproducts(products);
     cantiofproducts(DB);
    })
}
function cantiofproducts(DB){
    const amountHTML = document.querySelector(".amounts")
    let amount = 0;
    for (const product in DB.carts){
       amount += DB.carts[product].amount;

    }
    amountHTML.textContent = amount;
}
function handleFilterButtons(DB, productsFilter) {
    const buttonsHTML = document.querySelectorAll(".filters .filter");
    const productsHTML = document.querySelector(".products");

    for (const button of buttonsHTML) {
        button.addEventListener("click", (d) => {
            let category = d.currentTarget.firstElementChild.textContent;
             
            if (category === "Show all") {
                productsFilter = DB.products;
            } else {
                productsFilter = DB.products.filter(
                    (product) => product.category === category
                );
            }
           
            priproducts(productsFilter);

            // productsHTML.style.animation =
            //     "animationProducts normal ease-in-out 1s";
        });
    }
}

function barracolors (){
    const navbar = document.querySelector(".barra");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 40) {
            navbar.classList.add("barra__active");
        } else {
            navbar.classList.remove("barra__active");
        }
    });
}
function handleTheme() {
    const iconTheme = document.querySelector(".bx-moon");

    iconTheme.addEventListener("click", function () {
        document.body.classList.toggle("dark-theme");
    });
}

/*function active(){
    const buttonsHTML = document.querySelectorAll("filters.filter");

    for (const button of buttonsHTML) {
        button.addEventListener("click", () => {
            for (const button of buttonsHTML) {
                button.classList.remove("filter__active");
            }
            button.classList.add("filter__active mixitup-control-active ");
        });
    }
}*/




//se encarga de anrrancarme el codigo
async function main(){
    const DB = {
        products: JSON.parse(window.localStorage.getItem(".products")) ||
        (await extractingproducts()),
     carts: JSON.parse(window.localStorage.getItem("carts")) || {}
    }; 
    let productsFilter = DB.products;
    
    handleTheme();
    barracolors ();
    handleFilterButtons(DB, productsFilter);
    priproducts(productsFilter);
    hedshowld();
    handleShowcarts(DB);
    prinproducstcarts(DB);
    handelproductsincarts(DB);
    printotal(DB);
    incremtpro(DB);
    cantiofproducts(DB);
    ingresomenu();
    
  
     
    

    }
main()


/*
NOTA
Lo logre talves no sea el mejor trabajo de todos talves me faltaron algunas cosas pero lo di todo en esta noche asi lloviendo y hasta sin lus
lo di todo gracias profe brayan por enseñranos todo para empezar a nacer como programador lemando este trabajo un poco incompleto pero 
no fue x falta de conocimiento de maquetacion sino xq esta noche llovio muchisimo pero no me rendi acabo a las 5:32 AM y seguire de ahora en adelante danola
toda por este sueño de ser un buen programador.....s
 */



    
