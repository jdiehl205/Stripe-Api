let stripe = Stripe('pk_test_51H2RcTJSDNlPPWasvu9WQ8ZwY1vM5lqWMct8jgsic4QnYD5zVz2LuLeQIQVthCxEYpxhvoJz9bd1MjRNBJShrCu1006WgUjJz4');

let sessionId,
    items;

let btn = document.querySelector("#checkout-button");

console.log(btn.dataset.id);

btn.addEventListener("click", () => {
    stripe.redirectToCheckout({
        sessionId: btn.dataset.id
    })
});