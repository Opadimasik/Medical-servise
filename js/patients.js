var authToken = localStorage.getItem('token');
if (!authToken) {
    console.error("Токен авторизации отсутствует.");
    window.location.href = '/login';
}
//var queryString = '';
// var currentName = '';
// var currentConclusions = [];
// var currentSorting = 'NameAsc';
// var currentScheduledVisits = false;
// var currentOnlyMine = false;
// var currentPage = 1;
// var currentSize = 5;

function applyFiltersFromUrl() {
    let params = new URLSearchParams(window.location.search);
    queryString = '';

    currentName = params.has('name') ? params.get('name') : '';
    queryString += currentName;

    //currentConclusions = (params.get('conclusions') || '').split(',');
    currentSorting = params.has('sorting')?params.get('sorting') : '';
    currentScheduledVisits = params.get('scheduledVisits')==='true'? 'true':'';
    currentOnlyMine = params.get('onlyMine') === 'true'?'true':'';
    currentPage = params.has('page')? parseInt(params.get('page')):"";
    currentSize = parseInt(params.get('size')) || 5;
    
}
function setURL()
{
    
}
function loadPage() {
    var queryParams = {
        name: currentName,
        //conclusions: currentConclusions,
        sorting: currentSorting,
        scheduledVisits: currentScheduledVisits,
        onlyMine: currentOnlyMine,
        page: currentPage,
        size: currentSize
    };
    
    var defaultParams = {
        sorting: 'NameAsc',
        scheduledVisits: false,
        onlyMine: false,
        page: 1,
        size: 5
    };

    var filteredParams = Object.fromEntries(
        Object.entries(queryParams)
            .filter(([key, value]) => value !== null && value !== undefined && value !== '' && value !== defaultParams[key])
    );
    
    var queryString = $.param(filteredParams);
    window.history.replaceState({}, '', window.location.pathname + '?' + queryString);
    //window.location.href = '?' + queryString;
    $.ajax({
        url: `https://mis-api.kreosoft.space/api/patient?${queryString}`,
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
}


  function renderPatientCards(patients) {
    var container = $('#listOfPatients');
    container.empty();

    patients.forEach(function (patient) {
      let birthDate = patient.birthday;
      var stringBirthday;
      if (birthDate === null)
      {
        stringBirthday = '';
      }
      else{
        stringBirthday = `<div class="d-flex">
        <p class="card-text text-muted">Дата рождения- </p>
        <p class="card-text">${patient.birthday.slice(0,10)}</p>
    </div>`;
      }
      var card = `
            <div class="col-lg-6 col-md-6 col-sm-12 mt-3" style="cursor: pointer;" onclick="handleCardClick('${patient.id}')">
            <div class="card">
                <div class="card-body">
                <h5 class="card-title">${patient.name}</h5>
                <div class="d-flex">
                    <p class="card-text text-muted">Пол- </p>
                    <p class="card-text">${patient.gender}</p>
                </div>
                ${stringBirthday}
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
  
    var totalButtonsToShow = 5;
    var startPage = Math.max(1, pagination.current - Math.floor(totalButtonsToShow / 2));
    var endPage = Math.min(pagination.count, startPage + totalButtonsToShow - 1);
  
    var previousItem = `<li class="page-item ${pagination.current === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="loadPage(${pagination.current - 1})" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>`;
    paginationContainer.append(previousItem);
  
    for (var i = startPage; i <= endPage; i++) {
      var pageItem = `<li class="page-item ${pagination.current === i ? 'active' : ''}">
        <a class="page-link" href="#" onclick="loadPage(${i})">${i}</a>
      </li>`;
      paginationContainer.append(pageItem);
    }

    var nextItem = `<li class="page-item ${pagination.current === pagination.count ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="loadPage(${pagination.current + 1})" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>`;
    paginationContainer.append(nextItem);
  }
  function handleCardClick(patientId) {
    window.location.href = `/patient/${patientId}`;
}
  

  $(document).ready(function () {
    applyFiltersFromUrl();

    loadPage();

    

    $("#search").click(function () {
        currentName = $("#inputName").val();
        currentConclusions = $("#inputСonclusion").val() || [];
        currentSorting = $("#sortingPatients").val() || 'NameAsc';
        currentScheduledVisits = $("#scheduledVisits").prop('checked');
        currentOnlyMine = $("#onlyMine").prop('checked');
        currentPage = 1; 
        currentSize = $("#inputSize").val() || 5;
        //setURL();
        loadPage();
    });

    $(document).on('click', '#pagination a', function (e) {
        e.preventDefault();
        var pageNumber = $(this).text();
        handlePaginationClick(pageNumber);
    });
});

function handlePaginationClick(pageNumber) {
    currentPage = pageNumber;
    loadPage();
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
            //$("#registerPatientsRequset").text("Пациент зарегестрирован");
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