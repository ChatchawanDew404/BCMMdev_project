const express = require('express')
const router = express.Router();
const connectDB = require('../db')
const dayjs = require('dayjs')

//  show readBlog Page and readBlog recommend
router.get('/readBlog/:blogID',async(req,res)=>{
    let {blogID} = req.params
    // change blogId text to number id
    let getBlogIDTx = blogID.match(/\d/g);
    getBlogIDTx =  getBlogIDTx.join("")
    let getBlogID = parseInt(getBlogIDTx )

    let getAllBlogData = []
    try{
     getAllBlogData  = await connectDB
    .select('bcmmdev_blog.id',
    'bcmmdev_blog.title',
    'bcmmdev_blog.category',
    'bcmmdev_blog.date',
    'bcmmdev_blog.imageBlog',
    'bcmmdev_admin.username',
    'bcmmdev_admin.image')
    .from('bcmmdev_blog')
    .where("bcmmdev_blog.id","!=",getBlogID)
    .leftJoin('bcmmdev_admin',"bcmmdev_blog.adminCreator","bcmmdev_admin.id")
    .orderByRaw('RAND()')
    .limit(6)
    }
    catch(err){console.log(err)}

    console.log(getAllBlogData)
    res.render('readBlog.hbs',{blogID,getAllBlogData})
})


// ---------------------------------------------------
//          Get block code if user click
//    block and send dataset back to readBlog.hbs
// ---------------------------------------------------
router.post('/readBlog/:blogID',async(req,res)=>{
    let {blogID} = req.params
    let getBlogIDTx = blogID.match(/\d/g);
    getBlogIDTx =  getBlogIDTx.join("")
    let getBlogID = parseInt(getBlogIDTx )

 try{
   let [getBlogData] = await connectDB
    .select('bcmmdev_blog.id',
    'bcmmdev_blog.title',
    'bcmmdev_blog.content',
    'bcmmdev_blog.category',
    'bcmmdev_blog.date',
    'bcmmdev_blog.imageBlog',
    'bcmmdev_admin.username',
    'bcmmdev_admin.image')
    .from('bcmmdev_blog')
    .leftJoin('bcmmdev_admin',"bcmmdev_blog.adminCreator","bcmmdev_admin.id")
    .orderBy('id', 'desc')
    .where('bcmmdev_blog.id',"=",getBlogID)

    getBlogData.date = dayjs(getBlogData.date).format('D MMM YYYY')

    res.json({
        creatorImg:getBlogData.image,
        title:getBlogData.title,
        content:getBlogData.content,
        category:getBlogData.category,
        creator:getBlogData.username,
        imageBlog:getBlogData.imageBlog,
        createDate: getBlogData.date
    })
 }
 catch(err){
    console.log(err)
 }
    
})




module.exports = router