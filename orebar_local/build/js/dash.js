const slideout = new Slideout({
    'panel': document.getElementById('panel'),
    'menu': document.getElementById('menu'),
    'padding': 256,
    'tolerance': 70
});

document.querySelector('.toggle-button').addEventListener('click', function () {
    slideout.toggle();
});

slideout.on('beforeopen', function () {
    document.querySelector('.fixed').classList.add('fixed-open');
});

slideout.on('beforeclose', function () {
    document.querySelector('.fixed').classList.remove('fixed-open');
});
