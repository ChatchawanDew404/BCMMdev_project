let getAdminEmail = document.querySelector('#login_page_admin_email')
let getAdminPwd = document.querySelector('#login_page_admin_pwd')
let loginAdminPageBtn = document.querySelector('.admin-loginBtn')

if(loginAdminPageBtn){
    loginAdminPageBtn.addEventListener('click',()=>{
        if(getAdminEmail.value.trim() == "" || getAdminPwd.value.trim() == "" ){
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please complete the information.',
                showConfirmButton: false,
                timer: 1500
              })
        }
        else{
            checkLoginAdmin = {
                adminEmail:getAdminEmail.value.trim(),
                adminPassword:getAdminPwd.value
            }
    
            fetch("/checkLoginAdminData",{
                method:"POST",
                body:JSON.stringify(checkLoginAdmin),
                headers:{ 'Content-Type': 'application/json' }
            }).then(res => res.json())
            .then(json =>{
                if(json.checkAdmin == "false"){
                    Swal.fire({
                        position: 'center',
                        text:`${JSON.stringify(json.text).slice(1, -1)}`,
                        icon: `${JSON.stringify(json.icon).slice(1, -1)}`,
                        title: `${JSON.stringify(json.title).slice(1, -1)}`,
                        showConfirmButton: false,
                        timer: 2000
                      })
                }
                else if(json.checkAdmin == "true"){
                    var newUrl = window.location.protocol + "//" + window.location.host + JSON.stringify(json.page).slice(1, -1);
                    window.location.replace(newUrl);
                }
            })
    
        
        }
       
    })
}