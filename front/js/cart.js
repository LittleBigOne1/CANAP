let total = document.querySelector('#totalPrice');
let totalQuantity = document.querySelector('#totalQuantity');
let localStorageProduct = JSON.parse(localStorage.getItem('cart'));
let infoProduct = [];
let totalPrice = 0;
let quantityProduct = 0;
console.log(localStorageProduct);
function showCart() {
  let getProducts = JSON.parse(localStorage.getItem('cart'));
  //console.log(getProducts);
  document.querySelector('#cart__items').innerHTML = '';
  if (getProducts === null) {
    document.querySelector(
      '#cart__items'
    ).innerHTML += `<div class="cart__item__img">
      <p>Aucun article dans le panier</p>
      </div>`;

    // Sinon
  } else {
    for (let item of getProducts) {
      let quantityChoosen = parseInt(item.quantity);
      let colorChoosen = item.color;
      //console.log(item)

      fetch('http://localhost:3000/api/products/' + item.id)
        .then((res) => {
          //console.log(res.ok);
          if (res.ok) {
            return res.json();
          }
        })
        .then((product) => {
          //console.table(product);
          infoProduct[product._id] = {
            quantity: quantityChoosen,
            price: product.price,
          };
          resumeCommande(product.price, quantityChoosen);
          addDetails(product, quantityChoosen, colorChoosen);
          changeQuantity();
          deleteProduct();
        })
        .catch((err) => {
          document.querySelector('#cart__items').innerHTML =
            '<h3>Connexion impossible</h3>';
          console.log('erreur' + err);
        });
    }
  }
}
function addDetails(product, quantity, color) {
  let id = product._id;
  let name = product.name;
  let price = product.price;
  let url = product.imageUrl;
  let alt = product.altTxt;

  document.querySelector('#cart__items').innerHTML += `
    <article class="cart__item" data-id=${id} data-color=${color}>
    <div class="cart__item__img">
    <img src=${url} alt=${alt}>
    </div>
    <div class="cart__item__content">
    <div class="cart__item__content__description">
    <h2>${name}</h2>
    <p>${color}</p>
    <p>${price} €</p>
    </div>
    <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
    <p>Qté : </p>
    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${quantity}>
    </div>
    <div class="cart__item__content__settings__delete">
    <p class="deleteItem">Supprimer</p>
    </div>
    </div>
    </div>
    </article>
    
    `;
  // fontion de suppression de produit
}
showCart();
function resumeCommande(price, quantity) {
  totalPrice += price * quantity;
  quantityProduct += quantity;
  totalQuantity.innerHTML = quantityProduct;
  total.innerHTML = totalPrice;
}
///////////////////////// suppression de produit ///////////////////////////
function deleteProduct() {
  const deleteButtons = document.querySelectorAll('.deleteItem');
  for (let i = 0; i < localStorageProduct.length; i++) {
    console.log(deleteButtons[i]);

    deleteButtons[i].addEventListener('click', () => {
      let deleteId = localStorageProduct[i].id;
      console.log(deleteId);
      let deleteColor = localStorageProduct[i].color;
      /*
      console.log(deleteColor);
      localStorageProduct = localStorageProduct.filter(Element => Element.id != deleteId || Element.color != deleteColor)
      localStorage.setItem('cart', JSON.stringify(localStorageProduct));
      let difference = 0 - localStorageProduct[i].quantity;
      resumeCommande(infoProduct[localStorageProduct[i].id].price, difference);
      */
    });
  }
}

//changeQuantity();

/*
remove du dom
pop LS
setItem LS

inputs.forEach((input) => {
  input.addEventListener('input', (e) => {


*/

///////////////////////// changement de quantité ///////////////////////////
/*
let itemQuantity = document.querySelectorAll(".itemQuantity");
itemQuantity.addEventListener("change", (q) => {
    for (let item of getProducts) {
        
    }

});  
*/
function changeQuantity() {
  const cart = document.querySelectorAll('.itemQuantity');
  //console.log(cart);
  for (let i = 0; i < cart.length; i++) {
    cart[i].addEventListener('input', () => {
      let changeQty = parseInt(cart[i].value);
      //console.log(cart[i].value);
      //console.log(changeQty);
      let difference = changeQty - localStorageProduct[i].quantity;
      localStorageProduct[i].quantity = changeQty;
      console.log(infoProduct);
      infoProduct[localStorageProduct[i].id].quantity = changeQty;
      localStorage.setItem('cart', JSON.stringify(localStorageProduct));
      resumeCommande(infoProduct[localStorageProduct[i].id].price, difference);
    });
  }
}

/*
document.body.addEventListener ("click", (e) => {
  console.log(e)
  e.target.remove();
  });
  */

//////////////////////// form //////////////////////////////
/*
let firstName = document.querySelector('#firstName');
let lastName = document.querySelector('#lastName');
let address = document.querySelector('#address');
let city = document.querySelector('#city');
let email = document.querySelector('#email');

let submitOrder = document.querySelector('#order');

/////////////////////////////////////////////////////////////////



*/
const inputs = document.querySelectorAll(
  'input[type="text"], input[type="email"]'
);
//console.log(inputs);
let firstName, lastName, address, city, email;
const errorDisplay = (tag, message, valid) => {
  const container = document.querySelector('input' + '#' + tag);
  const errorMessage = document.querySelector('#' + tag + 'ErrorMsg');
  if (!valid) {
    container.classList.add('p');
    errorMessage.textContent = message;
  } else {
    container.classList.remove('p');
    errorMessage.textContent = message;
  }
};

const nameChecker = (value, type) => {
  const label = type === 'firstName' ? 'prénom' : 'nom';
  if (value.length > 0 && (value.length < 1 || value.length > 30)) {
    errorDisplay(type, `Le ${label} doit faire entre 1 et 30 caractères`);
    if (type === 'firstName') {
      firstName = null;
    } else {
      lastName = null;
    }
  } else if (!value.match(/^[a-zA-ZÀ-ÿ\s,-]{1,30}$/)) {
    errorDisplay(
      type,
      `Le ${label} ne doit pas contenir de caractère spéciaux `
    );
    if (type === 'firstName') {
      firstName = null;
    } else {
      lastName = null;
    }
  } else {
    errorDisplay(type, '', true);
    if (type === 'firstName') {
      firstName = value;
    } else {
      lastName = value;
    }
  }
};

const adressChecker = (value) => {
  if (!value.match(/^[#.0-9a-zA-ZÀ-ÿ\s,-]{2,60}$/)) {
    errorDisplay('address', "L'adresse n'est pas valide");
    address = null;
  } else {
    errorDisplay('address', '', true);
    address = value;
  }
};
const cityChecker = (value) => {
  if (value.length > 0 && (value.length < 1 || value.length > 30)) {
    errorDisplay(
      'city',
      'Le Nom de la ville doit faire entre 1 et 30 caractères'
    );
  } else if (!value.match(/^[a-zA-ZÀ-ÿ\s,-]{1,60}$/)) {
    errorDisplay('city', "Ce caractères n'est pas valide");
    city = null;
  } else {
    errorDisplay('city', '', true);
    city = value;
  }
};
const emailChecker = (value) => {
  if (
    !value.match(
      /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/
    )
  ) {
    errorDisplay('email', "Le mail n'est pas valide");
    email = null;
  } else {
    errorDisplay('email', '', true);
    email = value;
  }
};

inputs.forEach((input) => {
  input.addEventListener('input', (e) => {
    switch (e.target.id) {
      case 'firstName':
        nameChecker(e.target.value, e.target.id);
        break;
      case 'lastName':
        nameChecker(e.target.value, e.target.id);
        break;
      case 'address':
        adressChecker(e.target.value);
        break;
      case 'city':
        cityChecker(e.target.value);
        break;
      case 'email':
        emailChecker(e.target.value);
        break;
      default:
        null;
    }
  });
});

let contact;
let commande = [];

const order = document.querySelector('#order');
order.addEventListener('click', (e) => {
  e.preventDefault();
  //console.log(firstName, lastName, address, city, email);
  if (firstName && lastName && address && city && email) {
    // vérifier que tout les champs sont true

    const contact = {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    };
    console.log(contact);
    //console.log('console.log CONTACT ===>', contact);
    localStorage.setItem('contact', JSON.stringify(contact));
    //commande = JSON.parse(localStorage.getItem('cart'));
    // parcourir le LS pour extraire l'id et faire une autre boucle pour ajouter l'id autant de fois que de qté

    //console.log('console.log COMMANDE ===>', JSON.parse(commande));

    for (let item of localStorageProduct) {
      //console.log(JSON.stringifyitem);
      //console.log(item.id);
      for (let i = 0; i < item.quantity; i++) {
        commande.push(item.id);
      }

      console.log('console.log COMMANDE ===>', commande);
      //console.log(JSON.parse(item));
    }

    let userOrder = { contact: contact, products: commande };
    console.log('CONSOLE.LOG userOrder ===>', userOrder);

    fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userOrder),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // envoyé à la page confirmation, autre écriture de la valeur "./confirmation.html?commande=${data.orderId}"
        window.location.href = `/front/html/confirmation.html?commande=${data.orderId}`;
      })
      .catch(function (err) {
        console.log(err);
        alert('erreur');
      });
    //////////////////       //////////////////////////////

    inputs.forEach((input) => (input.value = ''));
    //console.log(inputs);
    firstName = null;
    lastName = null;
    address = null;
    city = null;
    email = null;

    ////////////////////////////////////////////////////////////////
  } else {
    alert("Veuillez remplir correctement l'ensemble des champs");
  }
});
//107fb5b75607497b96722bda5b504926
//107fb5b75607497b96722bda5b504926
