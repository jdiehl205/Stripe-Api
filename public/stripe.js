let stripe = Stripe('pk_test_51H2RcTJSDNlPPWasvu9WQ8ZwY1vM5lqWMct8jgsic4QnYD5zVz2LuLeQIQVthCxEYpxhvoJz9bd1MjRNBJShrCu1006WgUjJz4');

let checkoutButton = document.getElementById("checkout-button");

let items;

let form = document.querySelector('form');

let input = document.querySelector('button');

let data;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let xhr = new XMLHttpRequest();

    xhr.open('post', '/get-form-data', true);
    xhr.onload = function(){
        data = JSON.parse(xhr.responseText);
        stripe.redirectToCheckout({
            sessionId: data.id
        })
        console.log(data);
    }
    for(let [key, value] of new FormData(form).entries()){
        xhr.send(value);
    }
    console.log("Submited");
});