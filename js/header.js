// disabling some links depending on the user role.
document.addEventListener("DOMContentLoaded", () =>{
    if(localStorage.getItem("token") !== null){
        const token = localStorage.getItem("token");
        const decodeToken = JSON.parse(atob(token.split('.')[1])),
               userInfo = decodeToken.user,
               userFullName = userInfo.fullname, 
               userRole = userInfo.role,
               viewLink = document.querySelector(".view-link a"),
               createLink = document.querySelector(".create-link a"),
               usernameLink = document.querySelector(".username-link a");

        if(userRole === "donators"){
            viewLink.classList.add("disabled");
            viewLink.classList.remove("text-white");

            createLink.classList.add("disabled");
            createLink.classList.remove("text-white");
        }
        else if(userRole === "agency"){
            const [...dropDownLinks] = viewLink.nextElementSibling.children;

            dropDownLinks[1].classList.add("div--deactive");
            dropDownLinks[2].classList.add("div--deactive");
        }
        else if(userRole === "admin"){
            createLink.classList.add("disabled");
            createLink.classList.remove("text-white");
        }

        usernameLink.innerHTML = userFullName;
    }
});

// logout function
document.querySelector(".logout-btn").addEventListener("click", logOut)
function logOut(e){
    if(localStorage.getItem("token") !==""){
        localStorage.removeItem("token");

        let location = "index.html";
        window.location.href = location;
    }
}