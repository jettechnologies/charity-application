// importing needed functions from main.js
import * as mainfunctions from "./utils.js";

// creating a new objec that will hold all methods on our exported class
const easyHttp = new mainfunctions.EasyHTTP;

const [...ctaBtn] = document.querySelectorAll(".cta");
const registrationForm = document.getElementById("registration_form");

// Document loading to get the token from localstorage.
document.addEventListener("DOMContentLoaded", () =>{
    if(localStorage.getItem("userInfo") !== ""){
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        // const userRole = userInfo.pop(),
        //       agencyfield = document.getElementById("agency");
    
        let header, data;

        data = {
            email: userInfo[0],
            password: userInfo[1]
        }

        console.log(data)
        header = {
            "Accept": "application/json",
            'Content-type': 'application/json'
        };
        easyHttp.post("https://charity-app.up.railway.app/api/auth/login", header, data)
            .then(data => {
                let token = data.token;

                if(localStorage.getItem("token") !== ""){
                    localStorage.removeItem("token");

                    localStorage.setItem("token", token);
                }

                console.log(token);


            });

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
        if(localStorage.getItem("userInfo") !== ""){
            localStorage.removeItem("userInfo");
            location = "dashboard.html";
            mainfunctions.redirect(e, location);
        }
        
    }
}

// function registration form inputs
function validateForm(e){
    e.preventDefault();

    const address = document.getElementById("address"),
          phone1 = document.getElementById("phone1"),
          phone2 = document.getElementById("phone2"),
          phone =   phone1.value.concat(`,${phone2.value}`);

          if(address.value === ""
            || phone1.value === ""
            || phone2.value === ""){
            const msg = "All fields are required"
            const paragraph = mainfunctions.displayMessage(msg, "danger");
        
            this.insertBefore(paragraph, this.firstChild);
            address.setAttribute("disabled", null);
            phone1.setAttribute("disabled", null);
            phone2.setAttribute("disabled", null);

            setTimeout(() =>{
                this.removeChild(paragraph);
                address.removeAttribute("disabled", null);
                phone1.removeAttribute("disabled", null);
                phone2.removeAttribute("disabled", null);
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

                        const msg = "Registration completed";
                        const paragraph = mainfunctions.displayMessage(msg, "success"),
                              registrationBtn = document.querySelector(".registration_btn");

                        registrationBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Processing..`;
                        setTimeout(() =>{
                            registrationBtn.innerHTML = "continue to dashboard";
                            registrationForm.insertBefore(paragraph, registrationForm.firstChild);
                            setTimeout(() =>{
                            address.value = "";
                            phone1.value = "";
                            phone2.value = "";

                            registrationForm.removeChild(paragraph);
                            localStorage.removeItem("userInfo");
                            mainfunctions.redirect("dashboard.html");
                            }, 15000);
                        }, 1000);
                        

                    })
                    .catch(error =>{
                        console.log(error);
                    });
                }
                
          }
}