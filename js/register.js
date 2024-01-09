var inputSpecialitySelect = document.getElementById('inputSpeciality');
fetch('https://mis-api.kreosoft.space/api/dictionary/speciality?page=1&size=18')
.then(response => response.json())
.then(data => {
    data.specialties.forEach(specialty => {
        var option = document.createElement('option');
        option.value = specialty.id;
        option.text = specialty.name;
        inputSpecialitySelect.appendChild(option);
    });
})
.catch(error => {
    console.error('Error fetching data:', error);
});

var regButton = document.getElementById('registerRequset');
var dateControl = document.querySelector('input[type="date"]');

var now = new Date().toISOString().split('T')[0];
dateControl.max = now;

$('.phone-field').inputmask("+7 (999) 999-99-99");

function validateName(name) {
    return /^[а-яА-ЯёЁa-zA-Z\s]{1,1000}$/.test(name);
}


function validateBirthDate(birthDate) 
{
    var today = new Date();
    var selectedDate = new Date(birthDate);
    var minDate = new Date('01.01.1900');
    if(selectedDate <= minDate) return false;
    return selectedDate <= today;
}

document.getElementById('inputBirthDate').addEventListener('input', function () {
    var birthDate = this.value;
    if (!validateBirthDate(birthDate)) {
        document.getElementById('infoDate').innerText = 'Пожалуйста, выберите корректную дату рождения (не позднее сегодняшнего дня и не раньше 01.01.1900).';
        regButton.disabled = true;
    } else {
        document.getElementById('infoDate').innerText = '';
        regButton.disabled = false;
    }
});

$(document).ready(function () {
    $("#registerRequset").click(function () {
        var validate = true;
        var inputName = $("#inputName").val();
        var inputPassword = $("#inputPassword").val();
        var inputEmail = $("#inputEmail").val();
        var inputGender = $("#inputGender").val();
        var inputSpeciality = $("#inputSpeciality").val();
        var inputDate = $("#inputBirthDate").val();

        if (inputName === "") {
            $("#inputName").css("border-color", "red");
            $("#infoName").text("Обязательно поле");
            validate= false;
        } else {
            $("#inputName").css("border-color", "");
            $("#infoName").text("");
        }

        if(inputDate === ""){
            $("#inputDate").css("border-color", "red");
            $("#infoDate").text("Обязательно поле");
            validate= false;
        } else {
            $("#inputDate").css("border-color", "");
            $("#infoDate").text("");
        }

        if (inputPassword === "") {
            $("#inputPassword").css("border-color", "red");
            $("#infoPass").text("Обязательно поле");
        } else {
            $("#inputPassword").css("border-color", "");
            $("#infoPass").text("");
        }

        if (inputEmail === "") {
            $("#inputEmail").css("border-color", "red");
            $("#info").text("Обязательно поле");
            validate = false;
        } else {
            $("#inputEmail").css("border-color", "");
            $("#info").text("");
        }
        if (validate === true)
        {
            console.log(224242);
            $.ajax({
                type: 'POST',
                url: 'https://mis-api.kreosoft.space/api/doctor/register',
                contentType: 'application/json',
                data: JSON.stringify({ email: inputEmail, 
                    password: inputPassword,
                    name: inputName,
                    gender: inputGender,
                    birthday: inputDate,
                    speciality: inputSpeciality
                    }),
                success: function (response) {
                    localStorage.setItem('token', response.token);
                    console.log(localStorage.getItem('token'));
                },
                error: function (error) {
                    if(/Username '.*' is already taken./.test(error.responseJSON.message))
                    {
                        $("#alertData").removeClass("d-none").addClass("d-block");
                    }
                    
                    console.log(error);
                }
            });
        }
    });
});