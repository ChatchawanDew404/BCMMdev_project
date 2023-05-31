const express = require('express')
const router = express.Router();
const connectDB = require('../db')
const dayjs = require('dayjs')
const bcrypt = require('bcrypt')


router.get('/',async(req,res)=>{
  let getAllBlogData = []
  let getAllPostData = []
  try{
    // get all blog in database
    getAllBlogData = await connectDB
    .select('*')
    .from('bcmmdev_blog')

    getAllBlogData =  getAllBlogData.map((getData)=>{
      const createBlogAt = dayjs(getData.date).format('D MMM YYYY')
      return {createBlogAt,...getData}
    })

    // get all Post in database
    getAllPostData = await connectDB
    .select('community_all_post.id','community_all_post.username','community_all_post.category ','community_all_post.content','community_all_post.postTime','community_all_post.userImage')
    .count('community_all_post_comments.id as commentsCount')
    .from('community_all_post')
    .leftJoin('community_all_post_comments','community_all_post.id',' community_all_post_comments.postID')
    .groupBy('community_all_post.id')
    .orderBy('community_all_post.id','desc')

    getAllPostData = getAllPostData.map((data)=>{
      const createPostAt = dayjs(data.postTime).format('D MMM YYYY')
      return {createPostAt,...data}
    })
  }
  catch(err){
   console.log(err)
  }
    res.render('home.hbs',{ getAllBlogData, getAllPostData })
})


router.get('/home',async(req,res)=>{
  let getAllBlogData = []
  let getAllPostData = []
  try{
    // get all blog in database
    getAllBlogData = await connectDB
    .select('bcmmdev_blog.id',
    'bcmmdev_blog.title',
    'bcmmdev_blog.category',
    'bcmmdev_blog.date',
    'bcmmdev_blog.imageBlog',
    'bcmmdev_admin.username')
    .from('bcmmdev_blog')
    .leftJoin('bcmmdev_admin',"bcmmdev_blog.adminCreator","bcmmdev_admin.id")
    .orderBy('id', 'desc')
    
    getAllBlogData =  getAllBlogData.map((getData)=>{
      const createBlogAt = dayjs(getData.date).format('D MMM YYYY')
      return {createBlogAt,...getData}
    })

    // get all Post in database
    getAllPostData = await connectDB
    .select('community_all_post.id','community_all_post.username','community_all_post.category ','community_all_post.content','community_all_post.postTime','community_all_post.userImage')
    .count('community_all_post_comments.id as commentsCount')
    .from('community_all_post')
    .leftJoin('community_all_post_comments','community_all_post.id',' community_all_post_comments.postID')
    .groupBy('community_all_post.id')
    .orderBy('community_all_post.id','desc')

    getAllPostData = getAllPostData.map((data)=>{
      const createPostAt = dayjs(data.postTime).format('D MMM YYYY')
      return {createPostAt,...data}
    })
  }
  catch(err){
   console.log(err)
  }
  // console.log(getAllBlogData)
    res.render('home.hbs',{ getAllBlogData, getAllPostData })
})

router.get('/about',(req,res)=>{
    res.render('about.hbs')
})

// ------- Blog ---------------------
router.get('/blog',async(req,res)=>{
  let allBlogData = []
  try{
    // get all blog data and display in blog.hbs
    allBlogData = await connectDB
    .select('bcmmdev_blog.id',
    'bcmmdev_blog.title',
    'bcmmdev_blog.category',
    'bcmmdev_blog.date',
    'bcmmdev_blog.imageBlog',
    'bcmmdev_admin.username')
    .from('bcmmdev_blog')
    .leftJoin('bcmmdev_admin',"bcmmdev_blog.adminCreator","bcmmdev_admin.id")
    .orderBy('id', 'desc')

    allBlogData =  allBlogData.map((getData)=>{
      const createBlogAt = dayjs(getData.date).format('D MMM YYYY')
      return {createBlogAt,...getData}
    })
  }
  catch(err){
    console.log(err)
  }
    res.render('blog.hbs',{ allBlogData})
})


// ------- Community -----------------------
// Show all community post and quantity comment
router.get('/community',async (req,res)=>{
   let allPostData =[]

   try{
        allPostData = await connectDB
        .select('community_all_post.id','community_all_post.username','community_all_post.category ','community_all_post.content','community_all_post.postTime','community_all_post.userImage')
        .count('community_all_post_comments.id as commentsCount')
        .from('community_all_post')
        .leftJoin('community_all_post_comments','community_all_post.id',' community_all_post_comments.postID')
        .groupBy('community_all_post.id')
        .orderBy('community_all_post.id','desc')

        allPostData = allPostData.map((data)=>{
           const createDateAt = dayjs(data.postTime).format('D MMM YYYY - HH:mm')
           return {createDateAt,...data}
        })
   }
   catch(err){
      console.log(err)
   }
    res.render('community.hbs',{allPostData})
})

// ------------ Contact.hbs -------------
router.get('/contact',(req,res)=>{
    res.render('contact.hbs')
})

router.post('/contactData',async(req,res)=>{
  const { username,email,subject,message,contactDate} = req.body

try{
  if(username !== undefined || email !== undefined || subject !== undefined || message !== undefined || contactDate !== undefined)
   await connectDB.insert({username:username,email:email,subject:subject,message:message,date:contactDate}).into('bcmmdev_contact')
}catch(err){
  console.log(err)
}
})


// --------------------------------------


router.get('/register',(req,res)=>{
    res.render('register.hbs')
})


//------- LOGIN ADMIN SYSTEM ----------------
router.get('/loginAdmin',(req,res)=>{
 res.render('loginAdmin.hbs')
})

// check admin if have admin(use email) in system
router.post('/checkLoginAdminData',async(req,res,next)=>{
   const {adminEmail,adminPassword} = req.body
try{
    let [getAdminDB] = await connectDB
    .select('*')
    .from('bcmmdev_admin')
    .where("bcmmdev_admin.email",adminEmail)

    if(getAdminDB){
        let checkPwd = bcrypt.compare(adminPassword,getAdminDB.password).then((match)=>{
            if(match){
                req.session.adminID = getAdminDB.id
                res.json({title:"",icon:"",text:"",checkAdmin:"true",page:"/admin"})
            }
            else{
                res.json({title:"password is incorrect",icon:"warning",text:"please try again",checkAdmin:"false"})
            }
        })
    }
    else{
        res.json({title:"This email does not exist in the system.",icon:"error",text:"please try again",checkAdmin:"false"})
    }
}catch(err){
  console.log(err)
}
})

// display Admin Page if login successfully
router.get('/admin',async(req,res)=>{
  if(req.session.adminID){
    try{
         let [quantityAdmin]  = await connectDB
         .select().count("bcmmdev_admin.id as countAdmin") 
         .from('bcmmdev_admin')

         let [quantityPost]  = await connectDB
         .select().count("community_all_post.id as countPost") 
         .from('community_all_post')

         let [quantityContact]  = await connectDB
         .select().count("bcmmdev_contact.id as countContact") 
         .from('bcmmdev_contact')

         let [quantityBlog]  = await connectDB
         .select().count("bcmmdev_blog.id as countBlog") 
         .from('bcmmdev_blog')

         res.render('admin.hbs',{quantityAdmin,quantityPost,quantityContact,quantityBlog})
    }
    catch(err){
      console.log(err)
    }
  }else{
    res.render('loginAdmin.hbs')
  }
})

router.post("/postDataAnalytics",async(req,res)=>{
try{
  let testSomething = await connectDB
  .select("community_all_post.category").count("community_all_post.category as quantityCategory")
  .from('community_all_post')
  .groupBy('community_all_post.category')

  if( testSomething){
    res.json(testSomething)
  }
}
catch(err){
console.log(err)
}
})


// show headerBar in adminDashboard
router.post('/getAdminHeader',async(req,res)=>{
  if(req.session.adminID){
    try{
        adminLoginData = await connectDB
        .select("*")
        .from("bcmmdev_admin")
        .where("bcmmdev_admin.id",req.session.adminID)

        res.json({adminName:adminLoginData[0].username,adminImage:adminLoginData[0].image})
    }
    catch(err){
       console.log(err)
    }
  }else{
    res.render('loginAdmin.hbs')
  }
})

// --------- LOGOUT -------------------------------
router.get('/logoutAdmin',(req,res)=>{
      req.session.destroy()
  })
  


module.exports = router