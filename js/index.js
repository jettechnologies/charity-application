// importing needed functions from main.js
import * as mainfunctions from "./utils.js";

// creating a new objec that will hold all methods on our exported class
const easyHttp = new mainfunctions.EasyHTTP;

const[...btnArr] = document.querySelectorAll(".btn_toggle");
const[...btnRedirect] = document.querySelectorAll(".btn_redirect");
const signupForm = document.getElementById("signup_form");
const loginForm = document.getElementById("login_form");
// const signupBtn = document.querySelector(".signup_btn");

document.addEventListener("DOMContentLoaded", () =>{
    if(localStorage.getItem("token") !== ""){
        const token = localStorage.getItem("token");
        const decodeToken = JSON.parse(atob(token.split('.')[1]));
        const expDate = new Date(decodeToken.exp * 1000),
              userInfo = decodeToken.user,
              currentDate = new Date(),
              loginContainer = document.getElementById("login"),
              signupContainer = document.querySelector("#signup"),
              btnRow = document.querySelector(".btn_row");
        
        let dayLeft = expDate.getDay() - currentDate.getDay();

        if((dayLeft <= 3 && dayLeft !== 0)){
            setTimeout(() =>{
                if(confirm(`Are you ${userInfo.fullname} logged in`)){
                    mainfunctions.redirect("dashboard.html");
                }
                else{
                    loginContainer.classList.add("div--active");
                    signupContainer.classList.add("div--deactive");
                    btnRow.children[0].classList.add("bg-white");
                    btnRow.children[1].classList.remove("bg-white");
                }
            }, 2000);
        }
    }
});
signupForm.addEventListener("submit", signupFormValidator);
loginForm.addEventListener("submit", loginFormValidator);
mainfunctions.checkInputValidity();

btnArr.forEach(btn=>{
   btn.addEventListener("click", btnToggler);
});

btnRedirect.forEach(redirectBtn =>{
    redirectBtn.addEventListener("click", btnToggler);
});
// function for toggling through both login and signup form
function divToggler(e){
    const loginContainer = document.querySelector("#login");
    const signupContainer = document.querySelector("#signup");
    if(e.target.value === "login"){
        loginContainer.classList.add("div--active");

        signupContainer.classList.add("div--deactive");
        // window.location.reload();
    }
    else{
        loginContainer.classList.remove("div--active");
        signupContainer.classList.remove("div--deactive")
    }    
}
// function for adding a white background for to the toggle buttons
function btnToggler(e){
    divToggler(e);
        const btnRow = document.querySelector(".btn_row");
        let btnValue = e.target.value;

        if(btnRow.children[0].id === `${btnValue}-btn-div`){
            btnRow.children[0].classList.add("bg-white");
            btnRow.children[0].nextElementSibling.classList.remove("bg-white");
        }
        else if(btnRow.children[1].id === `${btnValue}-btn-div`){
            btnRow.children[1].classList.add("bg-white");
            btnRow.children[1].previousElementSibling.classList.remove("bg-white");
        }

}

// Function for validating signup form
function signupFormValidator(e){
    e.preventDefault();
    
    
    const fullName = document.getElementById("fullname"),
          email = document.getElementById("email"),
          role = document.getElementById("role"),
          password = document.getElementById("password"),
          confirmPassword = document.getElementById("password_confirm"),
          roleVal = role.value, 
          formattedRole = roleVal.toLowerCase();

    console.log(formattedRole)

        //   console.log(selectRole.value);
    // checking for empty fields
    if(fullName.value === ""
        || email.value === ""
        || role.value === ""
        || password.value === ""
        || confirmPassword.value === ""){
            const msg = "All fields are required"
            const paragraph = mainfunctions.displayMessage(msg, "danger");
        
            this.insertBefore(paragraph, this.firstChild);
            fullName.setAttribute("disabled", null);
            email.setAttribute("disabled", null);
            role.setAttribute("disabled", null);
            password.setAttribute("disabled", null);
            confirmPassword.setAttribute("disabled", null);

            setTimeout(() =>{
                this.removeChild(paragraph);
                fullName.removeAttribute("disabled", null);
                email.removeAttribute("disabled", null);
                role.removeAttribute("disabled", null);
                password.removeAttribute("disabled", null);
                confirmPassword.removeAttribute("disabled", null);
            }, 2000);

    }
    else if(password.value !== confirmPassword.value){
        const msg = "Password input and confirm password input must be similar";
        const paragraph = mainfunctions.displayMessage(msg, "danger");
        this.insertBefore(paragraph, this.firstChild);

        setTimeout(() =>{
            this.removeChild(paragraph);
        }, 2000); 
    }
    else{
        
        

        // this.submit();
        // mainfunctions.redirect(e, location);
        const data = {
            fullname : fullName.value,
            role: formattedRole,
            email: email.value,
            password: password.value
        };
        let self = this;
        console.log(data);

        // posting the details to the api
        let header;
        header = {
            "Accept": "application/json",
            'Content-type': 'application/json'
        };

        // easyHttp.post("https://charity-app-production.up.railway.app/api/auth/signup", header, data)
        // .then(data => console.log(data));
        easyHttp.post("https://charity-app.up.railway.app/api/auth/signup", header, data)
            .then((data, self) => {
                // if(localStorage.getItem("userInfo") !== null){
                //     localStorage.removeItem("userInfo");
                //     let userInfo;

                //     userInfo = [email.value, password.value, role.value];
                //     localStorage.setItem("userInfo", JSON.stringify(userInfo));
                    
                //     fullName.value = "";
                //     email.value = "";
                // }
                const msg = "You have been successfully registered";
                const paragraph = mainfunctions.displayMessage(msg, "success");
                self.insertBefore(paragraph, self.firstChild);
                setTimeout(() =>{
                    self.removeChild(paragraph);
                    mainfunctions.redirect("onboarding.html");
                }, 2000);
                console.log(data);
            })
            .catch((error) =>{
                const regex = /user$/i,
                      errorMsg = error.message;

                if(regex.test(errorMsg)){
                    const paragraph = mainfunctions.displayMessage(errorMsg, "danger");
                    self.insertBefore(paragraph, self.firstChild);
                    setTimeout(() =>{
                        self.removeChild(paragraph);
                        // mainfunctions.redirect("onboarding.html");
                    }, 2000);
                }
                console.log(error);
            });

        // if(localStorage.getItem("userInfo") !== null){
        //     localStorage.removeItem("userInfo");
            
        //     fullName.value = "";
        //     email.value = "";
        // }

        // let userInfo;

        //     userInfo = [email.value, password.value, role.value];
        //     localStorage.setItem("userInfo", JSON.stringify(userInfo));
            

        // console.log(userInfo);
                // mainfunctions.redirect("onboarding.html");

        // 

        // location = "onboarding.html";
    }    

}

// Login form validation
function loginFormValidator(e){
    e.preventDefault();
    const loginEmail = document.getElementById("login_email"),
          loginPassword = document.getElementById("login_password");

    // check ifthe input fields are empty
    if(loginEmail.value === "" || loginPassword.value === ""){
        const msg = "All fields are required";
            const paragraph = mainfunctions.displayMessage(msg, "danger");

            this.insertBefore(paragraph, this.children[1]);
            loginEmail.setAttribute("disabled", null);
            loginPassword.setAttribute("disabled", null);

            setTimeout(() =>{
                this.removeChild(paragraph);
                loginEmail.removeAttribute("disabled", null);
                loginPassword.removeAttribute("disabled", null);
            }, 2000);
    }
    else{
        // location = "dashboard.html";
        const data = {
            email: loginEmail.value,
            password: loginPassword.value
        }

        let header;
        header = {
            "Accept": "application/json",
            'Content-type': 'application/json'
        };
        // this.submit();
        // mainfunctions.redirect(e, location);
        easyHttp.post("https://charity-app.up.railway.app/api/auth/login", header, data)
            .then(data => {
                    console.log(data.token);
                    let token = data.token;
                    if(localStorage.getItem("token") !== ""){
                        localStorage.removeItem("token");
                    }
                    localStorage.setItem("token", token);
                    mainfunctions.redirect("dashboard.html");
            })
            .catch(error =>{
                console.log(error);
            });

        // loginEmail.value = "";
    }
}
