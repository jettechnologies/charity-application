// importing needed functions from main.js
import * as mainfunctions from "./utils.js";

// creating a new objec that will hold all methods on our exported class
const easyHttp = new mainfunctions.EasyHTTP;

const [...ctaBtn] = document.querySelectorAll(".cta");
const registrationForm = document.getElementById("registration_form");

// Document loading to get the token from localstorage.
document.addEventListener("DOMContentLoaded", () =>{
    if(localStorage.getItem("userInfo") !== null){
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const userRole = userInfo.pop(),
              agencyfield = document.getElementById("agency");

        if(userRole !== "agency"){
            agencyfield.parentElement.classList.add("div-deactive");
        }
    
        let header, data;

        data = {
            email: userInfo[0],
            password: userInfo[1]
        }

        console.log(data, userRole)
        // header = {
        //     "Accept": "application/json",
        //     'Content-type': 'application/json'
        // };
        // // this.submit();
        // // mainfunctions.redirect(e, location);
        // easyHttp.post("https://charity-app-production.up.railway.app/api/auth/login", header, data)
        //     .then(data => {
        //         let token = data.token;

        //         if(localStorage.getItem("token") !== null){
        //             localStorage.removeItem("token");

        //             localStorage.setItem("token", token);
        //         }


        //     });

            // localStorage.removeItem("userInfo");
    }
});
ctaBtn.forEach(cta =>{
    cta.addEventListener("click", divToggler);
});
registrationForm.addEventListener("submit", validateForm);

mainfunctions.checkInputValidity();

function divToggler(e){
    const displayCongrat = document.querySelector(".display-congrat");
    const registration = document.querySelector(".registration");

    if(e.target.value === "registration"){
        registration.classList.toggle("d-flex");
        displayCongrat.classList.toggle("div--deactive");
        console.log(registration);
    }
    else{
        location = "dashboard.html";

        this.submit();
        mainfunctions.redirect(e, location);
    }
}

// function registration form inputs
function validateForm(e){
    e.preventDefault();

    const agency = document.getElementById("agency"),
          address = document.getElementById("address"),
          phone1 = document.getElementById("phone1"),
          phone2 = document.getElementById("phone2"),
          gender = document.getElementById("gender"),
          phone =   phone1.value.concat(`,${phone2.value}`);
          if(agency.value === ""
            || address.value === ""
            || phone1.value === ""
            || phone2.value === ""
            || gender.value === ""){
            const msg = "All fields are required"
            const paragraph = mainfunctions.displayMessage(msg, "danger");
        
            this.insertBefore(paragraph, this.firstChild);
            agency.setAttribute("disabled", null);
            address.setAttribute("disabled", null);
            phone1.setAttribute("disabled", null);
            phone2.setAttribute("disabled", null);
            gender.setAttribute("disabled", null);

            setTimeout(() =>{
                this.removeChild(paragraph);
                agency.removeAttribute("disabled", null);
                address.removeAttribute("disabled", null);
                phone1.removeAttribute("disabled", null);
                phone2.removeAttribute("disabled", null);
                gender.removeAttribute("disabled", null);
            }, 2000);
          }
          else{
                if(localStorage.getItem("token") !== ""){
                    const token = localStorage.getItem("token");
                    const decodeToken = JSON.parse(atob(token.split('.')[1])),
                          userInfo = decodeToken.user;
                    const data = {
                        address : address.value,
                        phone : phone
                        // gender : gender.value
                    },
                    url = `https://charity-app.up.railway.app/api/user/${userInfo._id}`,
                    header = {
                        "Accept": "application/json",
                       'Content-type': 'application/json',
                       "Authorization" : `Bearer ${token}`
                    };
                    // console.log(data, userInfo._id);

                    easyHttp.patch(url, header, data)
                    .then(()=>{
                        mainfunctions.redirect("dashboard.html");
                    })
                    .catch(error =>{
                        console.log(error);
                    });
                }
                
          }
}