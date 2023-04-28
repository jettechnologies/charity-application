// importing needed functions from main.js
import * as mainfunctions from "./utils.js";

// creating a new objec that will hold all methods on our exported class
const easyHttp = new mainfunctions.EasyHTTP;

let cardArr = [];
const mainCol = document.querySelector(".main-col"),
      postCard = document.querySelector("[data-post-card]"),
      cardFilter = document.querySelector(".post-card-filter");

// adding eventlisterner to the card filter
cardFilter.addEventListener("change", cardSearch);

// refreshing the page with the blur event
cardFilter.addEventListener("blur", refreshPage);

// redirecting to post.html page
mainCol.addEventListener("click", postCardRedirect);

// loading all the post details once the page is loaded
document.addEventListener("DOMContentLoaded", () =>{
    if(localStorage.getItem("token") !== ""){
        const token = localStorage.getItem("token");

        const url = "https://charity-app.up.railway.app/api/posts/allpost";

            easyHttp.get(url)
            .then(data => {
                let postDetails = data;

                cardArr = postDetails.map(postDetail => {
                    let contentType = postDetail.content.split("+");
                    contentType = contentType[0];
                    console.log(postDetail);
                    // calling the function to create the UI
                    const cardRow = createPostUI(postDetail);
                    return({type: contentType, element: cardRow});
                });
            });
    }
});

// creating the necessary UI for posts
function createPostUI(post){
    const cardRow = postCard.content.cloneNode(true).children[0],
          postImg = cardRow.querySelector("[data-post-img]"),
          postTitle = cardRow.querySelector("[data-post-title]"),
          postType = cardRow.querySelector("[data-post-type]"),
          postDescr = cardRow.querySelector("[data-post-descr]"),
          postId = cardRow.querySelector("[data-post-index]"),
          postContent = post.content.split("+");
        // console.log(postContent[1]);


    postTitle.textContent = post.header;
    postType.textContent = `${postContent[0]} donation`;
    postDescr.textContent = postContent[1];
    postId.textContent = post._id;

    let imgURL = post.postImage;
    fetch(imgURL, {
        method: "GET"
    })
    .then(response => response.blob())
    .then(blob => {
        const imageURL = URL.createObjectURL(blob); 
        postImg.src = imageURL;
    }).catch(error => console.log(error));
        
    mainCol.append(cardRow);
    return cardRow;

}

// Function for searching cards
function cardSearch(e){
    let filterText = e.target.value;

    if(filterText!== ""){
        cardArr.forEach(card =>{
            const isVisible = card.type.toLowerCase().includes(filterText.toLowerCase());
            card.element.classList.toggle("div--deactive", !isVisible);
            console.log(isVisible);
        });
    }

}

// refresh page function
function refreshPage(){
    window.location.reload();
}

// post card redirect function
function postCardRedirect(e){
    if(e.target.classList.contains("card-img")){
        const postCard = e.target.parentElement,
              [...cardChildren] = postCard.children;

        let cardId = cardChildren[2];
        cardId = cardId.textContent;

        if(localStorage.getItem("postId") !== ""){
            localStorage.removeItem("postId");
            localStorage.setItem("postId", cardId);
        }
        else{
            localStorage.setItem("postId", cardId);
        }

        postCard.parentElement.setAttribute("href", "post.html");
    }
}