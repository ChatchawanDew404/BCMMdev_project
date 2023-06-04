// เรียกใช้งาน .env
require('dotenv').config()
// ---------- import all extension ---------------------
const express = require('express')
const hbs = require('hbs')
const app = express();
const path = require('path')
const body = require('body-parser')
const fileUpload = require('express-fileupload')
const expressSession = require('express-session')
const flash = require('connect-flash')


// import all router
const communityRouter = require('./routers/community')
const blogRouter = require('./routers/blog')
const generalRouter = require('./routers/general')
const adminRouter = require('./routers/admin')


// ================== SET UP PORJECT (Import)==================
// send body parser modules 
app.use(express.urlencoded({extended:true}))
app.use(body())
app.use(fileUpload());
app.set('view engine','hbs')
app.use(expressSession({secret: "node secret"}))
app.use(express.urlencoded())
app.use(flash())
// make file component
hbs.registerPartials(__dirname + "/views/partials");
app.use('/public',express.static(path.join(__dirname ,'public')))
app.use("/bxIcons", express.static(path.join(__dirname, "node_modules/boxicons")));
app.use("/swiperSlide", express.static(path.join(__dirname, "node_modules/swiper")));
app.use("/typedText", express.static(path.join(__dirname, "node_modules/typed.js")));
// =========================================================

const port = process.env.APP_PORT || 3001

app.use('/',generalRouter)
app.use('/blog',blogRouter)
app.use('/community',communityRouter)
app.use('/admin',adminRouter)

// if have weird url we are show 404 page
app.use(function(req,res,next){
res.status(404).render('404page.hbs')
})

app.listen(port,"0.0.0.0",()=>{
    console.log(`http://localhost:${port}`)
})

// ------------------------------------------------------------------
//           Started building from 8 March until 21 May.
// ------------------------------------------------------------------