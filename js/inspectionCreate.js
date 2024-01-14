var patientId = localStorage.getItem('patientId');
var authToken = localStorage.getItem('token');
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
$.ajax({
    url: `https://mis-api.kreosoft.space/api/patient/${patientId}`,
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
        else if(status === 404)
        {
            window.location.href = 'patients';
        }
    }
});

var inputMKBSelect = document.getElementById('inputMKB-10');
fetch('https://mis-api.kreosoft.space/api/dictionary/icd10/roots')
.then(response => response.json())
.then(data => {
    data.forEach(specialty => {
        var option = document.createElement('option');
        option.value = specialty.id;
        option.text = specialty.name;
        inputMKBSelect.appendChild(option);
    });
})

$('#inputSpeciality').select2({
    placeholder: 'Специализация консультанта'
  });

// date control
var datetimeControl = document.getElementById("inputInspectDate");
var now = new Date().toISOString().split('.')[0];
datetimeControl.max = now;

console.log(localStorage.getItem('preInspectionId'));

// previous inspection
$('#isFirstInspect').change(function() {
    if (this.checked) {
        $('#preInspectionGroup').removeClass('d-none');
    } else {
        $('#preInspectionGroup').addClass('d-none');
    }

    if (!this.checked) {
        datetimeControl.min = ''; 
    }

});

$('#inputPreInspection').select2({
    placeholder: 'Выберите осмотр'
  });
var preInspectionId = localStorage.getItem('preInspectionId');
function getPreviousInspection()
{
    var inputPreInspection = document.getElementById('inputPreInspection');
    $.ajax({
        url: `https://mis-api.kreosoft.space/api/patient/${patientId}/inspections/search`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
        success: function (response) {
            response.forEach(inspection => {
                var option = document.createElement('option');
                option.value = inspection.id;
                option.date = inspection.date;
                option.text = `${inspection.date} ${inspection.diagnosis.code} - ${inspection.diagnosis.name}`;
                inputPreInspection.appendChild(option);

                if (preInspectionId !== null && preInspectionId === inspection.id) {
                    option.selected = true;
                    datetimeControl.min = option.date;
                }
            });
        },
        error: function (error, status) {
            console.error("Ошибка при получении профиля:", error);
            if (status === 401)
            {
                window.location.href = '/login';
            }
            else if(status === 404)
            {
                window.location.href = 'patients';
            }
        }
    });
}
getPreviousInspection();

if(preInspectionId!==null)
{
    $("#isFirstInspect").prop("checked", true);
    $('#preInspectionGroup').removeClass('d-none');
}

$('#inputPreInspection').change(function() {
    if (this.options[this.selectedIndex]) {
        var selectedDate = this.options[this.selectedIndex].date;
        datetimeControl.min = selectedDate;
    }
});

// consultation
$('#isConsultation').change(function() {
    var isConsultationRequired = this.checked;
    $('#inputSpeciality').prop('disabled', !isConsultationRequired);
    $('#consultationComment').prop('disabled', !isConsultationRequired);
    $('#addConsultation').prop('disabled', !isConsultationRequired);
});

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

$('#addConsultation').click(function() {
    var isConsultationRequired = $('#isConsultation').prop('checked');
    var specialityValue = $('#inputSpeciality option:selected').text();
    var commentValue = $('#consultationComment').val();

    if (commentValue.trim() !== '') {
        var consultationText = 'Требуется ' + (isConsultationRequired ? '<strong>' + specialityValue + '</strong>' : 'консультация') +
            '<br>Комментарий: <span class="text-muted">' + commentValue + '</span>';

        var consultationElement = $('<div></div>').html(consultationText);
        $('#addedConsultation').append(consultationElement);

        $('#isConsultation').prop('checked', false);
        $('#inputSpeciality').val('').prop('disabled', true);
        $('#consultationComment').val('').prop('disabled', true);
        $('#addConsultation').val('').prop('disabled', true);

        $('#inputSpeciality option').filter(function() {
            return $(this).text() === specialityValue;
        }).remove();
    }
    else {
        alert('Пожалуйста, оставьте комментарий перед добавлением консультации.');
    }
});

//diagnosis
$('#inputMKB-10').select2({
    ajax: {
      url: 'https://mis-api.kreosoft.space/api/dictionary/icd10',
      dataType: 'json',
      delay: 250,
      data: function (params) {
        return {
          request: params.term,
          page: params.page,
          size: 10 
        };
      },
      processResults: function (data, params) {
        params.page = params.page || 1;

        return {
          results: data.records.map(function(item) {
            return {
              id: item.id,
              text: `${item.code}- ${item.name}`
            };
          }),
          pagination: {
            more: (params.page * 10) < data.pagination.count
          }
        };
      },
      cache: true
    },
    placeholder: 'Выбрать',
    minimumInputLength: 1 
  });

  function addDiagnose() {
    var selectedDiagnose = $('#inputMKB-10 option:selected').text();
    var selectedType = $('input[name=radioInline]:checked').val();
    var description = $('#diagnosDescription').val();
    console.log(selectedType);
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
    if (selectedDiagnose && selectedType && description !== null) {
        var diagnoseElement = document.createElement('div');
        diagnoseElement.innerHTML = `
            <strong>${selectedDiagnose}</strong><br>
            <div class="text-muted">Тип в осмотре: ${selectedType}</div>
            <div class="text-muted">Расшифровка: ${description}</div><br>
        `;

        $('#addDiagnose').append(diagnoseElement);

        $('#inputMKB-10').val('').trigger('change');
        $('#diagnosDescription').val('');
        $('input[name=radioInline]').prop('checked', false);

        $('#mainDiagnose').prop('disabled', true);
        $('#concomitantDiagnose').prop('disabled', false);
        $('#complicationDiagnose').prop('disabled', false);
    } else {
        alert('Заполните все поля!');
    }
}

//Conclusion
var conclusionSelect = $('#inputСonclusion');
var visitDateInput = $('#inputVisitDateGroup');

conclusionSelect.on('change', function() {
    var selectedConclusion = conclusionSelect.val();
    switch (selectedConclusion) {
        case 'Disease':
            visitDateInput.removeClass('d-none');
            break;
        case 'Recovery':
            visitDateInput.addClass('d-none');
            break;
        case 'Death':
            visitDateInput.removeClass('d-none');
            $("#inputInspectDateLabel").text("Дата и время смерти")
            break;
        default:
            // visitDateInput.attr('disabled', 'true');
            break;
    }
});


$("#register").click(function(){
    window.location.href = `/patient/${patientId}`
})

var isFirstInspect = $('#isFirstInspect').prop('checked');
var previousInspectionId = isFirstInspect ? `"previousInspectionId": "${preInspectionId}",` :"";
var inspectDate = $('#inputInspectDate').val();
var complaints = $('#complaints').val();
var anamnesis = $('#anamnesis').val();
var isConsultationRequired = $('#isConsultation').prop('checked');
var specialityId = isConsultationRequired ? $('#inputSpeciality').val() : null;
var consultationComment = isConsultationRequired ? $('#consultationComment').val() : null;
var diagnoses = [];

$('#addDiagnose').find('div').each(function(index, element) {
    var selectedDiagnose = $(element).find('strong').text();
    var selectedType = $(element).find('.text-muted').eq(0).text().replace('Тип в осмотре: ', '');
    var description = $(element).find('.text-muted').eq(1).text().replace('Расшифровка: ', '');

    var diagnose = {
        icdDiagnosisId: selectedDiagnose.id,
        description: description,
        type: selectedType
    };

    diagnoses.push(diagnose);
});

// Получение данных о заключении
var selectedConclusion = $('#inputСonclusion').val();
var nextVisitDate = null;
var deathDate = null;

if (selectedConclusion === 'Disease' || selectedConclusion === 'Death') {
    nextVisitDate = $('#inputVisitDate').val();
}

if (selectedConclusion === 'Death') {
    deathDate = $('#inputVisitDate').val();
}

// Формирование объекта запроса
var inspectionData = {
    date: inspectDate,
    isFirstInspect: isFirstInspect,
    preInspectionId: preInspectionId,
    complaints: complaints,
    anamnesis: anamnesis,
    consultation: {
        isRequired: isConsultationRequired,
        specialityId: specialityId,
        comment: consultationComment
    },
    diagnoses: diagnoses,
    conclusion: {
        conclusion: selectedConclusion,
        nextVisitDate: nextVisitDate,
        deathDate: deathDate
    }
};

$('#login').click(function()
{
    console.log(inspectionData);
    $.ajax({
        url: `https://mis-api.kreosoft.space/api/patient/${patientId}/inspections`,
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(inspectionData),
        success: function (response) {
            // Обработка успешного ответа сервера
            console.log(response);
        },
        error: function (error, status) {
            // Обработка ошибки
            console.error("Ошибка при создании осмотра:", error);
            if (status === 401) {
                window.location.href = '/login';
            }
        }
    });
});

