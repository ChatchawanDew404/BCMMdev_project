// let bannerText = document.querySelector('.banner h1')
// let activeBanner = window.location.pathname;

// let delFirstBannerPath = activeBanner.slice(1)
// let upperFirstTextBanner = delFirstBannerPath.charAt(0).toUpperCase() + delFirstBannerPath.slice(1)

// if(upperFirstTextBanner == 'Community/newPost'){
//   upperFirstTextBanner = 'Community'
// }

// var TypeTx = new Typed('#banner_Tx', {
//   strings: [upperFirstTextBanner,""],
//   typeSpeed: 200,
//   backSpeed:100,
//   loop:true
// });



let banner_Text = document.querySelector('.banner h1')

if( banner_Text){
  let atb_banner_tx = banner_Text.getAttribute("data-banner-Text");

  let TypeTx = new Typed('#banner_Tx', {
    strings: [atb_banner_tx],
    typeSpeed: 200,
    backSpeed:100,
    loop:true
  });
  
}