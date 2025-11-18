//Toggle Cart Sidebar
function toggleCart(){
    const cart = document.getElementById('cart-popup');
    if (cart){
    cart.classList.toggle('active');
    renderCartItems();
    }
}

//Close cart when clicking outside
window.addEventListener('click', function(event){
    const cart = document.getElementById('cart-popup');
    if(cart && cart.classList.contains('active')){
        if(!cart.contains(event.target) && !event.target.closest('.cart-icon')){
            cart.classList.remove('active');
        }
    }
});

//Local Storage Helpers
function getCart(){
    return JSON.parse(localStorage.getItem('cartItems')) || [];
}
function saveCart(cart){
    localStorage.setItem('cartItems', JSON.stringify(cart));
}
function clearCart(){
    localStorage.removeItem('cartItems');
    updateCartCount();
    renderCartPage?.();
    renderCartItems();
}

//Add Items to Cart
function addToCart(name, price){
    const cart = getCart();
    const existingItem = cart.find(item=> item.name === name);

    if(existingItem){
        existingItem.quantity += 1;
    } else {
        cart.push({name, price, quantity: 1});
    }

    saveCart(cart);
    updateCartCount();
    alert(`${name} added to your cart!`);
    renderCartItems();
}

//Render Cart Items
function renderCartItems(){
    const cartContainer = document.querySelector('#cart-popup .cart-content');
    if(!cartContainer) return;

    const cart = getCart();

    let html = `
    <span class="close-btn" onclick="toggleCart()"> &times;</span>
    <h2>Your Cart</h2>
    `;

    if(cart.length === 0 ){
        html += `<p> Your cart is empty! </p>`;
    } else {
        html += `<ul>`;
        cart.forEach(item =>{
            html += `
            <li>
            ${item.name} - $${item.price.toFixed(2)} x ${item.quantity}
            <button class ="remove-btn"data-name"${item.name}">Remove</button>
            </li>
            `;
        });
        html += `</ul>`;
        html == `<button class= "checkout-btn" onclick = "goToCheckout()">Checkout</button>`;
    }
    cartContainer.innerHTML = html;
}

//Remove Items from Cart
function removeFromCart(name){
    let cart = getCart();
    cart = cart.filter(item => item.name !== name);
    saveCart(cart);
    updateCartCount();
    renderCartPage();
}
//Remove a single item
function removeFromCartPage(name){
    let cart = getCart();
    cart = cart.filter(item => item.name !== name);
    saveCart(cart);
    updateCartCount();
    renderCartPage();
}
//Clear the entire cart
function clearCart(){
    if (confirm("Are you sure you want to clear your entire cart?")){
        localStorage.removeItem('cartItems');
        updateCartCount();
        renderCartPage();
    }
}
    function goToCheckout(){
        window.location.href = 'Checkout.html';
    }



//Render Cart on cart page
function renderCartPage(){
    const cart = getCart();
    const container = document.getElementById('cart-page-content');
    if(!container) return;

    if(cart.length === 0){
        container.innerHTML = `
        <p>Your cart is empty. <a href="Menu.html">Go back to the menu.</a></p>
        `;
        return;
    }

    let total = 0;
    let html = `
    <h2>Your Cart</h2>
    <table class="cart-table">
    <tr>
        <th>Item</th>
        <th>Price</th>
        <th>Qty</th>
        <th>Subtotal</th>
        <th>Action</th>
    </tr>`;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        html += `
            <tr>
                <td>${item.name}</td>
                <td>R ${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>R ${subtotal.toFixed(2)}</td>
                <td><button class ="remove-btn" data-names ="${item.name}">Remove</button></td>
            </tr>`;
    });

    html += `</table>
    <h3>Total: R ${total.toFixed(2)}</h3>
    <div class="cart-actions">
    <button class="checkout-btn" id= "checkout-btn"> Checkout </button>
    <button class ="clear-btn" id="clear-cart-btn"> Clear Cart </button>
    </div>
    `;

    container.innerHTML=html; 
//remove on cart
    container.addEventListener('click', e => {
        if (e.target.classList.contains('remove-btn')){
            const name = e.target.dataset.name;
            removeFromCartPage(name);
            renderCartPage();
        }
        if (e.target.id === 'clear-cart-btn'){
            clearCart();
        }
        if (e.target.id === 'checkout-btn'){
            goToCheckout();
        }
    });
}

//Update Cart Count Badge
function updateCartCount(){
    const cart = getCart();
    const count = cart.reduce((total, item)=> total + item.quantity, 0);
    const countEl = document.getElementById('cart-count');
    if(countEl){
        countEl.textContent = count;
        countEl.style.display = count > 0 ? 'flex' : 'none' ;
    }
}

document.addEventListener('DOMContentLoaded', updateCartCount);

//Render Checkout Page
function renderCheckoutPage(){
    const cart = getCart();
    const itemsContainer = document.getElementById('checkout-items');
    const totalContainer = document.getElementById('checkout-total');
    const form = document.getElementById('checkout-form');

    if(!itemsContainer || !form) return;

    if(cart.length === 0){
        itemsContainer.innerHTML = `<p> Your cart is empty. <a href = "Menu.html" style = "color: #e91e63;">Go back to the menu.</a></p>`;
        totalContainer.innerHTML = '';
        form.style.display = 'none';
        return;
    }

    let total = 0;
    let html = `<table class = "checkout-table">
    <tr>
    <th>Item</th>
    <th>QTY</th>
    <th>Price</th>
    <th>Subtotal</th>
    </tr>
    `;

    cart.forEach(item =>{
        const subtotal = item.price * item.quantity;
        total += subtotal;
        html += `
        <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>R ${item.price.toFixed(2)}</td>
            <td>R ${subtotal.toFixed(2)}</td>
            </tr>`
            
    });

    html += `</table>`;
    itemsContainer.innerHTML = html;
    totalContainer.textContent =  `Total: R ${total.toFixed(2)}`;

    //Handle checkout form submission
    form.addEventListener('submit' , e =>{
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();

        if(!name || !email || !address){
            alert('Please fill in all fields.');
            return;
        }

        //Simulate successful checkout
        alert(`Thank you, ${name}! Your order has been placed.`);
        localStorage.removeItem('cartItems')

        //Clear the cart and redirect to home after successful order
        clearCart();
        window.location.href =  'Home.html';
    });
        
    }
