// ====================================
//      Admin Navigation BurgerBar
// ====================================
let adminMenu = document.querySelector('.menu')
let adminMain = document.querySelector('.adminDashboard')
let adminNavbar = document.querySelector('.admin-navigation')
let closeNavbarMobile = document.querySelector('.close-mobile-navbar')

if(adminMenu){
  adminMenu.addEventListener('click', () => {
    adminNavbar.classList.toggle('active')
    adminMain.classList.toggle('active')
    closeNavbarMobile.classList.add('active')
  })
  
  closeNavbarMobile.addEventListener('click', () => {
    adminNavbar.classList.toggle('active')
    adminMain.classList.toggle('active')
    closeNavbarMobile.classList.toggle('active')
  })
}

// ==========================================================================================
//  adminHeaderUser.hbs  (if admin login success) (show img and admin name data) in headerBar
// ==========================================================================================
let showAdminName = document.querySelector('.adminUser .name p')
let showAdminImg = document.querySelector('.adminUser img')

fetch('/getAdminHeader',{
    method:"POST"
}).then(res => res.json())
  .then(json =>{
    if(json){
      showAdminName.innerText = json.adminName
      showAdminImg.src = `/public/adminImage/${json.adminImage}`
    }
})

// ====================================
//              Admin Dashboard 
// ====================================
const ctx = document.getElementById('myChart');
const popularCategory = document.getElementById('popularCategory');

// Show data analysis of post community (Popular)
async function getPostData(){
  if (ctx !== null || popularCategory !== null) {
    let allCategoryInPost = []
    let allQuantityCategoryInPost = []

    let response = await fetch('/postDataAnalytics',{
      method:"POST"
    })
    let jsonData = await response.json();

    jsonData.forEach((categoryData)=>{
      allCategoryInPost.push(categoryData.category)
      allQuantityCategoryInPost.push(categoryData.quantityCategory)
    })

     console.log(allCategoryInPost)
     console.log(allQuantityCategoryInPost)

       new Chart(ctx, {
        type: 'bar',
        data: {
          labels:allCategoryInPost,
          datasets: [{
            label: 'Popular of category posts',
            data: allQuantityCategoryInPost ,
            backgroundColor: [
              'rgba(255, 99, 132)',
              'rgba(255, 159, 64)',
              'rgba(255, 205, 86)',
              'rgba(75, 192, 192)',
              'rgba(54, 162, 235)',
              'rgba(153, 102, 255)',
              'rgba(201, 203, 207)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
    
        }
      });
      new Chart(popularCategory, {
        type: 'polarArea',
        data: {
          labels:  allCategoryInPost,
          datasets: [{
            label: '# of Votes',
            data:allQuantityCategoryInPost ,
            backgroundColor: [
              'rgba(255, 99, 132)',
              'rgba(255, 159, 64)',
              'rgba(255, 205, 86)',
              'rgba(75, 192, 192)',
              'rgba(54, 162, 235)',
              'rgba(153, 102, 255)',
              'rgba(201, 203, 207)'
            ],
            //   borderColor: [
            //     'rgb(255, 99, 132)',
            //     'rgb(255, 159, 64)',
            //     'rgb(255, 205, 86)',
            //     'rgb(75, 192, 192)',
            //     'rgb(54, 162, 235)',
            //     'rgb(153, 102, 255)',
            //     'rgb(201, 203, 207)'
            //   ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true
        }
      });
  }
}

getPostData()

// ============================================================
//           Manage Blog (create,edit,delete)
// ============================================================
// -----------  ### ManageBlog.hbs ###
// Search blog list in adminDashboard
let allBlogTitle = document.querySelectorAll(".blog-list tr .blog-title") 
let adminBlogSearch = document.querySelector('#admin-search-blog')

if(adminBlogSearch){
  adminBlogSearch.addEventListener("change",(e)=>{
    let getSearchAdminBlog = e.target.value
  
    allBlogTitle.forEach((titleTx)=>{
      let getBlogTitleTx = titleTx.textContent
  
      let lowerTitle =  getBlogTitleTx.toLowerCase()
      let upperTitle =  getBlogTitleTx.toUpperCase()
  

      let searchTextLower =  lowerTitle.includes(getSearchAdminBlog)
      let searchTextUpper =  upperTitle.includes(getSearchAdminBlog)

      let parentTR = titleTx.parentElement.parentElement
      if(searchTextLower || searchTextUpper){
         parentTR.style.display="table-row"
         adminBlogSearch.value = ""
    }else{
         parentTR.style.display="none"
    }
    })
  })
}


// -----------  ### createBlog.hbs ###
// show upload Image Blog in admin
const showImgBlog = document.querySelector('.adminDashboard .showImgBlog') 
const uploadBlogImg = document.querySelector('.adminDashboard #uploadBlogImg')
const selectCategory = document.querySelector('.adminDashboard #createBlogCategory')
const titleInput = document.querySelector('.adminDashboard #createBlogTitle')
const contentInput = document.querySelector('.adminDashboard #createBlogContent')
const createBlogBtn = document.querySelector('.adminDashboard .create_Blog_Btn')
// get all blog table
const allBlogTable = document.querySelectorAll(".main-adminBx .delete-blog")


if(uploadBlogImg){
  uploadBlogImg.addEventListener('change',()=>{
    let getImg = uploadBlogImg.files[0]
    
    const reader = new FileReader()
    reader.readAsDataURL(getImg)
    reader.onload = (e) =>{
      const imgUrl = reader.result
  
      // get url from img upload and put in <img src="">
      const image = new Image();
      // change img data to src
      image.src = imgUrl
      showImgBlog.src = imgUrl
      showImgBlog.style.display="block"
    }
  })
}

// check all input before upload to server
if(createBlogBtn){
  createBlogBtn.addEventListener('click',()=>{
 
    if(titleInput.value =="" || contentInput.value == ""){
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Please complete the information.',
        showConfirmButton: false,
        timer: 1500
      })
    }
    else if(selectCategory.value == "Select you category"){
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Please select you category',
        showConfirmButton: false,
        timer: 1500
      })
    }
    else if(uploadBlogImg.files[0] == undefined){
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Please select an image to use.',
        showConfirmButton: false,
        timer: 1500
      })
    }
    else{
      let [getBlogImg] = uploadBlogImg.files
      getBlogData = {
        blogTitle:titleInput.value.trim(),
        blogCategory:selectCategory.value,
        blogContent:contentInput.value,
      }
      let createBlogData = new FormData()
      createBlogData.append('blogImage',getBlogImg)
      createBlogData.append('blogData',JSON.stringify(getBlogData))

      // send all blog data and blog img to server
      fetch("/admin/manageBlog/createBlog",{
        method:"POST",
        body:createBlogData
      }).then(res => res.json())
      .then(json => 
        Swal.fire({
        position: 'center',
        icon: `${json.icon}`,
        title:  `${json.title}`,
        showConfirmButton: false,
        timer: 1500
      })
      )
        
      // Once the data has been submitted, reset all entered data.
      titleInput.value ="" 
      contentInput.value = ""
      showImgBlog.src = ""
      showImgBlog.style.display="none"
      uploadBlogImg.value = ""
      selectCategory.value="Select you category"
    }
  })
}

// -----------  ### EditBlog.hbs ###
let editBlogCategory = document.querySelector(".adminDashboard #editBlogCategory")

if(editBlogCategory){
let BlogBoxID = document.querySelector('.adminDashboard .boxLeft')
let getEditCtgValue = editBlogCategory.getAttribute('data-blogCategory')
let editBlogImgBtn = document.querySelector('.adminDashboard #editBlogImg')
let showEditImgBlog = document.querySelector('.adminDashboard .showEditImgBlog')
let editTitleBlog = document.querySelector('.adminDashboard #editBlogTitle')
let editContentBlog = document.querySelector('.adminDashboard #editBlogContent')
let editBlogBtn = document.querySelector('.adminDashboard .edit_Blog_Btn')
// fixed category to match the selected in db
editBlogCategory.value = getEditCtgValue


// editBlogImgBtn 
// change image Change the picture as needed.
editBlogImgBtn.addEventListener('change',()=>{
  let getImg = editBlogImgBtn.files[0]

  const reader = new FileReader()
  reader.readAsDataURL(getImg)
  reader.onload = (e) =>{
    const imgUrl = reader.result

    //  get url from img upload and edit in <img src="">
    const image = new Image()
    // change img data to src
    image.src = imgUrl
    showEditImgBlog.src = imgUrl 

  }

})

editBlogBtn.addEventListener('click',()=>{
  if(editTitleBlog.value == "" || editContentBlog.value == ""){
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Please complete the information.',
      showConfirmButton: false,
      timer: 1200
    })
  }
  else{
    let [getEditImg] = editBlogImgBtn.files
    let getBlogID = BlogBoxID.getAttribute('id')
    getEditBlogData ={
      editTitle:editTitleBlog.value.trim(),
      editContent:editContentBlog.value,
      editCategory:editBlogCategory.value,
    }

    let editBlogDataSet = new FormData()
    editBlogDataSet.append('editBlogData',JSON.stringify(getEditBlogData))
    if(getEditImg != undefined){
      editBlogDataSet.append('editBlogImg',getEditImg)
    }

   Swal.fire({
    title: 'Confirm the content changes that have been made.',
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: '#4761ff',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirm',
    cancelButtonText: `Cancel`,
  }).then((result) => {
    if (result.isConfirmed) {
      // send data to server
      fetch(`/admin/manageBlog/editBlog/${getBlogID}` ,{
        method:"POST",
        body:editBlogDataSet
       }).then(res =>res.json())
       .then(json => Swal.fire({
        position: 'center',
        icon: `${JSON.stringify(json.icon).slice(1, -1)}`,
        title: `${JSON.stringify(json.title).slice(1, -1)}`,
        text:`${JSON.stringify(json.text).slice(1, -1)}`,
        showConfirmButton: false,
        timer: 1000
      })  )
    }
  })


  }

})

}


// -----------  ### DeleteBlog.hbs ###
let deleteBlogBtn = document.querySelectorAll('.adminDashboard .delete-blog')
// /admin/manageAdmin/deleteAdmin/blog-{{this.id}}
if(deleteBlogBtn){
  deleteBlogBtn.forEach((deleteBtn)=>{
    deleteBtn.addEventListener('click',(event)=>{
        event.preventDefault()
        let getBtnID = event.currentTarget.id
       
        Swal.fire({
          title: 'Confirm to delete this blog',
          text:"If you press delete, it cannot be recovered.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#000',
          confirmButtonText: 'Delete',
          cancelButtonText: `Cancel`,
        }).then((result) => {
          if (result.isConfirmed) {
            // send delete data to server
            fetch(`/admin/manageBlog/deleteBlog/blog-${getBtnID}`, {
                method: "POST"
              }).then(res => res.json())
              .then(json => Swal.fire({
                position: 'center',
                icon: `${JSON.stringify(json.icons).slice(1, -1)}`,
                title: `${JSON.stringify(json.system).slice(1, -1)}`,
                showConfirmButton: false,
                timer: 1000
              })       
              );
              setTimeout(() => {
                document.location.reload();
              }, 1100);
          }
        })
     })
  })
  
}

//-------------- If there are less than 3 content blogs, they cannot be deleted. (manageBlog.hbs)
if(allBlogTable.length <= 3){
  allBlogTable.forEach((blogDeleteBtn)=>{
      blogDeleteBtn.style.display="none"
  })
}

// ============================================================
//                   ViewDetailContact.hbs
// ============================================================
let sendEmailToClient = document.querySelector('.btn-send-email')
let subjectInput = document.querySelector('#subject_Input')
let sendAdminEmail = document.querySelector('#adminEmail')
let sendClientEmail = document.querySelector('#clientEmail')


if(sendEmailToClient){
  sendEmailToClient.addEventListener('click',()=>{
    // subjectInput.value= ""
  
    if(sendAdminEmail.value.trim() == ""){
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Please provide an email address to be sent back to the client.",
        showConfirmButton: true,
      });
    }
    else if(sendClientEmail.value.trim() == ""){
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Please provide a customer email address to respond to.",
        showConfirmButton: true,
      });
    }
    else if(subjectInput.value.trim()== ""){
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Please specify the content to be sent back to the customer.",
        showConfirmButton: true,
      });
    }
    else{
      Swal.fire({
        title: ' Confirm to send a response to the user via email. ',
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#4761ff',
        cancelButtonColor: '#000',
        confirmButtonText: 'Send',
        cancelButtonText: `Cancel`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "The contact information has been returned to the contact.",
            showConfirmButton: true,
          });

           subjectInput.value= ""
        }
      })
  
    }
  })
}

// ============================================================
//           Manage Admin (create,edit,changePwd,delete)
// ============================================================
// search admin list in adminDashboard (admin.hbs) 
let searchAdminName = document.querySelector('#searchAdminName')
let adminNameList = document.querySelectorAll(".admin-list tr .adminName") 

if(searchAdminName){
  searchAdminName.addEventListener("change",(e)=>{
    let getSearchAdminName = e.target.value
  
    adminNameList.forEach((titleTx)=>{
      let getAdminTitleTx = titleTx.textContent

      let lowerTitle =  getAdminTitleTx.toLowerCase()
      let upperTitle =  getAdminTitleTx.toUpperCase()
  
      let searchTextLower =  lowerTitle.includes(getSearchAdminName)
      let searchTextUpper =  upperTitle.includes(getSearchAdminName)

      let parentTR = titleTx.parentElement
      console.log(parentTR)

      if(searchTextLower || searchTextUpper){
         parentTR.style.display="table-row"
         searchAdminName.value =""
    }else{
         parentTR.style.display="none"
    }
    })
  })
}

//-------------------- ### createAdmin.hbs 
// btn import image
let createAdminBtn = document.querySelector('.create_Admin_Btn')
let adminUser = document.querySelector('#admin-name')
let adminEmail = document.querySelector('#admin-email')
let adminPassword = document.querySelector('#admin-password')
let adminConfirmPassword = document.querySelector('#admin-confirm-password')
let adminImgInput = document.querySelector('#adminImg')
let adminImgName = document.querySelector('.admin-img-name')

// import file img name and display text in upload img btn
if (adminImgInput) {
  adminImgInput.addEventListener('change', () => {
    let image = adminImgInput.files[0].name
    adminImgName.innerHTML = image
    console.log(image)
  })

}
// Check input before send data to backend
if (createAdminBtn) {
  createAdminBtn.addEventListener('click', (event) => {
    event.preventDefault()
    key = checkInput([adminUser, adminEmail, adminPassword, adminConfirmPassword])

    if (key) {
      // Check input all in Create admin
      if (!checkEmail(adminEmail.value.trim())) {
        errorInvalid(adminEmail, "Please enter correct email information.")
      } else if (adminPassword.value.length < 10) {
        errorInvalid(adminPassword, "Please enter a minimum password of 10 characters.")
      } else if (adminPassword.value !== adminConfirmPassword.value) {
        errorInvalid(adminConfirmPassword, "passwords do not match")
        adminConfirmPassword.value = ""
      } else if (adminImgInput.files[0] == undefined) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Please select an image',
          showConfirmButton: false,
          timer: 1500
        })
      } else {

        const [adminImg] = adminImgInput.files
        if (adminImg && adminImg.type.includes("image")) {
          adminData = {
            adminUser: adminUser.value.trim(),
            adminEmail: adminEmail.value.trim(),
            adminPassword: adminPassword.value.trim(),
            adminConfirmPassword: adminConfirmPassword.value.trim(),
          }
          const formAdminData = new FormData()
          formAdminData.append('adminData', JSON.stringify(adminData));
          formAdminData.append('adminImg', adminImg);

          // send create admin data to server 
          fetch('/admin/manageAdmin/createAdmin', {
              method: 'POST',
              body: formAdminData,
            }).then(res => res.json())
            .then(json =>   {Swal.fire({
              position: 'center',
              icon: `${JSON.stringify(json.icon).slice(1, -1)}`,
              title: `${JSON.stringify(json.title).slice(1, -1)}`,
              text: `${JSON.stringify(json.text).slice(1, -1)}`,
              showConfirmButton: false,
              timer: 1700
            })
            if(JSON.stringify(json.icon).slice(1, -1) == "error"){
              // check data if email have in database  delete only email input
              adminEmail.value = ""
            }else{
              // after finish create admin clear all data in input
              adminUser.value = ""
              adminEmail.value = ""
              adminPassword.value = ""
              adminConfirmPassword.value = ""
              adminImgInput.value = ""
              adminImgName.innerHTML = "Choose Image..."
            }
          
          });
        }
      }
    }

  })
}
// if input check data fail
function errorInvalid(inputID, messageError) {
  let parentInput = inputID.parentElement
  parentInput.classList.add('error')
  let showErr = parentInput.querySelector('.error_invalid')
  showErr.innerText = messageError
}

// in input check data success
function successInput(inputID) {
  let parentInput = inputID.parentElement
  parentInput.classList.remove('error')
}

// check all input whether there is a blank value or not
function checkInput(allInput) {
  let checkAll = []
  allInput.forEach((inputBx) => {
    let text = inputBx.getAttribute('id').replace('admin-', '')
    if (inputBx.value.trim() == "") {
      errorInvalid(inputBx, `Please enter ${text}`)
      checkAll.push(false)
    } else if (inputBx.value.trim() !== "") {
      checkAll.push(true)
      successInput(inputBx)
    }
  })
  //  if any input have data
  return checkAll.every(element => element === true)
}

// Check email input
function checkEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}


// -----------  ### DeleteAdmin.hbs
let checkPwd = document.querySelector('#check_pwd_del_admin')
let delAdminBtn = document.querySelector('.delete_Admin_Btn')
let adminName = document.querySelector('.adminDelName')
let adminIDTxt = document.querySelector('.showDeleteAdmin  span')

if (delAdminBtn) {
  delAdminBtn.addEventListener('click', () => {
    if (checkPwd.value.trim() == "") {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Please enter your password.',
        showConfirmButton: false,
        timer: 1000
      })
    } else {
      let getIDAdmin = adminIDTxt.getAttribute('id')

      Swal.fire({
        title: 'Confirm to delete ',
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#000',
        confirmButtonText: 'Delete',
        cancelButtonText: `Cancel`,
      }).then((result) => {
        if (result.isConfirmed) {
          delAdminData = {
            adminID:getIDAdmin,
            adminName: adminName.innerText,
            adminPassword: checkPwd.value.trim()
          }
          // send data to server
          fetch('/admin/deleteAdmin', {
              method: "POST",
              body: JSON.stringify(delAdminData),
              headers: {
                'Content-Type': 'application/json'
              }
            }).then(res => res.json())
            .then(json => Swal.fire({
              position: 'center',
              icon: `${JSON.stringify(json.icons).slice(1, -1)}`,
              title: `${JSON.stringify(json.system).slice(1, -1)}`,
              showConfirmButton: false,
              timer: 1000
            }));

            checkPwd.value = ""
        }
      })

      
    }
  })
}

// 
//---------------- ### editAdmin.hbs
// 
let adminName_edit = document.querySelector('#edit-admin-name')
let adminEmail_edit = document.querySelector('#edit-admin-email')
let adminPwd_check = document.querySelector('#edit-admin-password')
let editAdminBtn = document.querySelector('.edit_Admin_Btn')

if(editAdminBtn){
  editAdminBtn.addEventListener('click',()=>{
    checkKey = check_Input_Edit_Admin([ adminName_edit,adminPwd_check])
  
    if(checkKey){
        let editAdminData = new FormData()
        const [getEditAdminImg] = adminImgInput.files
  
        if(getEditAdminImg && getEditAdminImg.type.includes("image")){
          editAdminData.append('adminEditImg',getEditAdminImg)
        }
        else{
          editAdminData.append('adminEditImg',[])
        }
        // get new data
        adminNewData = {
           editAdminName:adminName_edit.value.trim(),
           checkAdminPwd:adminPwd_check.value.trim()
        }

        let checkInput = "true"
        if(adminEmail_edit.value !== ""){
          if(!checkEmail(adminEmail_edit.value.trim())){
               errorInvalid_Edit(adminEmail_edit,"Please enter correct email information.")
               checkInput = "false"
         }else{
          adminNewData.editAdminEmail = adminEmail_edit.value.trim()
          checkInput = "true"
         }
       }


        //  if email input not have error 
       if(checkInput == "true"){
        editAdminData.append("adminNewData",JSON.stringify(adminNewData))
        let getAdmin_ID = editAdminBtn.getAttribute('id')
        console.log(getAdmin_ID)
        fetch(`/admin/manageAdmin/editAdmin/${getAdmin_ID}`,{
          method:"POST",
          body:editAdminData 
        }).then(res => res.json())
        .then(json =>{
          Swal.fire({
            position: 'center',
            text:`${JSON.stringify(json.text).slice(1, -1)}`,
            icon: `${JSON.stringify(json.icons).slice(1, -1)}`,
            title: `${JSON.stringify(json.system).slice(1, -1)}`,
            showConfirmButton: false,
            timer: 1800
          })
          if(JSON.stringify(json.icons).slice(1, -1) == "error"){
              adminEmail_edit.value = ""
              adminPwd_check.value = ""
            }
        else{
          adminEmail_edit.value = ""
          adminPwd_check.value = ""
          adminImgName.innerHTML = "Choose Image..."

          setTimeout(()=>{
            window.location.reload()
          },1200)
        }
        })
      
       }
      
  
    }
  })
  














  // check change admin password input
  function check_Input_Edit_Admin(allInput) {
    let checkAll = []
    allInput.forEach((inputBx) => {
      if (inputBx.value.trim() == "") {
        checkAdmin = ["username","password"]
        let getIndex = allInput.indexOf(inputBx)
        errorInvalid_Edit(inputBx, `Please enter ${checkAdmin[getIndex]}`)
        checkAll.push(false)
      } else if (inputBx.value.trim() !== "") {
        checkAll.push(true)
        success_Edit_Input_Bx(inputBx)
      }
    })
    //  if input have data
    return checkAll.every(element => element === true)
  }
  

  
  // If user enters all information
  function success_Edit_Input_Bx(inputID) {
    let parentInput = inputID.parentElement
    parentInput.classList.remove('error')
  }
  
  // If the user enters all information
  function errorInvalid_Edit(inputID, messageError) {
    let parentInput = inputID.parentElement
    parentInput.classList.add('error')
    let showErr = parentInput.querySelector('.edit_error_invalid')
    showErr.innerText = messageError
  }
  
}

//--------------- ### changePwdAdmin.hbs
let adminName_changePwd = document.querySelector('#admin-name-changePwd')
let adminEmail_changePwd = document.querySelector('#admin-email-changePwd')
let adminOldPwd_changePwd = document.querySelector('#admin-old-password-changePwd')
let adminNewPwd_changePwd = document.querySelector('#admin-new-password-changePwd')
let adminConfirmPwd_changePwd = document.querySelector('#admin-confirm-password-changePwd')
let changePwd_Admin_Btn = document.querySelector('.changePwd_Admin_Btn')

if(changePwd_Admin_Btn){
  changePwd_Admin_Btn.addEventListener('click',()=>{
    // check input
    checkKey = check_Input_Change_Admin([
      adminOldPwd_changePwd,
      adminNewPwd_changePwd,
      adminConfirmPwd_changePwd])
      
      // if check finish
      if(checkKey){
         if( adminNewPwd_changePwd.value.trim() !== adminConfirmPwd_changePwd.value.trim()){
           errorInvalid_changePwd(adminConfirmPwd_changePwd, `The new password and the confirm password do not match.`)
         }
         else if( adminNewPwd_changePwd.value.trim().length < 10){
          errorInvalid_changePwd(adminNewPwd_changePwd, `Please enter a minimum password of 10 characters.`)
         }
         else{
          let getAdmin_ID = changePwd_Admin_Btn.getAttribute('id')
          Swal.fire({
            icon:"warning",
            title: 'Do you want to change password',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
          }).then((result) => {
          //  send data to server
            if (result.isConfirmed) {
              let adminPwdData = {
                adminOldPassword: adminOldPwd_changePwd.value.trim(),
                adminNewPassword:  adminNewPwd_changePwd.value.trim(),
                adminConfirmNewPassword:adminConfirmPwd_changePwd.value.trim(),
              }
  
              console.log(adminPwdData)
              // send data to backend
               fetch(`/admin/manageAdmin/changePwd/admin-${getAdmin_ID}`,{
                 method:"POST",
                 body:JSON.stringify(adminPwdData),
                 headers: {
                  'Content-Type': 'application/json'
                }
               }).then(res => res.json())
               .then(json => Swal.fire({
                position: 'center',
                text:`${JSON.stringify(json.text).slice(1, -1)}`,
                icon: `${JSON.stringify(json.icons).slice(1, -1)}`,
                title: `${JSON.stringify(json.system).slice(1, -1)}`,
                showConfirmButton: false,
                timer: 1300
              }));
  
              adminOldPwd_changePwd.value = ""
              adminNewPwd_changePwd.value = ""
              adminConfirmPwd_changePwd.value = ""
            } 
          })
         }
      }
  })
  
  // check change admin password input
  function check_Input_Change_Admin(allInput) {
    let checkAll = []
    allInput.forEach((inputBx) => {
      if (inputBx.value.trim() == "") {
        checkAdmin = ["old password","new password","confirm password"]
        let getIndex = allInput.indexOf(inputBx)
        errorInvalid_changePwd(inputBx, `Please enter ${checkAdmin[getIndex]}`)
        checkAll.push(false)
      } else if (inputBx.value.trim() !== "") {
        checkAll.push(true)
        success_Change_Pwd_Input_Bx(inputBx)
      }
    })
    //  if input have data
    return checkAll.every(element => element === true)
  }
  
  // If user enters all information
  function success_Change_Pwd_Input_Bx(inputID) {
    let parentInput = inputID.parentElement
    parentInput.classList.remove('error')
  }
  
  // If the user enters all information
  function errorInvalid_changePwd(inputID, messageError) {
    let parentInput = inputID.parentElement
    parentInput.classList.add('error')
    let showErr = parentInput.querySelector('.changePwd_error_invalid')
    showErr.innerText = messageError
  }
  
}

//-------------------------------------------------------------- 
//           Make sure this admin is logged in.
//   will not be able to delete itself in manageAdmin.hbs
//--------------------------------------------------------------
let getAllAdminEmail = document.querySelectorAll('.manageAdminBx .adminEmail')

if(getAllAdminEmail){
  fetch('/admin/manageAdmin/protectAdminDelete',{
    method:"POST"
  }).then(res => res.json())
  .then((json) =>{
  
    getAllAdminEmail.forEach((adminEmail)=>{
        if(json.getAdminEmailDB == adminEmail.innerText){
          let parentAdminBx = adminEmail.parentElement
          let getAdminDelBtn = parentAdminBx.querySelector('.delete-admin')
          getAdminDelBtn.style.display = "none"
        }
    })
    
  })
}




// =============================================
//--------------- ### logoutAdmin.hbs
// =============================================
let logoutAdminBtn = document.querySelector("#adminLogout")

if(logoutAdminBtn){
  logoutAdminBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    Swal.fire({
      title: 'Do you want to log out ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#000',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
       fetch("/logoutAdmin",{method:"GET" }).then()
       var logoutUrl = window.location.protocol + "//" + window.location.host + "/loginAdmin";
       window.location.replace(logoutUrl);
      }
    })
  })
}

