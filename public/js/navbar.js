//  MENU BAR TOGGLE
let navList = document.querySelector('.nav-list')
let menuBar = document.querySelector('.menu-bar')

if(menuBar){
  menuBar.addEventListener('click',()=>{
    navList.classList.toggle('active')
})
}


//========  NAVBAR SLIDE =============
let navbar = document.querySelector('.navbar')
if(navbar){
  window.addEventListener('scroll',()=>{
    navbar.classList.toggle('sticky', window.scrollY > 300)
})
}


// ======= NAVLIST ACTIVE===========
// If user click navlist it show active color text
let allNavList = document.querySelectorAll('.nav-list li a')
let activePage = window.location.pathname;

allNavList.forEach(link =>{
  
if(activePage == "/"){
  activePage = "/home"
}
if(activePage == "/community/newPost"){
  activePage = "/community"
}
if(link.href.includes(`${activePage}`)){
  link.classList.add('active');
}
})


