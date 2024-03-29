var emailInput = document.getElementById('inputEmail');
var passwordInput = document.getElementById('inputPassword');
var infoDiv = document.getElementById('info');
var infoDivPass = document.getElementById('infoPass')
var loginButton1 = document.getElementById('login')
var regButton1 = document.getElementById('registerRequset');
var profButton = document.getElementById('profileRequset');
// if (loginButton1 == null) var loginButton = regButton1;
// else var loginButton = loginButton1;
var loginButton = loginButton1 !== null ? loginButton1 : (regButton1 !== null ? regButton1 : profButton);
if(document.getElementById('register'))
{
    document.getElementById('register').addEventListener('click', function () {
        window.location.href = '/register';
    });
}

function validatePassword() {
    if (passwordInput.value.length < 6) {
        infoDivPass.innerText = 'Минимальная длина пароля 6 символов';
        $("#inputPassword").addClass("is-invalid");
        infoDivPass.style.color = 'rgb(235, 43, 43)';
        passwordInput.style.borderColor = 'rgb(235, 43, 43)';
        loginButton.disabled = true;
        return;
    }

    if (!/\d/.test(passwordInput.value)) {
        infoDivPass.innerText = 'Пароль должен содержать хотя бы одну цифру';
        infoDivPass.style.color = 'rgb(235, 43, 43)';
        passwordInput.style.borderColor = 'rgb(235, 43, 43)';
        $("#inputPassword").addClass("is-invalid");
        loginButton.disabled = true;
        return;
    }

    infoDivPass.innerText = '';
    infoDivPass.style.color = '';
    passwordInput.style.borderColor = '';
    $("#inputPassword").removeClass("is-invalid");
    loginButton.disabled = false;
}

if (passwordInput!=null){
    passwordInput.addEventListener('input', function () {
        clearTimeout(passwordInput.timer);
        passwordInput.timer = setTimeout(validatePassword, 100);
    });
}


function validateEmail() {
var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(emailInput.value)) {
    infoDiv.innerText = 'Некорректный адрес электронной почты';
    infoDiv.style.color = 'rgb(235, 43, 43)';
    emailInput.style.borderColor = 'rgb(235, 43, 43)';
    $("#inputEmail").addClass("is-invalid");
    loginButton.disabled = true;
    return;
}

infoDiv.innerText = '';
infoDiv.style.color = '';
emailInput.style.borderColor = '';
$("#inputEmail").removeClass("is-invalid");
loginButton.disabled = false;
}

emailInput.addEventListener('input', function () {
clearTimeout(emailInput.timer);
emailInput.timer = setTimeout(validateEmail, 1000);
});
if(document.getElementById('login'))
{
    document.getElementById('login').addEventListener('click', function () {
        $.ajax({
        type: 'POST',
        url: 'https://mis-api.kreosoft.space/api/doctor/login',
        contentType: 'application/json',
        data: JSON.stringify({ email: emailInput.value, password: passwordInput.value }),
        success: function (response) {
            localStorage.setItem('token', response.token);
            window.location.href = '/patients';
        },
        error: function (error) {
            infoDivPass.innerText = 'Проверьте свои данные';
            infoDivPass.style.color = 'rgb(235, 43, 43)';
        }
        });
    });
}
