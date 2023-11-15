import '@babel/polyfill'
import { login } from './login'
import { displayMap } from './mapbox'


const locatios = JSON.parse(document.getElementById('map').dataset.locations)
displayMap(locatios)

document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password)
})

// document.querySelector('.nav__el--logout').addEventListener('click', logout)