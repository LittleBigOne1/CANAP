let total = document.querySelector('#totalPrice'); // endroit dans le l'html où est le prix total
let totalQuantity = document.querySelector('#totalQuantity'); // endroit dans le l'html où est la quantité totale
let localStorageProduct = JSON.parse(localStorage.getItem('cart')); // cart = le panier / variable contenant le LS parsé
let infoProduct = []; // variable avec tableau contenant les prix et la quantité d'un canapé
let totalPrice = 0; // variable prix total
let quantityProduct = 0; // variable quantité totale

// Affichage des produits dans le DOM et gestion de ceux-ci (quantité / prix / suppression )
function showCart() {
  document.querySelector('#cart__items').innerHTML = '';
  // si le panier est vide
  if (localStorageProduct === null) {
    document.querySelector(
      '#cart__items'
    ).innerHTML += `<div class="cart__item__img">
      <p>Aucun article dans le panier</p>
      </div>`;

    // Sinon
  } else {
    // création d'une boucle qui parcours le LS pour récuperer les canapés
    for (let item of localStorageProduct) {
      let quantityChoosen = parseInt(item.quantity); // quantité choisie
      let colorChoosen = item.color; // couleur choisie

      // Création de la requete de GET sur l'API afin de récupérer chaque canapé du panier grâce à leur id
      fetch('http://localhost:3000/api/products/' + item.id)
        // si la réponse est bonne elle passe au format json
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        // puis récupération du tableau produits et mis dans la variable product et réutilisation dans les fonctions "resumeCommande" et "addDetails"
        .then((product) => {
          infoProduct[product._id] = {
            quantity: quantityChoosen,
            price: product.price,
          };
          resumeCommande(product.price, quantityChoosen);
          addDetails(product, quantityChoosen, colorChoosen);
        })
        //
        .then(() => {
          changeQuantity();
          deleteProduct();
        })
        //si erreur tombe dans le catch
        .catch((err) => {
          console.error(err);
        });
    }
  }
}
// incrémentation dans le DOM du panier
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
}
showCart();
// calcul et incrémente dans le DOM la quantité totale ainsi le prix total du panier
function resumeCommande(price, quantity) {
  quantityProduct += quantity;
  totalPrice += price * quantity;
  totalQuantity.innerHTML = quantityProduct;
  total.innerHTML = totalPrice;
}
// gestion de la suppression d'un produit
function deleteProduct() {
  const deleteButtons = document.querySelectorAll('.deleteItem');

  //console.log(deleteButtons);
  for (let i = 0; i < localStorageProduct.length; i++) {
    //console.log(i);
    //écoute le clic des boutons supprimer afin de supprimer le canapé du DOM et du LS
    deleteButtons[i].addEventListener('click', (e) => {
      let deleteId = localStorageProduct[i].id;
      let deleteColor = localStorageProduct[i].color;
      let difference = 0 - localStorageProduct[i].quantity;
      localStorageProduct = localStorageProduct.filter(
        (Element) => Element.id != deleteId || Element.color != deleteColor
      );
      localStorage.setItem('cart', JSON.stringify(localStorageProduct));
      e.target.closest('.cart__item').remove();

      resumeCommande(infoProduct[deleteId].price, difference);
      console.log(resumeCommande);
    });
  }
}

// gestion du changement de quantité
function changeQuantity() {
  const cart = document.querySelectorAll('.itemQuantity');
  //console.log(cart);
  // création d'un boucle pour ciblé chaque input de changement de prix
  for (let i = 0; i < cart.length; i++) {
    // écoute l'input afin de modifier la quantité dans le dom et le LS
    cart[i].addEventListener('input', () => {
      let newQty = parseInt(cart[i].value);// variable avec la nouvelle quantité
      console.log(cart[i].value);
      console.log(newQty);
      let difference = newQty - localStorageProduct[i].quantity; // variable contenant la différence entre la nouvelle quantité et l'ancienne
      console.log(difference);
      localStorageProduct[i].quantity = newQty;
      infoProduct[localStorageProduct[i].id].quantity = newQty;
      console.log(infoProduct);
      localStorage.setItem('cart', JSON.stringify(localStorageProduct));
      resumeCommande(infoProduct[localStorageProduct[i].id].price, difference);
    });
  }
}

// **********************  Formulaire de validation de la commande & envois de celui-ci à l'API *********************************

const inputs = document.querySelectorAll(
  'input[type="text"], input[type="email"]'
);
//console.log(inputs);
let firstName, lastName, address, city, email;
// affichage du message d'erreur si besoin est/ validité du champs
function errorDisplay(tag, message, valid) {
  const container = document.querySelector('input' + '#' + tag);
  const errorMessage = document.querySelector('#' + tag + 'ErrorMsg');
  if (!valid) {
    container.classList.add('p');
    errorMessage.textContent = message;
  } else {
    container.classList.remove('p');
    errorMessage.textContent = message;
  }
}
// vérification du nom/prénom comprenant le nombre de caratère et le regex avec affichage d'un message d'erreur adapté
function nameChecker(value, type) {
  // opérateur ternaire qui déterminer s'il s'agit du prénom ou du nom pour afficher un message d'erreur adapté le cas échéant
  const label = type === 'firstName' ? 'prénom' : 'nom';
  // si nombre de caratère est supérieur à 30 affiche un message d'erreur
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
}
// vérification de l'adresse comprenant le nombre de caratère et le regex avec affichage d'un message d'erreur adapté

function adressChecker(value) {
  if (!value.match(/^[#.0-9a-zA-ZÀ-ÿ\s,-]{2,60}$/)) {
    errorDisplay('address', "L'adresse n'est pas valide");
    address = null;
  } else {
    errorDisplay('address', '', true);
    address = value;
  }
}
// vérification de la ville comprenant le nombre de caratère et le regex avec affichage d'un message d'erreur adapté
function cityChecker(value) {
  if (value.length > 0 && (value.length < 1 || value.length > 30)) {
    errorDisplay(
      'city',
      'Le Nom de la ville doit faire moins de 30 caractères'
    );
  } else if (!value.match(/^[a-zA-ZÀ-ÿ\s,-]{1,30}$/)) {
    errorDisplay('city', "Ce caractères n'est pas valide");
    city = null;
  } else {
    errorDisplay('city', '', true);
    city = value;
  }
}
// vérification de l'email avec le regex adapté et affichage d'un d'erreur le cas échéant
function emailChecker(value) {
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
}

inputs.forEach((input) => {
  // écoute les inputs et joue la fonction de vérification adaptée
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
// pour chaque input si le champs est vide alors l'input = null
inputs.forEach((input) => (input.value = ''));
//console.log(inputs);
firstName = null;
lastName = null;
address = null;
city = null;
email = null;

let contact;
let commande = [];// tableau vide qui va recevoir les id
// écoute le clic sur le bouton "Commander !" et si les infos du formulaire sont valides création d'un objet contact et ajout au LS ainsi que création d'un objet regroupant les informations du formulaires et les canapés choisis et envoi à l'API pour récupérer le numéro de commande et rediriger vers la page de confirmation
document.querySelector('#order').addEventListener('click', (e) => {
  // annule le comportement par defaut du clic sur le bouton
  e.preventDefault();
  //console.log(firstName, lastName, address, city, email);
  if (firstName && lastName && address && city && email) {
    // vérifier que tout les champs sont valides

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
    // parcourir le LS pour extraire l'id et faire une autre boucle pour ajouter l'id autant de fois que de qté

    // création d'une boucle qui parcours le LS pour récuperer les canapés
    for (let canap of localStorageProduct) {
      // création d'une boucle qui ajoute l'id autant de fois que de quantité dans le tableau "commande"
      for (let i = 0; i < canap.quantity; i++) {
        commande.push(canap.id);
      }

      console.log('console.log COMMANDE ===>', commande);
    }

    let userOrder = { contact: contact, products: commande }; // objet à envoyer à l'API
    console.log('CONSOLE.LOG userOrder ===>', userOrder);

    // Création de la requete de POST sur l'API afin d'y envoyer l'objet userOrder & récupéré l'id de la commande
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
        // redirection vers le page confirmation
        window.location.href = `/front/html/confirmation.html?commande=${data.orderId}`;
      })
      .catch(function (err) {
        console.log(err);
        alert('erreur' + err);
      });
  } else {
    alert("Veuillez remplir correctement l'ensemble des champs");
  }
});
