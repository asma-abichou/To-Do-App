$("#addStudentForm").hide();
$(document).ready(function() {

    // Get Request when we refresh the page
    $.ajax({
        url: "http://localhost:3000/students",
        method: "GET",
        dataType: "json",
        success: function (response) {
            let tableBody = $("table tbody");
            tableBody.empty();
            for (let i = 0; i < response.length; i++) {
                /*let tr = $("<tr></tr>")
                let tdName = $("<td></td>").text(response[i].firstName);
                let tdLastName = $("<td></td>").text(response[i].lastName);
                let tdDateOfBirth = $("<td></td>").text(response[i].dateOfBirth);
                tr.append(tdName, tdLastName, tdDateOfBirth);*/
                // 2nd method
                tableBody.append(`<tr id="trow"><td class="firstName">${response[i].firstName}</td>
                <td class="lastName">${response[i].lastName}</td>
                <td class="dateOfBirth">${response[i].dateOfBirth}</td>
                <td><button class="btn btn-success disabled">show</button>
                <button class="btn btn-primary ms-2 btnEdit">edit</button>
                <button class="btn btn-danger ms-2 btnDel">delete</button>
                </td><input value="${response[i].id}" type="hidden">
                </tr>`);

            }
        },
    });

    $("#addStudentBtn").click(function () {
        $("#addStudentForm").toggle();
        // 2nd method
        /*if ($("#addStudentForm").is(":visible")) {
            $("#addStudentForm").fadeOut(500);
        } else {
            $("#addStudentForm").fadeIn(500);
        }*/
    });

    // Post Request to add student
    $("#submitBtn").click(function () {
        let firstName = $("#firstName").val();
        let lastName = $("#lastName").val();
        let dateOfBirth = $("#dateOfBirth").val();

        $.ajax({
            url: "http://localhost:3000/students",
            method: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "firstName": firstName,
                "lastName": lastName,
                "dateOfBirth": dateOfBirth
            }),
            success: function (response) {
               // console.log(response);
                let tableBody = $("table tbody");
               /* let tr = $("<tr></tr>");
                let tdName = $("<td></td>").text(response.firstName);
                let tdLastName = $("<td></td>").text(response.lastName);
                let tdDateOfBirth = $("<td></td>").text(response.dateOfBirth);
                let tdActions = $("<td></td>");
                let deleteButton = $("<button>Delete</button>")
                tr.append(tdName, tdLastName, tdDateOfBirth,deleteButton);*/
                tableBody.append(`<tr id="trow">
                    <td class="firstName">${response.firstName}</td>
                    <td class="lastName">${response.lastName}</td>
                    <td class="dateOfBirth">${response.dateOfBirth}</td>
                    <td><button class="btn btn-success disabled">show</button>
                    <button  class="btn btn-primary ms-2 btnEdit">edit</button>
                    <button class="btn btn-danger ms-2 btnDel">delete</button>
                    </td><input value="${response.id}" type="hidden">
                    </tr>`
                );
            }
        });
        $('.addStudentInput').val('');
    });



    $('body').on('click', '.btnDel', function(){
        let that = $(this)
       let studentId = $(this).parent().next().val();
        // Make an AJAX request to delete the item from the server
       $.ajax({
            url: 'http://localhost:3000/students/' + studentId,
            type: 'DELETE',
            success: function(response) {
                // Remove the row from table
             that.parent().parent().remove()
                console.log('student deleted successfully from the server');
            },
           error: function(error) {
            console.error('Error deleting student:', error);
        },
       //$(this).closest('tr').remove();
       });
    });

    $('body').on('click','.btnEdit', function(){

        let userData = $(this).closest('tr');
        //console.log($(this).closest('tr'))
        let firstNameData = userData.find('.firstName');
         //console.log(userData.find('.firstName'));
        let lastNameData = userData.find('.lastName');
        let dateOfBirthData = userData.find('.dateOfBirth');
        let editButton = userData.find('.btnEdit');

        let currentFirstName = firstNameData.text();
        let currentLastName = lastNameData.text();
        let currentDateOfBirth = dateOfBirthData.text();
        //console.log(firstNameData.text());
        firstNameData.html('<input type="text" class="form-group col-md-6 editFirstName" value="' + currentFirstName + '">');
        lastNameData.html('<input type="text" class="form-group col-md-6 editLastName " value="' + currentLastName + '">');
        dateOfBirthData.html('<input type="date" class="form-group editDateOfBirth" value="' + currentDateOfBirth + '">');
        editButton.text('Save').addClass('saveBtn');
        console.log(editButton)
        $('.saveBtn').on('click',function(){
            let that = $(this)
            //get the val of all fields
            let newFirstName = $('.editFirstName').val();
            let newLastName = $('.editLastName ').val();
            let newDateOfBirth = $('.editDateOfBirth').val();
            console.log(newFirstName)
            console.log(newLastName)
            console.log(newDateOfBirth)

            //get value of fields
            firstNameData.text(newFirstName);
            lastNameData.text(newLastName);
            dateOfBirthData.text(newDateOfBirth);

            //get the ID of the student
          let  studentId = that.parent().next().val()
            console.log(studentId)
            //post request to update the student
        $.ajax({
            url: 'http://localhost:3000/students/'+ studentId,
            method: "PUT",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({

                "firstName": newFirstName,
                "lastName": newLastName,
                "dateOfBirth": newDateOfBirth
            }),
            success: function (response) {
                console.log('Student updated successfully:', response);
            },
            error: function (error) {
                console.error('Error updating student:', error);
            }
        });
            editButton.text('Edit').removeClass('saveBtn');
        });
    });
});






















    /*function deleteRow(ele){
        let table = $('#tbody')[0];
        let rowCount = table.rows.length;
        if(rowCount <= 1){
            alert("There is no row available to delete!");
            return;
        }
        if(ele){
            //delete specific row
            $(ele).parent().parent().remove();
        }
        else{
            //delete last row
            table.deleteRow(rowCount-1);
        }
    }
     $('#tbody').on("click", "#deleteBtn", function () {
          console.log("hi")
       })
       $("#deleteBtn").click (function()
       {

       })*/
















































   /* $("#submitBtn").click(function() {
        let firstName = $("#firstName").val();
        let lastName = $("#lastName").val();
        let dateOfBirth = $("#dateOfBirth").val();
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/students");
        xhr.setRequestHeader("Accept", "application/json");
        let requestData = JSON.stringify({
            "firstName": firstName,
            "lastName": lastName,
            "dateOfBirth": dateOfBirth
        });
        console.log("Request Data:", requestData);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log("Response Data:", xhr.responseText);
                let responseData = JSON.parse(xhr.responseText);
                console.log(responseData);
                let tableBody = $("table tbody");
                let tr = $("<tr></tr>");
                let tdName = $("<td></td>").text(responseData.firstName);
                let tdLastName = $("<td></td>").text(responseData.lastName);
                let tdDateOfBirth = $("<td></td>").text(responseData.dateOfBirth);
                tr.append(tdName, tdLastName, tdDateOfBirth);
                tableBody.append(tr);
            }
        };
        xhr.send(requestData);
    });
    });*/


















/*$(document).ready(function(){
    $("#list-btn").click(function() {
        fetch("http://localhost:3000/students")
            .then(response => {
                console.log(response);
            })
            .then(students => {
                console.log(students);
            })
            .catch(error => {
                console.log(error);
            });
    });

});*/


/*$(document).ready(function(){
    $("tr").click(function() {
        let studentId = $(this).data("id");
        console.log(studentId)
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:3000/students");
        xhr.send();
        xhr.responseType = "json";
        xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.response);
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };

    })
})*/