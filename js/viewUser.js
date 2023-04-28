// importing needed functions from main.js
import * as mainfunctions from "./utils.js";

// creating a new objec that will hold all methods on our exported class
const easyHttp = new mainfunctions.EasyHTTP;

const [...userFilterField] = document.querySelectorAll(".user-filter"),
      userTable = document.querySelector("[data-user-table]"),
      tableBody = document.getElementById("user-table-body");
let rowArr = [];
userFilterField.forEach(userFilter => {
    userFilter.addEventListener("input", userSearch);
    userFilter.addEventListener("blur", refreshPage);
});

tableBody.addEventListener("click", deleteUser);
// loading the details of all users from DB
document.addEventListener("DOMContentLoaded", () =>{
    const url = " https://charity-app.up.railway.app/api/user/all";

    easyHttp.get(url)
    .then(data =>{
        rowArr = data.map((user, index) => {
            let indexNo = index + 1;

                const tableRow = createTableUI(user, indexNo);
                return {fullname: user.fullname, email: user.email, element: tableRow};
            // createTableUI(user, indexNo);
            // console.log(tableBody.children);
        });

    });
    
});



// trying out a new way

function createTableUI(user, index){
    const tableRow = userTable.content.cloneNode(true).children[0];
            const userFullName = tableRow.querySelector("[data-user-fullname]"),
                  userEmail = tableRow.querySelector("[data-user-email]"),
                  userRole = tableRow.querySelector("[data-user-role]"),
                  joinedAt = tableRow.querySelector("[data-user-createdAt]"),
                  rowId = tableRow.querySelector("[data-index]"),
                  userId = tableRow.querySelector("[data-user-id]");

                userFullName.textContent = user.fullname;
                userEmail.textContent = user.email;
                userRole.textContent = user.role;
                const joinedAtText =  user.createdAt.split("T");
                joinedAt.textContent = joinedAtText[0];
                rowId.textContent = index;
                userId.textContent = user._id;

                tableBody.append(tableRow);

            return tableRow;

}

function userSearch(e){
    const userFilter = e.target,
          filterType = e.target.type;
    
    if(userFilter.value !== ""){
        
        if(filterType === "text"){
            rowArr.forEach(row =>{
                const isVisible = 
                row.fullname.toLowerCase().includes(userFilter.value.toLowerCase());
                row.element.classList.toggle("div--deactive", !isVisible);
                
            });
            if(userFilter.value === ""){
                console.log("empty")
            }
        }
        else if(filterType === "email"){
            rowArr.forEach(row =>{
                const isVisible = 
                row.email.toLowerCase().includes(userFilter.value.toLowerCase());
                row.element.classList.toggle("div--deactive", !isVisible);
            });
            if(userFilter.value === ""){
                console.log("empty")
            }
        }
    }
}

// refresh page function
function refreshPage(e){
    window.location.reload();
}

// create the delete function from an event delegation
function deleteUser(e){
    if(e.target.classList.contains("user-action-btn")){
        const btnContainer = e.target.parentElement;
        let userId = btnContainer.nextElementSibling;
        userId = userId.textContent;

        // making the api call to delete user
        if(confirm("do you want to delete this user")){
            if(localStorage.getItem("token") !== null || localStorage.getItem("token") !== ""){
                const token = localStorage.getItem("token"),
                      url = `https://charity-app.up.railway.app/api/user/deleteuser/${userId}`,
                      header = {
                        "Accept": "application/json",
                        'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json'
                      };
    
                let msg = "User has been deleted"
                      
                console.log(url);
                easyHttp.delete(url, header, msg)
                .then(data => alert(data));

            }
        }
    }
}