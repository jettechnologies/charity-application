// Creating the error message
export function displayMessage(msg, msgType ){
    const msgDiv = document.createElement("div");
    const paragraph = document.createElement("p");
    const message = document.createTextNode(msg);

    msgDiv.className = `p-md-3 mb-md-3 bg-${msgType} col-lg-11`;
    paragraph.className = `error text-white mb-lg-2`;
    paragraph.appendChild(message);
    msgDiv.appendChild(paragraph);
    return msgDiv;
}

// Function for empty input field validation
export function fieldInputValidation(fieldArr, self){
    let inputArr = fieldArr.filter(fieldInput =>{
        if(fieldInput.value === ""){
            return fieldInput;
        }
    });
    if(inputArr.length > 0){
        let msg = "All fields are required";
            const error = displayMessage(msg, "danger");
            self.insertBefore(error, self.firstChild);
            setTimeout(() => {
                self.removeChild(error);
            }, 2000);

            return false;
    }
    return true;
}

// Function for validating input strings using regular expression
export function checkInputValidity(){
    const [...signupInputs] = document.querySelectorAll("input");
    signupInputs.forEach(signupInput =>{
        signupInput.addEventListener("input", inputValidity);
    });    
}

function inputValidity(e){
    let inputName = e.target,
        regex;

    switch(inputName.type){
        case "text":
            if(!inputName.classList.contains("address")){
                regex = /^[a-zA-Z0-9\s]{2,50}$/i;

                if(!regex.test(inputName.value)){
                    inputName.classList.add("is-invalid");
                }
                else{
                    inputName.classList.remove("is-invalid");
                }
            }
            else{
                regex = /^[a-zA-Z0-9\s]{5,32}$/i;

                if(!regex.test(inputName.value)){
                    inputName.classList.add("is-invalid");
                }
                else{
                    inputName.classList.remove("is-invalid");
                }
            }
            
        break;

        case "number":
            if(inputName.classList.contains("contact")){
                regex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{5})$/i;

                if(!regex.test(inputName.value)){
                    inputName.classList.add("is-invalid");
                }
                else{
                    inputName.classList.remove("is-invalid");
                }
            }
        break;

        case "email":
            regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i;

            if(!regex.test(inputName.value)){
                inputName.classList.add("is-invalid");
            }
            else{
                inputName.classList.remove("is-invalid");
            }
        break;

        case "password":
            regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i;

            if(!regex.test(inputName.value) || inputName.lenght > 10){
                inputName.classList.add("is-invalid");
            }
            else{
                inputName.classList.remove("is-invalid");
            }
        break;  
    }
}

// function for validating the file
export function validateFile(uploadImg){
    let filePath = uploadImg.value,
        fileExtension = filePath.split(".").pop(),
        fileSize = uploadImg.files[0].size,
        sizeInMb = (fileSize/1048576).toFixed(2);

    // Allowing file type
    var allowedExtensions = /(\jpg|\jpeg|\png)$/i;
             
    if (!allowedExtensions.test(fileExtension)){
        uploadImg.classList.add("is-invalid");
        const errorParagraph = uploadImg.nextElementSibling.firstElementChild;
        errorParagraph.textContent = "File extension must be jpg | jpeg | png | gif";

        filePath = '';
        return true;
    }
    else if(sizeInMb > 2){
        uploadImg.classList.add("is-invalid");
        const errorParagraph = uploadImg.nextElementSibling.firstElementChild;
        errorParagraph.textContent = "File size must not be greater than 2MB";

        filePath = '';
        return true;
    }
    else{
        uploadImg.classList.remove("is-invalid");
    }
}

// Function for redirecting to a new page after the form has been submitted
export function redirect(location){
    window.location.href = location;
}

// Exporting a library for http requests
export class EasyHTTP {
    // Make an HTTP GET Request 
    async get(url) {
        try{
            const response = await fetch(url);
            const resData = await response.json();
            return resData;
        }
        catch(error){
            console.log(error);
        }
    }
    // Make an HTTP POST Request
    async post(url, header, data) {
            const response = await fetch(url, {
                method: 'POST',
                headers : header,
                body: JSON.stringify(data)
              });
              const resData = await response.json();
              if(!response.ok){
                throw new Error(resData.message);
            }
              return resData;
     
    }
     // Make an HTTP PUT Request
     async patch(url, header, data) {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: header,
        body: JSON.stringify(data)
      });
      
      const resData = await response.json();
      if(!response.ok) throw new Error(resData.message);
      return resData;
    }

    // Make an image upload
    async imgUpload(url, header, data) {
        const response = await fetch(url, {
        method: 'PATCH',
        headers: header,
        body: data.formData
    });

    const resData = data.msg;
    if(!response.ok) throw new Error(resData.message);
    return resData;
    }
    // Make an HTTP DELETE Request
    async delete(url, header, msg) {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: header
      });
  
      const resData = await msg;
      if(!response.ok) throw new Error(resData.message);
      return resData;
    }
    
   }