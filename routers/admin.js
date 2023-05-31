const express = require('express');
const router = express.Router();
const connectDB = require('../db')
const dayjs = require('dayjs')
const bcrypt = require('bcrypt')
const fs = require('fs');
const session = require('express-session');

// -----------------------------------------------
//                  MANAGE BLOG 
// ------------------------------------------------
// ----------- Show all blog data
router.get('/manageBlog',async(req,res)=>{
  if(req.session.adminID){
    allBlog = []
    try{
      // get all blog data in DB and show in manageBlog.hbs
      allBlog = await connectDB
      .select('bcmmdev_blog.id',
      'bcmmdev_blog.title',
      'bcmmdev_blog.content',
      'bcmmdev_blog.category',
      'bcmmdev_blog.date',
      'bcmmdev_blog.imageBlog',
      'bcmmdev_admin.username')
      .from('bcmmdev_blog')
      .leftJoin('bcmmdev_admin',"bcmmdev_blog.adminCreator","bcmmdev_admin.id")
      .orderBy('id', 'desc')
       // change time to basic time display
       allBlog = allBlog.map((data) =>{
        const date = dayjs(data.date).format('D MMM YYYY')
        return{...data, date}})
    }
    catch(err){
      console.log(err)
    }
    // console.log(allBlog)
    res.render('adminSystem/manageBlog.hbs',{  allBlog })  
  }
  else{
     res.render("loginAdmin.hbs")
  } 
})
// ----- ### create Blog
router.get('/manageBlog/createBlog',(req,res)=>{
  if(req.session.adminID){
    res.render('adminSystem/createBlog.hbs')
  }
  else{
     res.render("loginAdmin.hbs")
  } 
})

router.post('/manageBlog/createBlog',async(req,res)=>{
  let getBlogImg = req.files.blogImage
  let { blogTitle,blogCategory,blogContent,} = JSON.parse(req.body.blogData)

  try{
    // get admin data to check
    const getAdminData = await connectDB
    .select("*")
    .from('bcmmdev_admin')
    .where('bcmmdev_admin.id',req.session.adminID)

     const date = new Date()
     const newImgBlogName = date.getDate() + date.getTime() + "_" + getBlogImg.name
     const path = "public/createBlogImg/" + newImgBlogName

   if(getBlogImg){
    // create blog data and add to db and add img to folder
    let createBlogData = {
      blogTitle:blogTitle,
      blogCategory:blogCategory,
      blogContent:blogContent,
      blogDate:new Date(),
      adminCreatorID:req.session.adminID
   }

    await getBlogImg.mv(path,async(err,result)=>{
      if(err){throw err}
      else{
         await connectDB.insert({title:createBlogData.blogTitle,
          content:createBlogData.blogContent,
          category:createBlogData.blogCategory,
          date:createBlogData.blogDate,
          imageBlog:newImgBlogName,
          adminCreator:createBlogData.adminCreatorID}).into('bcmmdev_blog')
         res.json({title:"Your blog has been created.",icon:"success"})
      }
   })

   }

  }
  catch(err){
    res.json({title:"Unable to create blog something went wrong.",icon:"error"})
  }

})

// ----- ## edit Blog
router.get('/manageBlog/editBlog/:blogID',async(req,res)=>{
  if(req.session.adminID){
    let {blogID}= req.params
    let getEditBlogIDTx = blogID.match(/\d/g);
    getEditBlogIDTx =  getEditBlogIDTx.join("")
    let getEditBlogID = parseInt(getEditBlogIDTx )
    try{
      [getEditBlogData] = await connectDB
      .select('*')
      .from('bcmmdev_blog')
      .where('id',getEditBlogID)

      res.render('adminSystem/editBlog.hbs',{getEditBlogData})
    }
    catch(err){
      console.log(err)
    }
  }
  else{

  }
})

router.post('/manageBlog/editBlog/:editBlogID',async(req,res)=>{
   const {editBlogID} = req.params
   const { editTitle,editContent,editCategory} = JSON.parse(req.body.editBlogData)
   let editBlogImg = null

   try{
    getBlogData = await connectDB
    .select('*')
    .from('bcmmdev_blog')
    .where('id',"=",editBlogID)

    //  if user change Image and update img in edit blog 
    if(req.files){
      editBlogImg = req.files.editBlogImg
      const date = new Date()
      let newEditImage = date.getDate() + date.getTime() + "_" +  editBlogImg.name
      let oldBlogImage = getBlogData[0].imageBlog
      // add new img to createBlog folder and delete old blog img
      let newEditPathImg = "public/createBlogImg/" + newEditImage
      let oldBlogPathImg = "public/createBlogImg/" + oldBlogImage
      await editBlogImg.mv(newEditPathImg,async(err,result)=>{
           if(err){throw err;}
           else{
            fs.unlinkSync(oldBlogPathImg)
            await connectDB.update({imageBlog:newEditImage}).into('bcmmdev_blog').where("id","=",editBlogID)
           }
      })


     }
    // update new admin data
    res.json({title:"The blog information has been edited.",icon:"success",text:""})
    await connectDB.update({title:editTitle,content:editContent,category:editCategory}).into('bcmmdev_blog').where('id', '=', editBlogID)
     
   }
   catch(err){
      res.json({title:"Content cannot be changed.",icon:"error",text:"something went wrong"})
   }

})

// ----- ### delete Blog
router.post('/manageBlog/deleteBlog/:blogID',async(req,res)=>{
  let {blogID}  = req.params
  // get number in request url
  let getDelBlogIDTx = blogID.match(/\d/g);
  getDelBlogIDTx =  getDelBlogIDTx.join("")
  let getDeleteID = parseInt(getDelBlogIDTx )
  try{
    getBlogData = await connectDB
    .select('*')
    .from('bcmmdev_blog')
    .where('bcmmdev_blog.id',getDeleteID )

    console.log(getBlogData)

    if(getBlogData){
       let deleteBlogImg = getBlogData[0].imageBlog
       let pathDelImg = 'public/createBlogImg/' + deleteBlogImg
       fs.unlinkSync(pathDelImg)
       await connectDB('bcmmdev_blog').del().where('id', '=', getDeleteID)
    }
    res.json({system:"The blog has been deleted successfully.",icons:"success"})
  }
  catch(err){
    console.log(err)
  }

})

// -----------------------------------------------
//                  MANAGE CONTACT
// ------------------------------------------------
// show all client contact data
router.get('/manageContact',async(req,res)=>{ 
  if(req.session.adminID){
    allClientContactData = []
    try{
      allClientContactData = await connectDB
      .select('*')
      .from('bcmmdev_contact')
      .orderBy('id', 'desc')

      allClientContactData = allClientContactData.map((data) =>{
        const date = dayjs(data.date).format('D MMM YYYY')
        return{...data, date}})
    }
    catch(err){
      console.log(err)
    }
    res.render('adminSystem/manageContact.hbs',{ allClientContactData})   
  }
  else{
     res.render("loginAdmin.hbs")
  } 
})

// View client submitted content.
router.get('/manageAdmin/contactDetail/:contactID',async(req,res)=>{
  if(req.session.adminID){
    let {contactID} = req.params
    // get contact id in url
    let getContactIDTx = contactID.match(/\d/g);
    getContactIDTx = getContactIDTx.join("")
    let getContactID = parseInt(getContactIDTx)
    
    try{
         [getContactData] = await connectDB
         .select('*')
         .from('bcmmdev_contact')
         .where("id",getContactID)

         getContactData.date = dayjs(getContactData.date).format('D MMM YYYY - HH:mm')

    }catch(err){
       console.log(err)
    }
    res.render('adminSystem/viewDetailContact.hbs',{getContactData})
  }else{
    res.render("loginAdmin.hbs")
  }
})

// Delete client contact message 
router.post('/manageAdmin/deleteContact/:contactID',async(req,res)=>{
    let {contactID} = req.params
    // get contact id in url
    let getContactIDTx = contactID.match(/\d/g);
    getContactIDTx = getContactIDTx.join("")
    let getContactID = parseInt(getContactIDTx)
    
    try{
     if(getContactID){
      await connectDB('bcmmdev_contact').del().where('id', '=', getContactID)
      res.json({title:"Success to delete contact information.",icon:"success"})
     }
    }catch(err){
      res.json({title:"Failed to delete contact information.",icon:"error"})
    }
})



// -----------------------------------------------
//                  MANAGE ADMIN 
// -----------------------------------------------
// show all admin
router.get('/manageAdmin',async(req,res)=>{
    if(req.session.adminID){
      allAdmin = []
      try{
         allAdmin = await connectDB
          .select('*')
          .from('bcmmdev_admin')
      }
      catch(error){
          console.log(error)
      }
      res.render('adminSystem/manageAdmin.hbs',{allAdmin})    
    }
    else{
       res.render("loginAdmin.hbs")
    }
})

// ----- ### createAdmin
router.get('/manageAdmin/createAdmin',(req,res)=>{
  if(req.session.adminID){
    res.render('adminSystem/createAdmin.hbs')
  }
  else{
     res.render("loginAdmin.hbs")
  }
})

router.post('/manageAdmin/createAdmin',async(req,res)=>{
  const getAdminImg =  req.files.adminImg
  const {adminUser,adminEmail,adminPassword} = JSON.parse(req.body.adminData)
  const keyAdminPassword = bcrypt.hashSync(adminPassword,10)  
 try{
  getAdmin = await connectDB
  .select('*')
  .from('bcmmdev_admin')

    //-- change admin Img Name
    const date = new Date()
    const newAdminImgName = date.getDate() + date.getTime() + "_" + getAdminImg.name
    let path = 'public/adminImage/' + newAdminImgName

    // Check if email has already been used
    let checkEmailAdmin = getAdmin.find((checkEmail)=>{return adminEmail == checkEmail.email})
    if(checkEmailAdmin){
      res.json({title:"Unable to create admin",icon:"error",text:"This email is already in the system. Please use another email instead."})
    }else{
      getAdminImg.mv(path,async(err,result)=>{
        if(err){throw err;}
          else{
            res.json({title:"A new admin has been created.",icon:"success",text:""})
            await connectDB.insert({username:adminUser,email:adminEmail,password:keyAdminPassword,image:newAdminImgName}).into('bcmmdev_admin')
        }
       }) 
    }


 }
 catch(err){
    console.log(err)
 }
})


// ----- ### delete admin
router.get('/manageAdmin/deleteAdmin/:deleteAdminID',async(req,res)=>{
    if(req.session.adminID){
      let {deleteAdminID} = req.params
      // get admin id in url
      var getAdminIDTx = deleteAdminID.match(/\d/g);
      getAdminIDTx = getAdminIDTx.join("")
      let getAdminID = parseInt(getAdminIDTx)
      adminDataArr = []
    try{
      const adminDataArr = await connectDB
      .select('*')
      .from('bcmmdev_admin')
      .where('bcmmdev_admin.id',getAdminID)
       adminData = adminDataArr[0] 
    }
    catch(err){
      console.log(err)
    }
      res.render('adminSystem/deleteAdmin.hbs',{adminData})
  
    }
    else{
       res.render("loginAdmin.hbs")
    }
})

router.post('/deleteAdmin',async(req,res)=>{
   let {adminID,adminName,adminPassword} = req.body ?? {}

  try{
    [getAdminData] = await connectDB
    .select('*')
    .from('bcmmdev_admin')
    .where('bcmmdev_admin.username',adminName)

    console.log(getAdminData)
    
    bcrypt.compare(adminPassword,getAdminData.password).then(async(match)=>{
        if(match){
          let deleteImgPath = "public/adminImage/" + getAdminData.image
          fs.unlinkSync(deleteImgPath)
           await connectDB('bcmmdev_admin').del().where('id', '=', adminID)
           res.json({system:"Successfully to delete admin",icons:"success"})
        }
        else{
           res.json({system:"Fail to delete admin",icons:"error"})
        }
    })
  }
  catch(err){
      console.log(err)
  }

})

// ----- #edit admin
router.get('/manageAdmin/editAdmin/:editAdminID',async(req,res)=>{
   if(req.session.adminID){
    let {editAdminID} = req.params
    let getEditAdminIDTx = editAdminID.match(/\d/g);
    getEditAdminIDTx = getEditAdminIDTx.join("")
    let getEditAdminID = parseInt(getEditAdminIDTx)
    try{
      [getEditAdmin] = await connectDB
      .select("*")
      .from("bcmmdev_admin")
      .where("id", getEditAdminID)

      console.log(getEditAdmin)
    }
    catch(err){console.log(err)}
    res.render('adminSystem/editAdmin.hbs',{editAdminID,getEditAdmin})
  }
  else{
     res.render("loginAdmin.hbs")
  }
})

router.post('/manageAdmin/editAdmin/:newDataAdmin',async(req,res)=>{
  let getAdminImg =  req.files ?? null
  let {newDataAdmin} = req.params
  let {editAdminName,editAdminEmail,checkAdminPwd} = JSON.parse(req.body.adminNewData)

  var getAdminIDTx = newDataAdmin.match(/\d/g);
  getAdminIDTx = getAdminIDTx.join("")
  let getAdminID = parseInt(getAdminIDTx)

  try{
   [getAdminData] = await connectDB
   .select('*')
   .from('bcmmdev_admin')
   .where('bcmmdev_admin.id',getAdminID);

   //  check all admin email in db
   checkAdminEmailDB = await connectDB
   .select('*')
   .from('bcmmdev_admin');

    bcrypt.compare(checkAdminPwd,getAdminData.password).then(async(match)=>{
        if(match){
         //check admin email 
         checkAdminEmail =  checkAdminEmailDB.find((allAdminEmail)=>{return allAdminEmail.email == editAdminEmail})
         console.log(checkAdminEmail)
         if(!checkAdminEmail){
          if(getAdminImg){
            getAdminImg = req.files.adminEditImg
           //  make new name img
           const date = new Date()
           const newAdminImgName = date.getDate() + date.getTime() + "_" + getAdminImg.name
           const oldImageName = getAdminData.image
           // add new img to adminFolder folder
           let path = 'public/adminImage/' + newAdminImgName
           let oldpathImg = 'public/adminImage/' + oldImageName 
            await getAdminImg.mv(path,async(err,result)=>{
             if(err){throw err;}
             else{
               // update new image
               fs.unlinkSync(oldpathImg)
               await connectDB.update({image:newAdminImgName}).into('bcmmdev_admin').where('id', '=', getAdminID);
              }
            }) 
         }
         res.json({system:"Successfully to edit admin",icons:"success",text:""})
         // update new admin data
        await connectDB.update({username:editAdminName,email:editAdminEmail}).into('bcmmdev_admin').where('id', '=', getAdminID)
       } 
       else{
        res.json({system:"Unable to create admin",icons:"error",text:"This email is already in the system. Please use another email instead."})
       }
         }
        else{   
          res.json({system:"Fail to edit admin",icons:"error",text:"The password is incorrect."})
        }
    })
  }
  catch(err){
    console.log('error' + err)
  }

})

// ----- #change password admin
router.get('/manageAdmin/changePwd/:changePWDAdminID',(req,res)=>{
  if(req.session.adminID){
    let {changePWDAdminID} = req.params
  var getAdminIDTx = changePWDAdminID.match(/\d/g);
  getAdminIDTx = getAdminIDTx.join("")
  let getAdminID = parseInt(getAdminIDTx)
   res.render('adminSystem/changePwdAdmin.hbs',{getAdminID})
  }
  else{
     res.render("loginAdmin.hbs")
  }
})

router.post('/manageAdmin/changePwd/:newPwdAdmin',async(req,res)=>{
  let {newPwdAdmin} = req.params
   let {adminOldPassword,adminNewPassword,adminConfirmNewPassword} = req.body?? {}

  var getAdminIDTx = newPwdAdmin.match(/\d/g);
  getAdminIDTx = getAdminIDTx.join("")
  let getAdminID = parseInt(getAdminIDTx)

   try{
    getAdminData = await connectDB
    .select('*')
    .from('bcmmdev_admin')
    .where('bcmmdev_admin.id',getAdminID)

    bcrypt.compare(adminOldPassword,getAdminData[0].password).then(async(match)=>{
      if(match){
        //Encrypt new password
        const newAdminPassword = bcrypt.hashSync(adminNewPassword,10)
         await connectDB('bcmmdev_admin').update("password",newAdminPassword).where('id', '=', getAdminID)
         res.json({system:"Successfully to change admin password",icons:"success",text:""})

      }
      else{
        console.log('Change Fail')
         res.json({system:"Fail to change admin password",icons:"error",text:"The old password is incorrect."})
      }
  })
    
   }
   catch(err){
       console.log(err)
   }
  
  // await connectDB('bcmmdev_admin')
})

//----- Make sure this admin is logged in. will not be able to delete itself in manageAdmin.hbs
router.post('/manageAdmin/protectAdminDelete',async(req,res)=>{
  if(req.session.adminID){
      try{ 
      [checkAdminLogin] = await connectDB
      .select('*')
      .from('bcmmdev_admin')
      .where('id',"=",req.session.adminID)

      res.json({getAdminEmailDB:checkAdminLogin.email})

      }catch(err){

      }
  }else{
    res.render("loginAdmin.hbs")
  }
})

module.exports = router