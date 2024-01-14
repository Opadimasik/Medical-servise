var authToken = localStorage.getItem('token');
var fullUrl = window.location.href;

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


function createInspectioncard(cardClass,style,buttonClass,inspection,conclusionDate,mainDiagnosis,offset="",buttonMinus="d-none", buttonPlus="")
{
    var card = `
            <div class="col-lg-${cardClass} col-md-12 col-sm-12 mt-3 "  ${offset}>
            <div class="card " ${style}>
                <div class="card-body" value="${inspection.id}">
                <div class="d-flex">
                <button type="submit" class="common ${buttonClass} btn btn-primary" onClick="inspectionChain('${inspection.id}')"  id="inspectionSearchButton">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg ${buttonPlus}" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg"  width="16" height="16" fill="currentColor" class="bi bi-dash ${buttonMinus}" viewBox="0 0 16 16">
                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                </svg>
                </button>
                    <div class="badge bg-secondary ">
                        ${inspection.date.slice(0,10)}
                    </div>
                    <h5 class="ms-1 card-title"><strong>Амбулаторный осмотр</strong></h5>
                    <a class="ms-1 details-link" onclick="detailInpectionClick('${inspection.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                        </svg>
                        <span class="ms-2">Детали осмотра</span>
                    </a>
                </div>
                <div class="d-flex">
                    <p class="card-text">Заключение:&nbsp</p>
                    <p class="card-text">${conclusionDate}</p>
                </div>
                <div class="d-flex">
                    <p class="card-text">Оснвоной диагноз:&nbsp</p>
                    <p class="card-text"><strong>${mainDiagnosis}</strong></p>
                </div>
                <div class="d-flex">
                    <p class="card-text text-muted">Медицинский работник:&nbsp </p>
                    <p class="card-text">${inspection.doctor}</p>
                </div>
                </div>
            </div>
            </div>
      `;
      return card;
}
function inspectionChain(inspectionId1){
    const searchButton = $(".card-body[value='" + inspectionId1 + "']");;
      searchButton.on('click', function() {
          const chainUrl = `https://mis-api.kreosoft.space/api/inspection/${inspectionId1}/chain`;
          var style = "";
          var conclusionDate;
          var buttonClass = "d-none";
          var cardClass = "6";
          if ($('input[name=radioInline]:checked').val() === "grouped") 
          {
              cardClass = "12";
              buttonClass = ""
          }
          $.ajax({
              url: chainUrl,
              method: 'GET',
              headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            },
              success: function(response) {
                console.log("fssvfdbgddgs");
                var cardNested = 6;
                var i = 0;
                response.reverse();
                response.forEach(function(inspection) {
                    switch(inspection.conclusion)
                    {
                    case "Death":
                    {
                        conclusionDate = "смерть";
                        style = `style="background-color: #ffefe8;"`;
                        break;
                    }
                    case "Recovery":
                    {
                        conclusionDate = "выздоровление";
                        style = ``;
                        break;
                    }
                    case "Disease":
                    {
                        conclusionDate = "болезнь";
                        style = ``;
                        break;
                    }
                    }
                    if(inspection.hasNested === false)
                    {
                        buttonMinus="";
                        buttonPlus="d-none";
                    }
                    const mainDiagnosis = inspection.diagnosis.name;
                      cardNested = cardNested < 6 ? 6 : cardNested + 2;
                      const nestedCard = createInspectioncard(`${cardNested}`,style,buttonClass,inspection,conclusionDate,mainDiagnosis,`style="float: right;"`,buttonMinus,buttonPlus);
                      if(i = 0)searchButton.closest('.card').after(nestedCard);
                      else searchButton.closest('.card').closest('.card').after(nestedCard);
                      i += 1;
                  });
              },
              error: function(error) {
                  console.error('Error fetching nested inspections:', error);
              }
          });
      });
}
  function renderInspectionCards(page) {
    var container = $('#listOfInspection');
    container.empty();
    $('#pagination').empty();
    console.log(page);
    var style = "";
    var conclusionDate;
    var buttonClass = "d-none";
    var cardClass = "6";
    if ($('input[name=radioInline]:checked').val() === "grouped") 
    {
        cardClass = "12";
        buttonClass = ""
    }
    page.inspections.forEach(function (inspection) {
        switch(inspection.conclusion)
        {
          case "Death":
          {
              conclusionDate = "смерть";
              style = `style="background-color: #ffefe8;"`;
              break;
          }
          case "Recovery":
          {
              conclusionDate = "выздоровление";
              style = ``;
              break;
          }
          case "Disease":
          {
              conclusionDate = "болезнь";
              style = ``;
              break;
          }
        }
      const mainDiagnosis = inspection.diagnosis.name;
      var card = createInspectioncard(cardClass,style,buttonClass,inspection,conclusionDate,mainDiagnosis);

      container.append(card);
    });

    for (let i = 1; i <= page.pagination.count; i++) {
        console.log(i);
        const liClass = i === page.pagination.current ? 'page-item active' : 'page-item';
        const li = `<li class="${liClass}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        $('#pagination').append(li);
    }
  }

  
  $(document).on('click', '.add-link', function() {
    var cardBody = $(this).closest('.card-body');
    var inspectionId = cardBody.attr('value');
    inspectionChain(inspectionId);
});
function loadInspectionPage(page, size,request="")
{
    $.ajax({
        url: `https://mis-api.kreosoft.space/api/consultation?${request}page=${page}&size=${size}`,
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
loadInspectionPage(1,5);
$(document).ready(function() {
    
});
$('#pagination').on('click', 'a', function (e) {
    e.preventDefault();
    const page = $(this).data('page');
    var request = "";
    var selectedValues = $("#inputMKB-10").val();
    var categoryMKB = selectedValues.map(value => `icdRoots=${value}&`).join('');
    var pageSize = $("#inputSize").val();
    var selectedValue = $('input[name=radioInline]:checked').val();
    if(selectedValues != null)
    {
        request += categoryMKB;
    }
    if (selectedValue === "grouped")
    {
        request += "grouped=true&";
    }
    loadInspectionPage(page,pageSize,request);
});

$("#search").click(function(){
    var request = "";
    var selectedValues = $("#inputMKB-10").val();
    var categoryMKB = selectedValues.map(value => `icdRoots=${value}&`).join('');
    var pageSize = $("#inputSize").val();
    var selectedValue = $('input[name=radioInline]:checked').val();
    if(selectedValues != null)
    {
        request += categoryMKB;
    }
    if (selectedValue === "grouped")
    {
        request += "grouped=true&";
    }
    loadInspectionPage(1,pageSize,request);
});