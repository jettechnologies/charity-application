// importing needed functions from main.js
import * as mainfunctions from "./utils.js";

// creating a new objec that will hold all methods on our exported class
const easyHttp = new mainfunctions.EasyHTTP;

const UIcommentForm = document.getElementById("post-comment");
const UIcommentUL = document.querySelector(".show-comment");
const UImodalForms = document.querySelectorAll(".modal-body form");
const UIpaymentBtns = document.querySelectorAll(".btn-payment");
const UIfileInputs = document.querySelectorAll("input[type = 'file']"),
      UIbankName = document.getElementById("bank-name");
const bloodGenotype = document.getElementById("blood-genotype");


// loading the content of the post page when the DOM loads completely
document.addEventListener("DOMContentLoaded", () =>{
    if(localStorage.getItem("token") !== ""){
        const token = localStorage.getItem("token");
        const decodeToken = JSON.parse(atob(token.split('.')[1])),
              userInfo = decodeToken.user,
              postTitle = document.querySelector(".view-post-title"),
              postImg = document.querySelector(".post-img"),
              postDescr = document.querySelector(".post-description-text"),
              userRole = userInfo.role,
              userID = userInfo._id;
              console.log(userID);

        if(localStorage.getItem("postId") !== ""){
            const postId = localStorage.getItem("postId"),
                  url = `https://charity-app.up.railway.app/api/posts/${postId}`,
                  header = {
                            "Authorization" : `Bearer ${token}`
                        }
                getPostInfo(url, header)
                .then(data => {
                    let content = data.content.split("+");
                    content = content[1].trim();
                    postTitle.textContent = data.header;
                    postDescr.innerHTML = `${content} <a class="btn btn-link read-more">Read more</a>`;
                    const postAuthor = data.author;

                    console.log(postAuthor);
                    // loading the image from the api request
                    let imgURL = data.postImage;
                    fetch(imgURL, {
                        method: "GET"
                    })
                    .then(response => response.blob())
                    .then(blob => {
                        const imageURL = URL.createObjectURL(blob); 
                        postImg.src = imageURL;
                    }).catch(error => console.log(error));

                    // hidding the update post btn when the user id
                    // doesnot match the author id
                    if(userID === postAuthor){
                        const ctaBox = document.querySelector(".cta-box"); 
                        ctaBox.classList.add("div--deactive");   
                    }

                });
            
                async function getPostInfo(url, header){
                    try{
                        const response = await fetch(url, {
                            method : "GET",
                            headers : header
                        });
                        const resData = await response.json();
                        return resData;
                    }
                    catch(error){
                        console.log(error);
                    }
                }   

               
                if(userRole !== "donators"){
                    const ctaBox = document.querySelector(".cta-box"); 
                    ctaBox.classList.add("div--deactive");   
                }

                console.log(postId, url);

        }

        if(userRole !== "agency"){
            const updatePostBtn = document.querySelector("#update-post-btn");

            updatePostBtn.classList.add("div--deactive");
        }
    }
});

// eventlisteners.
UIcommentForm.addEventListener("submit", postComment);
UIcommentUL.addEventListener("click", commentAction);
UImodalForms.forEach(modalForm =>{
    switch(modalForm.id){
        case "update-post-form":
            modalForm.addEventListener("submit", updatePost);
        break;
        case "money-donation-form":
            modalForm.addEventListener("submit", moneyDonation);
        break;
        case "blood-donation-form":
            modalForm.addEventListener("submit", bloodDonation);
        break;
        case "material-donation-form":
            modalForm.addEventListener("submit", materialDonation);
        break;
        default:
            console.log("There isn't any modal form with that ID");
    }
});
UIpaymentBtns.forEach(paymentBtn =>{
    paymentBtn.addEventListener("click", showHiddenField);
});
UIfileInputs.forEach(fileInput =>{
    fileInput.addEventListener("change", (e) =>{
        mainfunctions.validateFile(e.target);
    });
});
UIbankName.addEventListener("change", updateAccNumber);
bloodGenotype.addEventListener("change", dsaGenotypeMSg);


// mainfunctions.checkInputValidity();


function postComment(e){
    e.preventDefault();

    const commentField = document.querySelector(".comment");
    const comment = commentField.value,
          [...commentsList] = UIcommentUL.children;
        
    const edittedCommentList = commentsList.filter(commentList =>{
        const editComment = commentList.classList.contains("editted");
        return editComment;
    });


    if(edittedCommentList.length === 0 || edittedCommentList.length === null){
        if(comment !== ""){
            let data, url, header;
            const li = document.createElement("li");
            const p = document.createElement("p");
            const commentText = document.createTextNode(comment);
            const deleteCommentBtn = document.createElement("span");
            const editCommentBtn = document.createElement("button");
            // Adding of classes and Id
            li.className = "list-group-item rounded-0 comment-list";
            p.className = "comment-text";
            deleteCommentBtn.className = "fa fa-trash text-danger delete-comment";
            editCommentBtn.className = "btn btn-link text-capitalize edit-comment";
    
            p.appendChild(commentText);
            editCommentBtn.textContent = "edit";
            li.append(p, editCommentBtn, deleteCommentBtn);
            UIcommentUL.appendChild(li);

            if(localStorage.getItem("token") !== ""){
                const token = localStorage.getItem("token");

                if(localStorage.getItem("postId") !== ""){
                    const postID = localStorage.getItem("postId");

                    data = {
                        comment : comment
                    };
                    header = {
                        "Accept": "application/json",
                        'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json'
                    };
                    url = `https://charity-app.up.railway.app/api/posts/comment/${postID}`;

                    easyHttp.post(url, header, data)
                    .then(data => {
                        console.log(data);
                    })
                    .catch(error => console.log(error));
                }
            }
    
            // Clearing the text field
            clearText(commentField);
        }
    }
    else{
        let editCommentP = edittedCommentList[0].firstElementChild;
        editCommentP.textContent = comment;
        edittedCommentList[0].classList.remove("editted");

        clearText(commentField);
    }

}

function clearText(inputText){

    inputText.value = "";

}
// Function for actions that can be performed on an the comments
function commentAction(e){
    if(e.target.classList.contains("delete-comment")){
        deleteComment(e.target);
    }
    else if(e.target.classList.contains("edit-comment")){
        editComment(e.target);
    }
}

// function to delete comments
function deleteComment(element){
        if(confirm("Are you sure you want to delete this comfirm")){
            element.parentElement.remove();
        }
}

// Function for editing comments
function editComment(element){
    const commentField = document.querySelector(".comment");
    let paragraph = element.previousElementSibling,
        commentList = element.parentElement;
    const [...commentListArr] = UIcommentUL.children;

    element.parentElement.classList.add("editted");
    commentField.value = paragraph.textContent;
    paragraph.textContent = commentField.value;

    // Ensuring that multiple comment cannot be editted at once
    const ecl = commentListArr.filter(commentList =>{
        let editComment = commentList.classList.contains("editted");
        return editComment;
    });
    if(ecl.length > 1){
        alert("Only one comment can be editted at a time");
        return;
    }
}

// validation for the forms on the modal
// show congrats maessage
function showCongratMsg(){
    $("#congrat-modal").modal('show');
    setTimeout(() =>{
        $('#congrat-modal').modal("hide")}, 4000);
}

// update post function
function updatePost(e){
    e.preventDefault();

    const postTitle = document.getElementById("post-title"),
          postType = document.getElementById("post-type"),
          postDescr = document.getElementById("post-description"),
          postImg = document.getElementById("post-img"),
          updatePostForm = document.getElementById("update-post-form"),
          inputArr = [postTitle, postType, postDescr];

    // checking if any input is empty
    
        if(localStorage.getItem("token") !== ""){
            const token = localStorage.getItem("token");
            let data, header, url;
            
            if(localStorage.getItem("postId") !== ""){
                const postID = localStorage.getItem("postId");
               
                    if(postImg.value === ""){
                        const inputValid = mainfunctions.fieldInputValidation(inputArr, this);

                        if(inputValid === true){
                            data = {
                                header : postTitle.value,
                                content : postType.value.concat("+ ", postDescr.value)
                            }
                            header = {
                                "Accept": "application/json",
                                'Authorization': `Bearer ${token}`,
                                'Content-type': 'application/json'
                            };
                            url = `https://charity-app.up.railway.app/api/posts/${postID}`;
                            
                            // making the patch api call for updating a post
                            easyHttp.patch(url, header, data)
                            .then(data =>{
                                console.log(data);
    
                                const msg = "Post Content updated successfully";
                                const msgDiv = mainfunctions.displayMessage(msg, "success");                            
                                // clearing of all form input
                                postTitle.value = "";
                                postType.value = "";
                                postDescr.value = "";
                                postImg.value = "";
                                
                                const updatePostBtn = document.querySelector("#update-post-btn");
                                updatePostBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Post Updating...`;
                                
                                setTimeout(() =>{
                                    updatePostBtn.innerHTML = "Update Post";
                                    updatePostForm.insertBefore(msgDiv, updatePostForm.firstChild);
                                    setTimeout(() => {
                                        updatePostForm.removeChild(msgDiv);
                                        mainfunctions.redirect("dashboard.html");
                                    }, 1500);
                                }, 1000);
                            });

                            console.log("all input are filled");
                        }
                        
                    }
                    else if(postImg.value !== "" && (postTitle.value === "" && postType.value === "" && postDescr.value === "")){
                        const formData = new FormData();
                        formData.append("file", postImg.files[0]);
                        
                        data = {
                            formData : formData,
                            msg: "Post image updated successfully"
                        }
                        header = {
                            'Authorization': `Bearer ${token}`,
                        };
                        url = `https://charity-app.up.railway.app/api/posts/upload/${postID}`;

                        easyHttp.imgUpload(url, header, data)
                        .then(data => {
                            console.log(data);
                            const msgDiv = mainfunctions.displayMessage(data, "success");                            

                            const updatePostBtn = document.querySelector("#update-post-btn");
                                updatePostBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Post Updating...`;
                                
                                console.log(updatePostBtn)
                                setTimeout(() =>{
                                    updatePostBtn.innerHTML = "Update Post";
                                    updatePostForm.insertBefore(msgDiv, updatePostForm.firstChild);
                                    setTimeout(() => {
                                        updatePostForm.removeChild(msgDiv);
                                        mainfunctions.redirect("dashboard.html");
                                    }, 1500);
                                }, 1000);
                        });
                    }
                    else{
                        data = {
                            header : postTitle.value,
                            content : postType.value.concat("+ ", postDescr.value)
                        }
                        header = {
                            "Accept": "application/json",
                            'Authorization': `Bearer ${token}`,
                            'Content-type': 'application/json'
                        };
                        url = `https://charity-app.up.railway.app/api/posts/${postID}`;
                        
                        // making the patch api call for updating a post
                        easyHttp.patch(url, header, data)
                        .then(data =>{
                            console.log(data);

                            const formData = new FormData();
                            formData.append("postImage", postImg.files[0]);
                            
                            data = {
                                formData : formData,
                                msg: "Post image updated successfully"
                            }
                            header = {
                                'Authorization': `Bearer ${token}`,
                            };
                            url = `https://charity-app.up.railway.app/api/posts/upload/${postID}`;

                            easyHttp.imgUpload(url, header, data)
                            .then(data => {
                                const msgDiv = mainfunctions.displayMessage("Post updated successfully", "success");                            
                                    // clearing of all form input
                                postTitle.value = "";
                                postType.value = "";
                                postDescr.value = "";
                                postImg.value = "";

                                const updatePostBtn = document.querySelector("#update-post-btn");
                                updatePostBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Post Updating...`;
                                
                                setTimeout(() =>{
                                    updatePostBtn.innerHTML = "Update Post";
                                    updatePostForm.insertBefore(msgDiv, updatePostForm.firstChild);
                                    setTimeout(() => {
                                        updatePostForm.removeChild(msgDiv);
                                        mainfunctions.redirect("dashboard.html");
                                    }, 1500);
                                }, 1000);
                            });
                        });

                        console.log("all input are filled and image has been selected");

                    }
            }
        }

         // console.log(inputValid);
            console.log("i got submitted");
            $('#money-donation').modal("hide");
    }
   

// moneyDonation
function moneyDonation(e){
    e.preventDefault();

    const cashAmount = document.getElementById("cash-amount"),
          currency = document.getElementById("currency"),
          bankName = document.getElementById("bank-name"),
          UIbankSlip = document.getElementById("bankslip");
        //   sendDonation = document.querySelector(".send-donation");

        // console.log(cashAmount.value, bankName.value);
   if(cashAmount.value === "" || currency.value === "" || bankName.value === undefined){
        let msg = "All fields are required";
            const error = mainfunctions.displayMessage(msg, "danger");
            this.insertBefore(error, this.firstChild);
            setTimeout(() => {
                this.removeChild(error);
            }, 2000);

            // console.log("all fields are required");
    }
    else if(UIbankSlip.parentElement.classList.contains("hidden-field")){
        return false;
    }
    else{
        let data, url, header;
        if(localStorage.getItem("token") !== ""){
            const token = localStorage.getItem("token");

            if(localStorage.getItem("postId") !== ""){
                const postID = localStorage.getItem("postId");
                data = {
                    amount : cashAmount.value,
                    currency : currency.value
                };
                header = {
                    "Accept": "application/json",
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                };
                url = `https://charity-app.up.railway.app/api/money/donate/money/${postID}`;

                easyHttp.post(url, header, data)
                .then(data => {
                    console.log(data);
                    const donationId = data._id,
                          formData = new FormData();

                        header = {
                            'Authorization': `Bearer ${token}`,
                        };
                        url = `https://charity-app.up.railway.app/api/money/upload/${postID}`;

                    formData.append("receipt", UIbankSlip.files[0]);
                    data = {
                        formData : formData,
                        msg : "Donation has been made"
                    }

                    // posting the bankslip
                    easyHttp.imgUpload(url, header, data)
                    .then(data => console.log(data));
                })
                .catch(error => console.log(error));
            }

            console.log(data);
        }
        $('#money-donation').modal("hide");
    
        showCongratMsg();
    }
    
}
// showing hidden field in money donation form
function showHiddenField(e){
    let paymentBtn = e.target;
    const bankField = document.querySelector(".bank-transaction"),
          transferField = document.querySelector(".transfer-transaction");
    if(paymentBtn.value === "bank"){
        if(!transferField.classList.contains("hidden-field")){
            transferField.classList.add("hidden-field");
        }
        bankField.classList.remove("hidden-field");
    }
    else{
        if(!bankField.classList.contains("hidden-field")){
            bankField.classList.add("hidden-field");
        }
        transferField.classList.remove("hidden-field");
    }
}
// // function for validating the file
// function validateFile(e){
//     let filePath = e.target.value,
//         fileExtension = filePath.split(".").pop(),
//         fileSize = e.target.files[0].size,
//         sizeInMb = (fileSize/1048576).toFixed(2);

//     // Allowing file type
//     var allowedExtensions = /(\jpg|\jpeg|\png)$/i;
             
//     if (!allowedExtensions.test(fileExtension)){
//         e.target.classList.add("is-invalid");
//         const errorParagraph = document.querySelector(".error");
//         errorParagraph.textContent = "File extension must be jpg | jpeg | png | gif";

//         console.log(errorParagraph);
//         filePath = '';
//     }
//     else if(sizeInMb > 2){
//         e.target.classList.add("is-invalid");
//         const errorParagraph = document.querySelector(".error");
//         errorParagraph.textContent = "File size must not be greater than 2MB";

//         filePath = '';
//     }
//     else{
//         e.target.classList.remove("is-invalid");
//     }
//     // console.log(sizeInMb, fileName);
// }
// update account number
function updateAccNumber(e){
    const bankNumberField = document.getElementById("bank-number");
    bankNumberField.removeAttribute("disabled");
    switch(e.target.value){
        case "access":
            bankNumberField.value = "0391023900";
        break;
        case "uba":
            bankNumberField.value = "2109341209";
        break;
        case "firstbank":
            bankNumberField.value = "0104121109";
        break;
    }

    bankNumberField.addEventListener("focusin", e =>{
        const element = e.target;
        element.select();
        element.setSelectionRange(0, 99999);
        // Copy the text inside the text field
        navigator.clipboard.writeText(element.value);

        // Alert the copied text
    });
}

// blood donation
function bloodDonation(e){
    e.preventDefault();

    const bloodGenotype = document.getElementById("blood-genotype"),
          bloodGroup = document.getElementById("blood-group"),
          bloodPile = document.querySelector(".blood-pile"),
          [...radioBtns] = document.querySelectorAll(".disease-check"),
          inputArr = [bloodGenotype, bloodGroup, bloodPile]; 


    // calling the field input validation method
        mainfunctions.fieldInputValidation(inputArr, this);
        // checking for the value of the radio buttons,to create an alert
        const checkedRadio = radioBtns.filter(radioBtn =>{
            return radioBtn.checked;
        });

        // console.log(checkedRadio[0].value);
        if(checkedRadio[0].value === "response-yes"){
            alert("Sorry, you cannot donate blood");
            radioBtns.forEach(radioBtn =>{
                radioBtn.checked = false
            });
        }
        else{
            let data, url, header;
            if(localStorage.getItem("token") !== ""){
                const token = localStorage.getItem("token");
    
                if(localStorage.getItem("postId") !== ""){
                    const postID = localStorage.getItem("postId");

                    const bloodType = `genotype: ${bloodGenotype.value} + bloodgroup: ${bloodGroup.value}`,
                          bloodAmount = `${bloodPile.value} pile of blood`;

                    data = {
                        bloodtype : bloodType,
                        amount : bloodAmount
                    };
                    console.log(data);
                    header = {
                        "Accept": "application/json",
                        'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json'
                    };
                    url = `https://charity-app.up.railway.app/api/blood/donate/${postID}`;

                    // making the post request for blood donation
                    easyHttp.post(url, header, data)
                    .then(data => {
                        console.log(data)
                        $('#blood-donation').modal("hide");
                        bloodGenotype.value = "";
                        bloodGroup.value = "";
                        bloodPile.value = "";
                        radioBtns.forEach(radioBtn =>{
                            radioBtn.checked = false
                        });
                        showCongratMsg();
                    })
                    .catch(error => console.log(error));

                }
            }
        }
}
// display of disallowed blood genotype
function dsaGenotypeMSg(e){
    const genotype = e.target.value

    if(genotype === "ss"){
        e.target.classList.add("is-invalid");
    }
    else{
        e.target.classList.remove("is-invalid");
    }
}
// material donation
function materialDonation(e){
    e.preventDefault();

    const materialType = document.getElementById("material-type"),
          materialName = document.getElementById("material-name"),
          materialQuantity = document.getElementById("material-quantity"),
          materialImg = document.getElementById("material-img"),
          regex = /^[a-zA-Z][a-zA-Z ]+[a-zA-Z]{3,10}$/i,
          inputArr = [materialName, materialQuantity, materialType],
          description = `Type of material : ${materialType.value} + 
          Name of the donation : ${materialName.value} +
          Quantity of the donation made : ${materialQuantity.value}`;

    // validating empty input field
    mainfunctions.fieldInputValidation(inputArr, this);

    if(materialImg.value !== ""){
        if(!regex.test(materialName.value)){    
            materialName.classList.add("is-invalid");
        }
        else{
            if(localStorage.getItem("token") !== ""){
                const token = localStorage.getItem("token");

                if(localStorage.getItem("postId") !== ""){
                    const postID = localStorage.getItem("postId");

                    let url, data, header, formData;

                    // making an api call for the donation of relief materials
                    data = {
                        description: description,
                        image : `${materialImg.files[0].name}`
                    };
                    header = {
                        "Accept": "application/json",
                        'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json'
                    };
                    url = `https://charity-app.up.railway.app/api/relief/donate/${postID}`;

                    easyHttp.post(url, header, data)
                    .then(data =>{
                        console.log(data);
                        const materialID  = data._id;
                        console.log(materialID);

                        // making a patch for the material image upload
                        formData = new FormData();
                        formData.append("file", materialImg.files[0]);

                        const imgData = {
                            formData : formData,
                            msg : "Picture of the material uploaded succesfully"
                        }
                        header = {
                            'Authorization': `Bearer ${token}`,
                        };
                        url = `https://charity-app.up.railway.app/api/money/upload/${materialID}`;

                        easyHttp.imgUpload(url, header, imgData)
                        .then(data => {
                            console.log(data);

                            materialName.value = "";
                            materialQuantity.value = "";
                            materialType.value = "";
                            $('#material-donation').modal("hide");
                            showCongratMsg();
                        });
                    })
                    .catch(error => console.log(error));
        
                }
            }
            
        }
    }
    else{
        let msg = "Please select an image of the material donation";
            const error = mainfunctions.displayMessage(msg, "danger");
            this.insertBefore(error, this.firstChild);
            setTimeout(() => {
                this.removeChild(error);
            }, 2000);
    }
    

}

// empty field validation

// validating the input of the material name input
// function inputValid(e){
//     const regex = /^[a-zA-Z\s]{2,32}55$/i;

//     if(!regex.test(e.target.value)){
//         e.target.classList.add("is-invalid");
//     }
//     else{
//         e.target.classList.remove("is-invalid");
//     }
// }