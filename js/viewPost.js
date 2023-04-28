// importing needed functions from main.js
import * as mainfunctions from "./utils.js";

// creating a new objec that will hold all methods on our exported class
const easyHttp = new mainfunctions.EasyHTTP;

const tableBody = document.getElementById("user-table-body"),
      postTable = document.querySelector("[data-post-table]"),
      postFilter = document.getElementById("post-filter");

let postArr = [];

// create a click event that will be deleged to the action btn
tableBody.addEventListener("click", postAction);
postFilter.addEventListener("change", postSearch);
// refreshing the page once the select input has lose focus
postFilter.addEventListener("blur", () =>{
    window.location.reload();
});

// loading all post 
document.addEventListener("DOMContentLoaded", () =>{
    const url = " https://charity-app.up.railway.app/api/posts/allpost";

    easyHttp.get(url)
    .then(data =>{
        postArr = data.map((post, index) => {
            let indexNo = index + 1;

                // console.log(post);
                // console.log(post.content);
                const postRow = createTableUI(post, indexNo),
                      contentType = post.content.split("+");
                return {header: post.header, type: contentType[0], element: postRow};
            // createTableUI(user, indexNo);
            // console.log(tableBody.children);
        });

    });
    
});

function createTableUI(post, index){
    const tableRow = postTable.content.cloneNode(true).children[0];
            const postHeader = tableRow.querySelector("[data-post-header]"),
                  postType = tableRow.querySelector("[data-post-type]"),
                  postCreationDate = tableRow.querySelector("[data-post-createdAt]"),
                  postId = tableRow.querySelector("[data-post-id]"),
                  rowId = tableRow.querySelector("[data-index]"),
                  contentType = post.content.split("+"),
                  createdAt = post.createdAt.split("T");

                rowId.textContent = index;
                postHeader.textContent = post.header;
                postType.textContent = `${contentType[0]} donation`;
                postCreationDate.textContent = createdAt[0];
                postId.textContent = post._id;



                tableBody.append(tableRow);

            return tableRow;

}

// delete post function
function postAction(e){
    if(e.target.id === "view-post-btn"){
        viewPost();
    }
    else if(e.target.id === "delete-post-btn"){
        deletePost(e.target);
    }
}

// delete post function
function deletePost(element){
    const btnContainer = element.parentElement;
    
    let postId = btnContainer.nextElementSibling;
        postId = postId.textContent;

        if(confirm("do you want to delete this post")){
            if(localStorage.getItem("token") !== null || localStorage.getItem("token") !== ""){
                const token = localStorage.getItem("token"),
                      url = `https://charity-app.up.railway.app/api/posts/${postId}`,
                      header = {
                        'Authorization': `Bearer ${token}`,
                      };
    
                let msg = "Post has been deleted"
                      
                console.log(url);
                easyHttp.delete(url, header, msg)
                .then(data => alert(data));

            }
        }
}

// search for post by type
function postSearch(e){
    const postFilter = e.target;

    if(postFilter.value !== ""){
        postArr.forEach(postInfo =>{
            const isVisible = postInfo.type.toLowerCase().includes(postFilter.value.toLowerCase());
            postInfo.element.classList.toggle("div--deactive", !isVisible);
        });
    }
}