// let params = new URLSearchParams();
// params.set('Sasha','verygoodboy');
// window.location.search = params;
$(document).ready(function () {
    var authToken = localStorage.getItem('token');
    if (!authToken) {
        console.error("Токен авторизации отсутствует.");
        window.location.href = '/login';
        return;
    }

    $.ajax({
        url: 'https://mis-api.kreosoft.space/api/patient?page=20&size=5',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + authToken,
          'Content-Type': 'application/json'
        },
        success: function (response) {
          renderPatientCards(response.patients);
          renderPagination(response.pagination);
        },
        error: function (error, status) {
          console.log(error, status);
          if (error.status === 401) {
            window.location.href = '/login';
          }
        }
      });
    
      function renderPatientCards(patients) {
        var container = $('#listOfPatients');
        container.empty();
    
        patients.forEach(function (patient) {
          var card = `
                <div class="col-lg-6 col-md-6 col-sm-12 mt-3" style="cursor: pointer;" onclick="handleCardClick('${patient.id}')">
                <div class="card">
                    <div class="card-body">
                    <h5 class="card-title">${patient.name}</h5>
                    <div class="d-flex">
                        <p class="card-text" style="opacity: 0.7;">Пол- </p>
                        <p class="card-text">${patient.gender}</p>
                    </div>
                    <div class="d-flex">
                        <p class="card-text" style="opacity: 0.7;">Дата рождения- </p>
                        <p class="card-text">${patient.birthday}</p>
                    </div>
                    </div>
                </div>
                </div>
          `;
          container.append(card);
        });
      }
    
      function renderPagination(pagination) {
        var paginationContainer = $('#pagination');
        paginationContainer.empty();
    
        for (var i = 1; i <= pagination.count; i++) {
          var pageItem = `<li class="page-item"><a class="page-link" onclick="loadPage(${i})">${i}</a></li>`;
          paginationContainer.append(pageItem);
        }
      }
    
      function loadPage(pageNumber) {
        $.ajax({
          url: `https://mis-api.kreosoft.space/api/patient?conclusions=&page=${pageNumber}&size=5`,
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
          },
          success: function (response) {
            renderPatientCards(response.patients);
          },
          error: function (error, status) {
            console.log(error, status);
            if (error.status === 401) {
              window.location.href = '/login';
            }
          }
        });
      }
    
      function handleCardClick(patientId) {
    
        window.location.href = `/patient-details?id=${patientId}`;
      }




    $("#registerPatientsRequset").click(function () {
        var validate = true;
        var inputName = $("#inputNameReg").val();
        var inputGender = $("#inputGender").val();
        var inputDate = $("#inputBirthDate").val();

        var regData = {
            name: inputName,
            gender: inputGender,
            birthday: inputDate,
        };
        console.log(regData);
        if (inputName === "") {
            $("#inputNameReg").css("border-color", "red");
            $("#infoNameReg").text("Обязательно поле");
            validate= false;
        } else {
            $("#inputNameReg").css("border-color", "");
            $("#infoNameReg").text("");
        }

        $.ajax({
            url: 'https://mis-api.kreosoft.space/api/patient',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(regData),
            success: function (response) {
                console.log("Профиль успешно обновлен:", response);
            },
            error: function (error,status) {
                console.log(error,status);
                if (error.status === 401)
                {
                    window.location.href = '/login';
                }
            }
        });
    });
    
});