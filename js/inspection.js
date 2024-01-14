var fullUrl = window.location.href;
var authToken = localStorage.getItem('token');
var inspectionId = fullUrl.split(
    "http://localhost:7000/inspection/"
);


$(document).ready(function() {
    const apiUrl = `https://mis-api.kreosoft.space/api/inspection/${inspectionId[1]}`;
    $.ajax({
        url: apiUrl,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
        success: function(data) {
            $("#patientName").text(`Пациент: ${data.patient.name}`);
            $("#main-text").text(`Амбулаторный осмотр от ${data.date}`);
            $("#patientDoctor").text(`Медицинский работник: ${data.doctor.name}`)
            if(data.patient.gender === "Male")
            {
                $("#patientGender").text(`Пол: мужской`);
            }
            else $("#patientGender").text(`Пол: женский`);

            getId(data.doctor.id);

            switch (data.conclusion)
            {
                case "Disease":
                    $("#concl").text("Болезнь");
                    $("#conclDate").text(`Дата следующего визита: ${data.nextVisitDate}`);
                    break;
                case "Recovery":
                    $("#concl").text("Выздоровление");
                    $("#conclDate").addClass("d-none");
                    break;
                case "Death":
                    $("#concl").text("Смерть");
                    $("#conclDate").text(`Дата смерти: ${data.deathDate}`);
                    break;
            }
            console.log(data);
            $("#birthday").text(data.patient.birthday);
            $("#addAnamnesis").text(data.anamnesis);
            $("#anamnesis").val(data.anamnesis);
            $("#addComplaints").text(data.complaints);
            $("#complaints").val(data.complaints);
            $("#addRecomend").text(data.treatment);
            $("#recomend").val(data.treatment);
            if(data.consultations.length > 0)
            {
                data.consultations.forEach(element => {
                    console.log(element);
                    addConsultation(element);
                });
            }
            if (data.diagnoses.length > 0) {
                
                data.diagnoses.forEach(element => {
                    addDiagnose(element);
                });
            }
        },
        error: function(error) {
            console.error("Error fetching data:", error);
        }
    });
});

//consultation
function addConsultation(consultation){
    if(consultation.rootComment.length > 0)
    {
        var specialityValue = consultation.speciality.name;
        var commentValue = $('#consultationComment').val();
        var consultationText = `Требуется <strong> ${specialityValue} </strong>`; 
        var consultationElement = $('<div></div>').html(consultationText);
        $('#addedConsultation').append(consultationElement);
    }
    else
    {
        var specialityValue = consultation.speciality.name;
        var consultationText = `<strong> Консультант  ${consultation.rootComment.author.name}} </strong><br>
        Специализация консультанта ${specialityValue}`; 
        var consultationElement = $('<div></div>').html(consultationText);
        $('#addedConsultation').append(consultationElement);
    }
    
}

//diagnose
var diagnosesData = [];
  function addDiagnose(diagnose) {
    var selectedDiagnose = `(${diagnose.code}) ${diagnose.name}`;
    var selectedType = diagnose.type;
    var description = diagnose.description;
    switch (selectedType) {
        case "Complication":
            selectedType = "Осложнение";
            break;
        case "Main":
            selectedType = "Основной";
            break;
        case "Concomitant":
            selectedType = "Сопутствующий";
            break;
    }
    if (true) {
        var diagnoseElement = document.createElement('div');
        diagnoseElement.innerHTML = `
            <strong>${selectedDiagnose}</strong><br>
            <div class="text-muted">Тип в осмотре: ${selectedType}</div>
            <div class="text-muted">Расшифровка: ${description}</div><br>
        `;
        $('#addOldDiag').append(diagnoseElement);
        $('#addDiagnose').append(diagnoseElement);
    }
}

//edit dianose
function getId(doctor){
    $.ajax({
    url: 'https://mis-api.kreosoft.space/api/doctor/profile',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'
    },
    success: function (response) {
        checkProperty(doctor,response.id);
    },
    error: function (error, status) {
        console.error("Ошибка при получении профиля:", error);
        if (status == 401)
        {
            window.location.href = '/login';
        }
    }
})};
function checkProperty(doctor, user){
    if(doctor===user)
    {
        $("#modalButton").removeClass('d-none');
    }
}
