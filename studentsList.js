$(document).ready(function() {
    let body = $("body")
    $("#addStudentForm").hide();
    const BASE_URL = "http://localhost:3000/students/";
    // GET Request when we refresh the page
    $.ajax({
        url: BASE_URL,
        method: "GET",
        dataType: "json",
        success: function (response) {
            let tableBody = $("table tbody");
            tableBody.empty()

            for (let i = 0; i < response.length; i++) {
                tableBody.append(`<tr class="student" data-studentRow="${response[i].id}">
                    <td class="firstName"><span class="firstNameLabel">${response[i].firstName}</span><input  placeholder="First name..." type="text" class="form-control-sm editFirstName text-center" value="${response[i].firstName}" style="display: none"></td>
                    <td class="lastName"><span class="lastNameLabel">${response[i].lastName}</span><input  placeholder="Last name..." type="text" class="form-control-sm editLastName text-center" value="${response[i].lastName}" style="display: none"></td>
                    <td class="dateOfBirth"><span class="dateOfBirthLabel">${response[i].dateOfBirth}</span><input type="date" class="form-control-sm editDateOfBirth text-center" value="${response[i].dateOfBirth}" style="display: none"></td>
                    <td class="score"><span class="scoreLabel">${response[i].score}</span><input type="number" class="form-control-sm editScore text-center" value="${response[i].score}" style="display: none"></td>
                    <td>
                    <button class="btn btn-primary ms-2 btnEdit">Edit</button>
                    <button class="btn btn-success ms-2 btnSave" style="display: none">Save</button>
                    <button class="btn btn-danger ms-2" data-toggle="modal" data-target="#deleteModal${response[i].id}">Delete</button>
                    <button class="btnDel" style="display: none">Delete</button>
                    </td>
                    <input value="${response[i].id}" type="hidden" class="studentId">
                </tr>`);
            }

            for (let i = 0; i < response.length; i++)
            {
                $( "#addStudentForm" ).after(`
                <div class="modal fade" id="deleteModal${response[i].id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content text-center">
                      <div class="modal-header d-block">
                        <h5 class="modal-title text-center">Warning</h5>
                      </div>
                      <div class="modal-body text-center">
                        Are you sure you want to delete this user ?
                      </div>
                      <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary modalBtnConfirmDelete" data-student="${response[i].id}">Confirm</button>
                      </div>
                    </div>
                  </div>
                </div>`);
            }
            scoreColorCondition()
        },
    });

    function scoreColorCondition()
    {
        let studentsRows = $('.student');
        studentsRows.each(function (i, obj) {
            $(this).removeClass("table-primary")
            $(this).removeClass("table-danger")
        });
        let scoresArray = [];
        studentsRows.each(function (i, obj) {
            scoresArray.push(parseInt($(this).find('.editScore').val()))
        });
        if(scoresArray.length <=1) return;
        let maxVal = Math.max(...scoresArray);
        let minVal = Math.min(...scoresArray)
        studentsRows.each(function (i, obj) {
            let studentScore = $(this).find('.editScore').val()
            if(studentScore == maxVal)
            {
                $(this).addClass("table-primary")
            } else if(studentScore == minVal)
            {
                $(this).addClass("table-danger")
            }
        });
    }

    body.on('click', '.modalBtnConfirmDelete', function(){
        let studentId = $(this).data("student");
        body.find(`[data-studentRow="${studentId}"]`).find('.btnDel').click()
        $(`#deleteModal${studentId}`).modal('hide');
    })

    $("#addStudentBtn").click(function () {
        $("#addStudentForm").toggle();
    });

    function calculateAgeAndVerify(dateOfBirth){
        let birthDateObj = new Date(dateOfBirth);
        let currentDate = new Date();
        return (currentDate.getFullYear() - birthDateObj.getFullYear());
    }

    function renderDomAgeErrorMessage(container,age)
    {
        container.html(`<p style="color: red; font-weight: bolder; font-family: Cambria,serif;">Your age is ${age}. <br> You must be between 20 and 30 years old!</p>`);
    }
    // POST Request to add student
    $("#submitBtn").click(function () {
        let firstName = $("#firstName").val();
        let lastName = $("#lastName").val();
        let dateOfBirth = $("#dateOfBirth").val();
        let score = $("#score").val();
        // Validation form: stop adding if any field is empty
        if ((firstName === "") || (lastName === "") || (dateOfBirth === "") || (score === "")) {
            $("#resultDiv").html(`<p style="color: red; font-weight: bolder; font-family: Cambria,serif;">Please fill in all the fields and retry again!</p>`);
            return;
        }
        // Calculate age and verify: stop adding if age is not correct
        let userAge = calculateAgeAndVerify(dateOfBirth);
        if (userAge < 20 || userAge > 30) {
            renderDomAgeErrorMessage($("#resultDiv"),userAge)
            return;
        }

        $.ajax({
            url: BASE_URL,
            method: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "firstName": firstName,
                "lastName": lastName,
                "dateOfBirth": dateOfBirth,
                "score": score
            }),
            success: function (response) {
                let tableBody = $("table tbody");
                tableBody.append(`<tr class="student" data-studentRow="${response.id}">
                    <td class="firstName"><span class="firstNameLabel">${response.firstName}</span><input placeholder="First name..." type="text" class="form-control-sm editFirstName text-center" value="${response.firstName}" style="display: none"></td>
                    <td class="lastName"><span class="lastNameLabel">${response.lastName}</span><input placeholder="Last name..." type="text" class="form-control-sm editLastName text-center" value="${response.lastName}" style="display: none"></td>
                    <td class="dateOfBirth"><span class="dateOfBirthLabel">${response.dateOfBirth}</span><input type="date" class="form-control-sm editDateOfBirth text-center" value="${response.dateOfBirth}" style="display: none"></td>
                    <td class="score"><span class="scoreLabel">${response.score}</span><input type="number" class="form-control-sm editScore text-center" value="${response.score}" style="display: none"></td>
                    <td>
                    <button  class="btn btn-primary ms-2 btnEdit">Edit</button>
                    <button  class="btn btn-success ms-2 btnSave" style="display: none">Save</button>
                    <button class="btn btn-danger ms-2" data-toggle="modal" data-target="#deleteModal${response.id}">Delete</button>
                    <button class="btnDel" style="display: none">Delete</button>
                    </td>
                    <input value="${response.id}" type="hidden" class="studentId">
                    </tr>`
                )
                $( "#addStudentForm" ).after(`
                <div class="modal fade" id="deleteModal${response.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content text-center">
                      <div class="modal-header d-block">
                        <h5 class="modal-title text-center">Warning</h5>
                      </div>
                      <div class="modal-body text-center">
                        Are you sure you want to delete this user ?
                      </div>
                      <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary modalBtnConfirmDelete" data-student="${response.id}">Confirm</button>
                      </div>
                    </div>
                  </div>
                </div>`);

                $("#resultDiv").empty()
                $('.addStudentInput').val('');
                scoreColorCondition()
            }
        });

    });

    body.on('click', '.btnDel', function()
    {
        let that = $(this)
        let studentId = $(this).parent().next().val();
        // Make an AJAX request to delete the item from the server
       $.ajax({
            url: BASE_URL + studentId,
            type: 'DELETE',
            success: function(response) {
                // Remove the row from table
                that.parent().parent().remove()
                scoreColorCondition()
            },
           error: function(error) {
            console.error('Error deleting student:', error);
        },
       });
    });

    body.on('click','.btnEdit', function() {
        let userDataRow = $(this).parent().parent();
        let allStudentsRows = $(".student")

        // we loop through all students rows and hide inputs and show spans for already active rows
        allStudentsRows.each(function (i, obj) {
            if ($(this).hasClass("active-row")) {
                // Select Inputs
                let firstNameInputToHide = $(this).find('.editFirstName');
                let lastNameInputToHide = $(this).find('.editLastName');
                let dateOfBirthInputToHide = $(this).find('.editDateOfBirth');
                let scoreInputToHide = $(this).find('.editScore');
                // Select Spans
                let firstNameSpanToShow = $(this).find('.firstNameLabel');
                let lastNameSpanToShow = $(this).find('.lastNameLabel');
                let dateOfBirthSpanToShow = $(this).find('.dateOfBirthLabel');
                let scoreSpanToShow = $(this).find('.scoreLabel');
                // Hide Inputs
                firstNameInputToHide.hide();
                lastNameInputToHide.hide();
                dateOfBirthInputToHide.hide();
                scoreInputToHide.hide();
                // Set input values to initial state
                firstNameInputToHide.val(firstNameSpanToShow.text())
                lastNameInputToHide.val(lastNameSpanToShow.text())
                dateOfBirthInputToHide.val(dateOfBirthSpanToShow.text())
                scoreInputToHide.val(scoreSpanToShow.text())
                // Show Spans
                firstNameSpanToShow.show()
                lastNameSpanToShow.show()
                dateOfBirthSpanToShow.show()
                scoreSpanToShow.show()
                // Hide save button & show edit button
                $(this).find('.btnSave').hide()
                $(this).find('.btnEdit').show()
            }
        });
        // Select td
        let firstNameTd = userDataRow.find('.firstName');
        let lastNameTd = userDataRow.find('.lastName');
        let dateOfBirthTd = userDataRow.find('.dateOfBirth');
        let scoreTd = userDataRow.find('.score');
        // Select spans
        let currentFirstNameSpan = firstNameTd.find('.firstNameLabel');
        let currentLastNameSpan = lastNameTd.find('.lastNameLabel');
        let currentDateOfBirthSpan = dateOfBirthTd.find('.dateOfBirthLabel');
        let currentScoreSpan = scoreTd.find('.scoreLabel');
        // Select Hidden Inputs
        let currentFirstNameInput = firstNameTd.find('.editFirstName');
        let currentLastNameInput = lastNameTd.find('.editLastName');
        let currentDateOfBirthInput = dateOfBirthTd.find('.editDateOfBirth');
        let currentScoreInput = scoreTd.find('.editScore');
        // Hide span labels
        currentFirstNameSpan.hide()
        currentLastNameSpan.hide()
        currentDateOfBirthSpan.hide()
        currentScoreSpan.hide()
        // Show Hidden Inputs
        currentFirstNameInput.show()
        currentLastNameInput.show()
        currentDateOfBirthInput.show()
        currentScoreInput.show()
        // we remove class active-row for all the rows except the current one
        allStudentsRows.each(function (i, obj) {
            $(this).removeClass("active-row")
        });
        // add class "active" to the row
        userDataRow.addClass("active-row")
        // hide clicked edit button
        $(this).hide()
        // select save button
        let saveButton = $(this).parent().find('.btnSave')
        saveButton.show()
    })

    $('body').on('click','.btnSave',function(e){
        e.preventDefault()
        let that = $(this)
        let userDataRow = $(this).parent().parent()

        // Select Spans
        let newFirstNameSpan = userDataRow.find('.firstNameLabel');
        let newLastNameSpan = userDataRow.find('.lastNameLabel');
        let newDateOfBirthSpan = userDataRow.find('.dateOfBirthLabel');
        let newScoreSpan = userDataRow.find('.scoreLabel');
        // Select Inputs
        let newFirstNameInput = userDataRow.find('.editFirstName');
        let newLastNameInput = userDataRow.find('.editLastName');
        let newDateOfBirthInput = userDataRow.find('.editDateOfBirth');
        let newScoreInput = userDataRow.find('.editScore');
        // Get Inputs Values
        let newFirstNameInputValue = newFirstNameInput.val();
        let newLastNameInputValue = newLastNameInput.val();
        let newDateOfBirthInputValue = newDateOfBirthInput.val();
        let newScoreInputValue = newScoreInput.val();
        //get the ID of the student
        let studentId = userDataRow.find('.studentId').val()
        //PUT request to update the student
        let userAge = calculateAgeAndVerify(newDateOfBirthInputValue);
        if (userAge < 20 || userAge > 30) {
            renderDomAgeErrorMessage($("#verifyAge"),userAge)
            return;
        }
        $.ajax({
            url: BASE_URL + studentId,
            method: "PUT",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "firstName": newFirstNameInputValue,
                "lastName": newLastNameInputValue,
                "dateOfBirth": newDateOfBirthInputValue,
                "score" : newScoreInputValue
            }),
            success: function (response) {
                newFirstNameInput.val(response.firstName)
                newFirstNameSpan.text(response.firstName)
                newLastNameInput.val(response.lastName)
                newLastNameSpan.text(response.lastName)
                newDateOfBirthInput.val(response.dateOfBirth)
                newDateOfBirthSpan.text(response.dateOfBirth)
                newScoreInput.val(response.score)
                newScoreSpan.text(response.score)
                // Hide Inputs
                newFirstNameInput.hide()
                newLastNameInput.hide()
                newDateOfBirthInput.hide()
                newScoreInput.hide()
                // Show Spans
                newFirstNameSpan.show()
                newLastNameSpan.show()
                newDateOfBirthSpan.show()
                newScoreSpan.show()
                // Hide save button & show edit button
                that.hide()
                let editButton = that.parent().find('.btnEdit')
                editButton.show()
                scoreColorCondition()
                $("#verifyAge").empty()
            },
            error: function (error) {
                console.error('Error updating student:', error);
            }
        })
    });
});