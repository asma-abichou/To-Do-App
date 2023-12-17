


/*
$(document).ready(function(){
    $("#list-btn").click(function() {
        // console.log(".list-btn")
        const xhr = new XMLHttpRequest();
       xhr.open("POST", "http://localhost:3000/students");
     //  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
       const body = JSON.stringify({
           id: 150,
           name: "na3ima",
       });
       xhr.onload = () => {
           console.log(xhr);
           if (xhr.readyState == 4 && xhr.status == 201) {
               console.log(JSON.parse(xhr.responseText));
           } else {
               console.log(`Error: ${xhr.status}`);
           }
       };
       xhr.send(body);
    })
})*/

