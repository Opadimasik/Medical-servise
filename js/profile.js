$(document).ready(function () {
    var authToken = localStorage.getItem('token');
    if (!authToken) {
        console.error("Токен авторизации отсутствует.");
        window.location.href = '/login';
        return;
    }
    function fillProfileData(profileData) {
        $("#inputName").val(profileData.name);
        $("#inputGender").val(profileData.gender);
        $("#inputBirthDate").val(profileData.birthday.substring(0, 10));
        $("#inputPhone").val(profileData.phone);
        $("#inputEmail").val(profileData.email);
    }

    function sendProfileRequest() {
        $.ajax({
            url: 'https://mis-api.kreosoft.space/api/doctor/profile',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            },
            success: function (response) {
                fillProfileData(response);
            },
            error: function (error, status) {
                console.error("Ошибка при получении профиля:", error);
                if (status === 401)
                {
                    window.location.href = '/login';
                }
            }
        });
    }
    sendProfileRequest();

    $("#profileRequset").click(function () {
        $("#alertData").removeClass("d-block").addClass("d-none");
        var validate = true;
        var inputName = $("#inputName").val();
        var inputEmail = $("#inputEmail").val();
        var inputGender = $("#inputGender").val();
        var inputDate = $("#inputBirthDate").val();
        var inputPhone = $("#inputPhone").val();

        var updatedData = {
            name: inputName,
            gender: inputGender,
            birthday: inputDate,
            phone: inputPhone,
            email: inputEmail
        };

        if (inputName === "") {
            $("#inputName").css("border-color", "red");
            $("#infoName").text("Обязательно поле");
            validate= false;
        } else {
            $("#inputName").css("border-color", "");
            $("#infoName").text("");
        }

        if (inputEmail === "") {
            $("#inputEmail").css("border-color", "red");
            $("#info").text("Обязательно поле");
            validate = false;
        } else {
            $("#inputEmail").css("border-color", "");
            $("#info").text("");
        }

        $.ajax({
            url: 'https://mis-api.kreosoft.space/api/doctor/profile',
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(updatedData),
            success: function (response) {
                console.log("Профиль успешно обновлен:", response);
            },
            error: function (error) {
                if(/Username '.*' is already taken./.test(error.responseJSON.message))
                {
                    $("#alertData").removeClass("d-none").addClass("d-block");
                }
            }
        });
    });
});
