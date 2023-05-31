let videoPopup = document.querySelector('.video-popup')
let closeVideo = document.querySelector('.close-video')
let showVideo  =document.querySelector('.play-video-btn')


if(showVideo){
    showVideo.addEventListener('click',()=>{
        videoPopup.classList.add('active')
    })
    closeVideo.addEventListener('click',()=>{
        videoPopup.classList.remove('active')
    })
}



// ----- Community slide section
let allTextCmmSlide = document.querySelectorAll('.community-slide-content')

let maxTx = "..."

// ---- show max text in Community user post  length text <= 150 text
if(allTextCmmSlide.length != 0){
    allTextCmmSlide.forEach((textCmmBx)=>{
        let text = textCmmBx.textContent
            delExcessTxt = text.slice(0,150)
            textCmmBx.innerHTML = delExcessTxt + maxTx   
})}