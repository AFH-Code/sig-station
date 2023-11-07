document.querySelectorAll('[data-component~="sidebar"]')
.forEach((button) => {
button.addEventListener('click', function() {
    document
    .getElementById(this.dataset.target)
    .classList
    .toggle('active')
})
})
$('#start_map_cart').trigger('click');