 var authToken = localStorage.getItem('token');
var fullUrl = window.location.href
var patientId = fullUrl.split(
    "http://localhost:7000/patient/"
);
function fillPatientData(patient)
{
    $("#patientName").text(patient.name);
    if(patient.gender === "Male")
    {
        $("#male").removeClass('d-none');
    }
    else{ $("#female").removeClass('d-none');}
    $("#birthday").text(patient.birthday.slice(0,10));
}
console.log(patientId);
$.ajax({
    url: `https://mis-api.kreosoft.space/api/patient/${patientId[1]}`,
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'
    },
    success: function (response) {
        fillPatientData(response);
    },
    error: function (error, status) {
        console.error("Ошибка при получении профиля:", error);
        if (status === 401)
        {
            window.location.href = '/login';
        }
    }
});