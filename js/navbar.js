var authToken = localStorage.getItem('token');
// if (!authToken) {
//     console.error("Токен авторизации отсутствует.");
//     window.location.href = '/login';
// }

function updateNavbar(profileData) 
{
    $("#loginLink").addClass("d-none");
    $("#patientsLink").removeClass("d-none")
    $("#nameText").text(profileData.name);
    $("#profileDropdown").removeClass("d-none");
}

$.ajax({
    url: 'https://mis-api.kreosoft.space/api/doctor/profile',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'
    },
    success: function (response) {
        updateNavbar(response);
        // localStorage.setItem('name',response.name);
        // localStorage.setItem('gender',response.gender);
        // localStorage.setItem('birthday',response.birthday);
    },
    error: function (error, status) {
        console.error("Ошибка при получении профиля:", error);
        if (status === 401)
        {
            // localStorage.setItem('name','');
            // localStorage.setItem('gender','');
            // localStorage.setItem('birthday','');
            window.location.href = '/login';
        }
    }
});

$("#logoutButton").click(function (){
    $.ajax({
        url: 'https://mis-api.kreosoft.space/api/doctor/logout',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
        success: function (response) {
            window.location.href = '/login';
            localStorage.setItem('token','');
            $("#loginLink").removeClass("d-none");
            $("#patientsLink").addClass("d-none");
            $("#profileDropdown").addClass("d-none");
        },
        error: function (error, status) {
            console.error("Ошибка при получении профиля:", error);
            if (status === 401)
            {
                window.location.href = '/login';
            }
        }
    });
});