let registerBx = document.querySelector('.register-bx')
let registerNow = document.querySelector('.register-now')
let registerBtn = document.querySelector('.register-btn')

let loginBx = document.querySelector('.login-bx')
let loginNow = document.querySelector('.login-now')
let loginBtn = document.querySelector('.login-btn')


if(registerBtn){
    registerBtn.addEventListener('click',()=>{
        registerBx.classList.add('active')
        registerBtn.classList.add('active')
        
        loginBx.classList.remove('active')
        loginBtn.classList.remove('active')
    })
    
    registerNow.addEventListener('click',()=>{
        registerBx.classList.add('active')
        registerBtn.classList.add('active')
        
        loginBx.classList.remove('active')
        loginBtn.classList.remove('active')
    })
    
    loginBtn.addEventListener('click',()=>{
        loginBx.classList.add('active')
        loginBtn.classList.add('active')
    
        registerBx.classList.remove('active')
        registerBtn.classList.remove('active')
    })
    loginNow.addEventListener('click',()=>{
        loginBx.classList.add('active')
        loginBtn.classList.add('active')
    
        registerBx.classList.remove('active')
        registerBtn.classList.remove('active')
    })
    
    
}