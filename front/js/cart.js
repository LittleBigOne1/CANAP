let total = document.querySelector('#totalPrice'); // balise dans le l'html où est le prix total
let totalQuantity = document.querySelector('#totalQuantity'); // balise dans le l'html où est la quantité totale
let localStorageProduct = JSON.parse(localStorage.getItem('cart')); // cart = le panier / variable contenant le LocalStorage parsé
let infoProduct = []; // variable avec tableau contenant le prix et la quantité d'un canapé
let totalPrice = 0; // variable prix total
let quantityProduct = 0; // variable quantité totale
// Affichage des produits dans le DOM et gestion de ceux-ci (quantité / prix / suppression )
function showCart() {
  // si le panier est vide joue la fonction emptyCart
  if (localStorageProduct === null || localStorageProduct.length === 0) {
    emptyCart();
    // Sinon
  } else {
    // création d'une boucle qui parcours le LS pour récuperer les canapés
    for (let item of localStorageProduct) {
      let quantityChoosen = parseInt(item.quantity); // quantité choisie passé dans la fonction parseInt pour avoir un valeur sous numérrique
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
// affiche un message indiquant que le panier est vide, affiche 0 en quantité totale et prix total, et vide le LS
function emptyCart() {
  document.querySelector(
    '#cart__items'
  ).innerHTML += `<div class="cart__item__img">
    <p>Le panier est vide</p>
    </div>`;
  totalQuantity.innerHTML = 0;
  total.innerHTML = 0;
  // vide le LS
  localStorage.clear();
}
// Implémentation dans le DOM du panier
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
// calcul et implémente dans le DOM la quantité totale ainsi le prix total du panier
function resumeCommande(price, quantity) {
  quantityProduct += quantity;
  totalPrice += price * quantity;
  totalQuantity.innerHTML = quantityProduct;
  total.innerHTML = totalPrice;
  if (localStorageProduct.length === 0) {
    emptyCart();
  }
}
// gestion de la suppression d'un produit
function deleteProduct() {
  const deleteButtons = document.querySelectorAll('.deleteItem');

  for (let i = 0; i < localStorageProduct.length; i++) {
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
    });
  }
}

// gestion du changement de quantité
function changeQuantity() {
  const cart = document.querySelectorAll('.itemQuantity');

  // création d'un boucle pour ciblé chaque input de changement de prix
  for (let i = 0; i < cart.length; i++) {
    // écoute l'input afin de modifier la quantité dans le dom et le LS
    cart[i].addEventListener('input', () => {
      let newQty = parseInt(cart[i].value); // variable avec la nouvelle quantité
      let difference = newQty - localStorageProduct[i].quantity; // variable contenant la différence entre la nouvelle quantité et l'ancienne
      localStorageProduct[i].quantity = newQty;
      infoProduct[localStorageProduct[i].id].quantity = newQty;
      localStorage.setItem('cart', JSON.stringify(localStorageProduct));
      resumeCommande(infoProduct[localStorageProduct[i].id].price, difference);
    });
  }
}

// **********************  Formulaire de validation de la commande & envois de celui-ci à l'API *********************************

const inputs = document.querySelectorAll(
  'input[type="text"], input[type="email"]'
);
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
    //accepte l'ensemble de l'alphabet en majuscule et miniscule tous les caractères accentués
  } else if (!value.match(/^[a-zA-ZÀ-ÿ\s,-]{1,30}$/)) {
    // expliquer le regex
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
// vérification de l'adresse comprenant le nombre de caractère et le regex avec affichage d'un message d'erreur adapté

function adressChecker(value) {
  //accepte l'ensemble de l'alphabet en majuscule et miniscule tous les caractères accentués ainsi que les nombres et les tirets
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
    //accepte l'ensemble de l'alphabet en majuscule et miniscule,tous les caractères accentués, les tirets
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
      //accepte l'ensemble de l'alphabet en miniscule tous les caractères accentués ainsi que(-_ &ç) et dois adopter ce model ****@*****.**
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
function inputsChecker() {
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
}
inputsChecker();
let contact;
let commande = []; // tableau vide qui va recevoir les id
// écoute le clic sur le bouton "Commander !" et si les infos du formulaire sont valides création d'un objet contact et ajout au LS ainsi que création d'un objet regroupant les informations du formulaires et les canapés choisis et envoi à l'API pour récupérer le numéro de commande et rediriger vers la page de confirmation
function listenOrder() {
  document.querySelector('#order').addEventListener('click', (e) => {
    // annule le comportement par defaut du clic sur le bouton
    e.preventDefault();
    if (firstName && lastName && address && city && email) {
      // vérifier que tout les champs sont valides
      // création de l'objet contact
      const contact = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email,
      };

      // création d'une boucle qui parcours le LS pour récuperer les canapés
      for (let canap of localStorageProduct) {
        // création d'une boucle qui ajoute l'id autant de fois que de quantité dans le tableau "commande"
        for (let i = 0; i < canap.quantity; i++) {
          commande.push(canap.id);
        }
      }

      let userOrder = { contact: contact, products: commande }; // objet à envoyer à l'API

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
          // redirection vers le page confirmation
          window.location.href = `/front/html/confirmation.html?commande=${data.orderId}`;
        })
        .catch(function (err) {
          alert('erreur' + err);
        });
    } else {
      alert("Veuillez remplir correctement l'ensemble des champs");
    }
  });
}
listenOrder();
