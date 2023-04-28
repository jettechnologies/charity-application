// importing needed functions from main.js
import * as mainfunctions from "./utils.js";

// creating a new objec that will hold all methods on our exported class
const easyHttp = new mainfunctions.EasyHTTP;

const UIcreatePostForm = document.getElementById("create-post-form"),
      UIpostImg = document.getElementById("post-img"),
      UIclearInput = document.querySelector(".clear-post");

// Adding eventlisteners
UIcreatePostForm.addEventListener("submit", createPost);
UIpostImg.addEventListener("change", showPostImg);
UIclearInput.addEventListener("click", clearInput);
mainfunctions.checkInputValidity();

//create post function
function createPost(e) {
    e.preventDefault();
  
    const postTitle = document.getElementById("post-title"),
          postType = document.getElementById("post-type"),
          postDescription = document.getElementById("post-description"),
          postImg = document.getElementById("post-img"),
          inputArr = [postTitle, postType, postDescription, postImg],
          content = postType.value.concat("+ ", postDescription.value);
  
    // calling function for validation
    mainfunctions.fieldInputValidation(inputArr, this);
  
    if(localStorage.getItem("token") !== ""){
        const token = localStorage.getItem("token");

            const url = "https://charity-app.up.railway.app/api/posts/new",
                  data = {
                        header : postTitle.value,
                        content : content
                  };
            let header = {
                "Accept": "application/json",
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json'
            };

                  console.log(data);

            easyHttp.post(url, header, data)
            .then(data => {
                 const postId = data._id,
                       patchUrl = `https://charity-app.up.railway.app/api/posts/upload/${postId}`,
                       formData = new FormData();

                       header ={
                            'Authorization': `Bearer ${token}`,
                        }

                       formData.append("file", postImg.files[0]);
                    console.log(postId, patchUrl);
                    console.log([...formData]);
                // calling post img upload function
                postImgUpload(patchUrl, header, formData)
                .then(data => {
                    const msgDiv = mainfunctions.displayMessage(data, "success");
                    UIcreatePostForm.insertBefore(msgDiv, UIcreatePostForm.firstChild);
                        setTimeout(() => {
                            UIcreatePostForm.removeChild(msgDiv);
                            mainfunctions.redirect("dashboard.html");
                        }, 2000);
                })
                .catch(error =>console.log(error));

                // function for post image upload
                async function postImgUpload(url, header, data) {
                    const response = await fetch(url, {
                      method: 'PATCH',
                      headers: header,
                      body: data
                    });
                    
                    const resData = "Post create successfully"
                    if(!response.ok) throw new Error(resData.message);
                    return resData;
                  }

                
            });

            let msg = "Post created successfully";

            

            console.log(msgDiv);
            
            
        }

        

}

// function for validating the file
function validateFile(uploadImg){
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

// function to display post img
function showPostImg(e){
    const imgSrc = e.target.files[0],
    postImgDiv = document.querySelector(".post-img-div"),
    postImg = document.querySelector(".post-img");
          
    if(validateFile(e.target) === true){
        return;
    }
    else{

        postImgDiv.classList.remove("div--deactive");
        let fileReader = new FileReader();
        fileReader.readAsDataURL(imgSrc);
        fileReader.onload = function (){
        postImg.setAttribute('src', fileReader.result);
        }
    }
}

// Function to clear the input value
function clearInput(){
    const postTitle = document.getElementById("post-title"),
    postType = document.getElementById("post-type"),
    postDescription = document.getElementById("post-description"),
    postImg = document.getElementById("post-img");

    postTitle.value = "";
    postType.value = "";
    postDescription.value = "";
    postImg.value = "";
}
