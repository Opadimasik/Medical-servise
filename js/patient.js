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
.catch(error => {
    console.error('Error fetching data:', error);
});
$('#inputMKB-10').select2({
    placeholder: 'Выбрать'
  });

  function detailInpectionClick(inspectionId) {
    window.location.href = `/inspection/${inspectionId}`;
}
function addInpectionClick(inspectionId) {
    window.location.href = `/inspection/create`;
}
  function renderInspectionCards(page) {
    var container = $('#listOfInspection');
    container.empty();
    console.log(page);
    var style = "";
    var conclusionDate;
    var addInspection = `
    <a class="ms-1 details-link" id="addNestedInspection">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square">
        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
    </svg>
    <span class="ms-2">Добавть осмотр</span>
    </a>
    `;
    page.inspections.forEach(function (inspection) {
      switch(inspection.conclusion)
      {
        case "Death":
        {
            addInspection = "";
            conclusionDate = "смерть";
            style = `style="color: #ffefe8;"`;
        }
        case "Recovery":
        {
            conclusionDate = "смерть";
        }
      }
      var card = `
            <div class="col-lg-6 col-md-6 col-sm-12 mt-3"  >
            <div class="card">
                <div class="card-body">
                <div class="d-flex">
                    <div class="badge bg-secondary ">
                        ${inspection.date.slice(0,10)}
                    </div>
                    <h5 class="ms-1 card-title"><strong>Амбулаторный осмотр</strong></h5>
                    ${addInspection}
                    <a class="ms-1 details-link" onclick="detailInpectionClick('${inspection.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                        </svg>
                        <span class="ms-2">Детали осмотра</span>
                    </a>
                </div>
                </div>
            </div>
            </div>
      `;
      container.append(card);
    });

    for (let i = 1; i <= page.pagination.count; i++) {
        const liClass = i === page.pagination.current ? 'page-item active' : 'page-item';
        const li = `<li class="${liClass}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        $('#pagination').append(li);
    }
  }

function setFirstData()
{
    $.ajax({
        url: 'https://mis-api.kreosoft.space/api/patient/b88ffe05-d950-484d-91f7-b70faa5cef06/inspections?page=1&size=5',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
        success: function (response) {
            renderInspectionCards(response);
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
setFirstData();
$(document).ready(function() {
    
});