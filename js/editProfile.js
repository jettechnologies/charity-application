// importing needed functions from main.js
import * as mainfunctions from "./utils.js";

// creating a new objec that will hold all methods on our exported class
const easyHttp = new mainfunctions.EasyHTTP;

const UIprofileForm  = document.getElementById("profile-form"),
      UIprofileImg = document.getElementById("edit-profile-img");

// Adding events
mainfunctions.checkInputValidity();
UIprofileForm.addEventListener("submit", validateProfileForm);
UIprofileImg.addEventListener("change", editProfileImg);


// Document loading to get the image of the user and spit it out
document.addEventListener("DOMContentLoaded", () =>{
    if(localStorage.getItem("token") !== ""){
        const token = localStorage.getItem("token");
        // decoding the information that is been stored in the token
        const decodeToken = JSON.parse(atob(token.split('.')[1])),
              userInfo = decodeToken.user,
              userID = userInfo._id;
        
        console.log(userID);
    }
});
// Profile form validation
function validateProfileForm(e){
    e.preventDefault();

    const fullName = document.getElementById("profile-fullname"),
          email = document.getElementById("profile-email"),
          phoneNum = document.getElementById("profile-phone"),
          address = document.getElementById("profile-address"),
          profileImg = document.getElementById("edit-profile-img"),
          profileInputArr = [fullName, email, phoneNum, address];

    if(localStorage.getItem("token") !== null){
        const token = localStorage.getItem("token");
        const decodeToken = JSON.parse(atob(token.split('.')[1])),
              userInfo = decodeToken.user,
              userID = userInfo._id;


         // validating all empty field;
        if(profileImg.value === ""){
            mainfunctions.fieldInputValidation(profileInputArr, this);
            const data = {
                fullname : fullName.value,
                email : email.value,
                phone : phoneNum.value,
                address : address.value,
            };

            console.log(data);
        
                const url = `https://charity-app.up.railway.app/api/user/${userID}`,
                    header = {
                        "Accept": "application/json",
                        'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json'
                    };
                    
                easyHttp.patch(url, header, data)
                .then(resData => {
                    console.log(resData);
                    fullName.value = "";
                    email.value = "";
                    phoneNum.value = "";
                    address.value = "";

                    let msg = "Profile updated successfully";
                    const msgDiv = mainfunctions.displayMessage(msg, "success");
                    UIprofileForm.insertBefore(msgDiv, UIprofileForm.firstChild);
                        setTimeout(() => {
                            UIprofileForm.removeChild(msgDiv);
                            mainfunctions.redirect("dashboard.html");
                        }, 2000);
                });
                    console.log(userID);
                    
            }
            
            // let location = "dashboard.html";
            // mainfunctions.redirect(location);
        else if(profileImg.value !== "" && (fullName.value ==="" && email.value === "" && phoneNum.value === "" && address.value === "")){

            const formData = new FormData(),
                url = `https://charity-app.up.railway.app/api/user/${userID}`,
                header = {
                    'Authorization': `Bearer ${token}`
                }

            formData.append("imagePath", profileImg.files[0]);
            const data = {
                formData : formData,
                msg: "Profile image updated successfully"
            }

            console.log(data);

            easyHttp.imgUpload(url, header, data)
            .then(data => {
                const msgDiv = mainfunctions.displayMessage(data, "success");
                    UIprofileForm.insertBefore(msgDiv, UIprofileForm.firstChild);
                        setTimeout(() => {
                            UIprofileForm.removeChild(msgDiv);
                            mainfunctions.redirect("dashboard.html");
                        }, 2000);
            });

            return;
        }
        else{
            const data = {
                fullName : fullName.value,
                email : email.value,
                phoneNum : phoneNum.value,
                address : address.value,
            }

            const url = `https://charity-app.up.railway.app/api/user/${userID}`;
            let header = {
                        "Accept": "application/json",
                        'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json'
                    };
                    
                easyHttp.patch(url, header, data)
                .then(resData => {
                    console.log(resData);

                    const formData = new FormData();
                    formData.append("imagePath", profileImg.files[0]);
                    const data = {
                        formData: formData,
                        msg: "Profile updated successfully"
                    }
                    header = {
                        'Authorization': `Bearer ${token}`,
                    }
                    
                    easyHttp.imgUpload(url, header, data)
                    .then(data => {
                        fullName.value = "";
                        email.value = "";
                        phoneNum.value = "";
                        address.value = "";
                        const msgDiv = mainfunctions.displayMessage(msg, "success");
                        UIprofileForm.insertBefore(data, UIprofileForm.firstChild);
                            setTimeout(() => {
                                UIprofileForm.removeChild(msgDiv);
                                mainfunctions.redirect("dashboard.html");
                            }, 2000);
                    });

                    // let msg = "Profile updated successfully";
                    
                });

            // console.log(data);
        }

    }
   
}   

// validating the profile img before uploading
function validateFile(uploadImg){
    let filePath = uploadImg.value,
        fileExtension = filePath.split(".").pop(),
        fileSize = uploadImg.files[0].size,
        sizeInMb = (fileSize/1048576).toFixed(2);

    // Allowing file type
    var allowedExtensions = /(\jpg|\jpeg|\png)$/i;
             
    if (!allowedExtensions.test(fileExtension)){
        alert("File extension must be jpg | jpeg | png | gif");

        filePath = '';
        return true;
    }
    else if(sizeInMb > 2){
        alert("File size must not be greater than 2MB");

        filePath = '';
        return true;
    }
}

// function to display post img
function editProfileImg(e){
    const imgSrc = e.target.files[0],
          profileImg = document.querySelector(".profile-img");
          
    if(validateFile(e.target) === false){
        return;
    }
    else{
        let fileReader = new FileReader();
        fileReader.readAsDataURL(imgSrc);
        fileReader.onload = function (){
        profileImg.setAttribute('src', fileReader.result);

        console.log(profileImg);
        }
    }
}

// validating password form
function validatePassForm(e){
    e.preventDefault();

    const editPassword = document.getElementById("edit-password"),
          confirmPassword = document.getElementById("edit-confirm-password"),
          editInputArr = [editPassword, confirmPassword];

    let data;
    const inputValidity = mainfunctions.fieldInputValidation(editInputArr, this);

    if(inputValidity === true){
        if(editPassword.value !== confirmPassword.value){
            const msg = "Password input and confirm password input must be similar";
            const error = mainfunctions.displayMessage(msg, "danger");
            this.insertBefore(error, this.firstChild);
            setTimeout(() => {
                this.removeChild(error);
            }, 2000);
        }
            
    }
    else{
        if(localStorage.getItem("token") !== null){
            const token = localStorage.getItem("token");
            const decodeToken = JSON.parse(atob(token.split('.')[1])),
                  userInfo = decodeToken.user,
                  userID = userInfo._id,
                  url = `https://charity-app.up.railway.app/api/user/${userID}`,
                    header = {
                        "Accept": "application/json",
                        'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json'
                    };

            data = {
                password : editPassword.value
            }
            
            easyHttp.patch(url, header, data)
            .then(data => {
                console.log(data);
                editPassword.value = "";
                confirmPassword.value = ""; 
                // mainfunctions.redirect("dashboard.html");
            });
        }
        
    }
   
}