/* ===================================== */
/*             Community.hbs           */
/* ===================================== */
let allTextCmmBx = document.querySelectorAll('.showTextMax')

let maxText = "..."

// ---- show max text in Community user post  length text <= 150 text
if(allTextCmmBx.length != 0){
    
    allTextCmmBx.forEach((textCmmBx)=>{
        let text = textCmmBx.textContent
            delExcessTxt = text.slice(0,150)
            textCmmBx.innerHTML = delExcessTxt + maxText    
})

    // ---- show category of Community 
    let selectCommunity = document.querySelector('#selectCommunity')
    let allCommunityBx = document.querySelectorAll('.community .post-col')
    let notHavePostBox = document.querySelector('.community .not-have-post')
    
    let getOptionSelect = ""
    let postCategory = []
    
    
    allCommunityBx.forEach((communityBx)=>{
        let getPostCategory = communityBx.querySelector('.post-category')
        let getTextPost = getPostCategory.textContent
        postCategory.push({textPost :getTextPost})
    })
    
    selectCommunity.addEventListener('change',()=>{
        getOptionSelect = selectCommunity.options[selectCommunity.selectedIndex].text;
        
        let checkPostBx = postCategory.filter((getIt) =>{
            return getOptionSelect == getIt.textPost
        })
    
        if(getOptionSelect == "All"){
            allCommunityBx.forEach((communityBx)=>{
              communityBx.parentElement.style.display = 'block'
            })
            notHavePostBox.classList.remove('active')
        }
        else if(checkPostBx.length != 0){
            // console.log(checkPostBx[0].textPost)
            allCommunityBx.forEach((communityBx)=>{
                let getPostCategoryBx = communityBx.querySelector('.post-category')
                if(getPostCategoryBx.textContent == checkPostBx[0].textPost){
                    communityBx.parentElement.style.display = 'block'
                }else{
                    communityBx.parentElement.style.display = 'none'
                }
            })
            notHavePostBox.classList.remove('active')
        }
        else{
            allCommunityBx.forEach((communityBx)=>{
                communityBx.parentElement.style.display = 'none'
              })
            notHavePostBox.classList.add('active')
        }
    })   
}



// --------------------------------------------
//     Check input from createCommentUser
// -------------------------------------------
let postComment1 = document.querySelector('.post-comments-1')
let usernameComment = document.querySelector('.usernameComment')
let contentComment = document.querySelector('.contentComment')
let commentForm = document.querySelector('.add-comment-post form')
let cancelPostComment = document.querySelector('.cancel-post-comment')


if(commentForm != null){
    commentForm.addEventListener('submit',(event)=>{
        event.preventDefault()
        if(usernameComment.value.trim() == ""){
             Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter complete information',
                showConfirmButton: false,
                timer: 1500
              })
             }
         else if(contentComment.value.trim() == ""){
             Swal.fire({
                 position: 'center',
                 icon: 'warning',
                 title: 'Please enter complete information',
                 showConfirmButton: false,
                 timer: 1500
               })
         }
             else{
                 let formUserID = commentForm.getAttribute("id")
     
                 let userDataComment = {
                     username:usernameComment.value.trim(),
                     userComment:contentComment.value.trim()
                 };
                 
                 fetch(`/community/user-post-${formUserID}/createComment`, {
                     method: 'POST',
                     body: JSON.stringify(userDataComment),
                     headers: { 'Content-Type': 'application/json' }
                 }).then(res => res.json())
                   .then(json => console.log(json));
     
                   Swal.fire({
                     position: 'center',
                     icon: 'success',
                     title: 'Successfully added content',
                     showConfirmButton: false,
                     timer: 1500
                   })
     
                 usernameComment.value = ""
                 contentComment.value = ""
                 setTimeout(function(){window.location.reload();},1600)
             }
     }) 
     cancelPostComment.addEventListener('click',()=>{
        usernameComment.value = ""
        contentComment.value = ""
     })
}

/* ===================================== */
/*              NewPostCmm.hbs           */
/* ===================================== */
const selectImg = document.querySelector('.select-image')
const inputFile = document.querySelector('#file');
const imgArea = document.querySelector('.image-area')

if(selectImg != null){
 let createPostBtn = document.querySelector('.create-post-btn')

    selectImg.addEventListener('click',()=>{
        inputFile.click();
    })
    
    //get img address to show image in imgArea real time
    inputFile.addEventListener('change',()=>{
        const image = inputFile.files[0]
        // get image address in user computer to display in imgArea 
        const reader = new FileReader();
        reader.onload = ()=>{
            const imgUrl = reader.result
            const img = document.createElement('img')
            img.src = imgUrl;
            imgArea.appendChild(img);
        }
        reader.readAsDataURL(image)
    })

    createPostBtn.addEventListener('click',(e)=>{
        e.preventDefault()
        let getInputName = document.querySelector('.newPost #new_post_name') 
        let getCategory = document.querySelector('.newPost #cmm_new_post_category') 
        let selectCategory = getCategory.options[getCategory.selectedIndex].text;
        let getArticle = document.querySelector('.newPost #new_post-article') 
        let checkImg = imgArea.querySelector('img')
        
        // check input data 
       
       if(getInputName.value.trim() == '' || getArticle.value.trim() == ''){
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please complete the information.',
                showConfirmButton: false,
                timer: 1500
              })
        }
        else if(checkImg == null){
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please select the desired image.',
                showConfirmButton: false,
                timer: 1500
              })
           }
        else if(selectCategory == "Select Category ..."){
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please select the desired category.',
                showConfirmButton: false,
                timer: 1500
              })
        }
        else{
            const [fileImg] = inputFile.files;
            if(fileImg && fileImg.type.includes("image")){

            // get user data value
             cmmBxData = {
                username:getInputName.value.trim(),
                category:selectCategory,
                content:getArticle.value.trim(),
             }

             const formUserData = new FormData()
             formUserData.append('userImgPost',fileImg);
             formUserData.append('userDataPost',JSON.stringify(cmmBxData));

            // Fetch user Image and user data to Node.js
           fetch('/community/createNewPost', {
               method: 'POST',
              body: formUserData,
            }).then(res => res.json())
              .then(json => console.log(json));
           
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Your post was created successfully.',
                showConfirmButton: false,
                timer: 1500
              })

            getInputName.value = ""
            getCategory.value = "Select Category ..."
            getArticle.value = ""
            inputFile.value = ""

            const removeImg = document.querySelector('.image-area img')
            removeImg.remove()
        }
}})

}


