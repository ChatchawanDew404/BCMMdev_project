const express = require('express')
const router = express.Router();
const connectDB = require('../db')
const dayjs = require('dayjs')
const body = require('body-parser')


// {NewPostCmm} Create new post (page)
router.get('/newPost',(req,res)=>{ 
    res.render('newPostCmm.hbs')
})

// {NewPostCmm} create New post (system)
router.post('/createNewPost',(req,res)=>{
    // get userImg and userDataPost in Js
  const getUserImg =  req.files.userImgPost
  const {username,category,content} = JSON.parse(req.body.userDataPost)
  
//   change img name
  const date = new Date()
 const newImgName = date.getDate() + date.getTime() + "_" + getUserImg.name

 let path = 'public/cmmUserPostImg/' + newImgName
 // create upload 
 getUserImg.mv(path,async(err,result)=>{
  if(err){throw err;}
  else{
   console.log(username,category,content)
    await connectDB.insert({username:username,category:category,content:content,userImage:newImgName}).into('community_all_post')
}
 })


})

// {Community} show all post and one post & comment post if user click to see
router.get('/:user_post_Id',async(req,res)=>{
    const {user_post_Id} = req.params
    // get number from user_post_id text
    let getPostIDTx = user_post_Id.match(/\d/g);
    getPostIDTx = getPostIDTx.join("")
    let getPostID = parseInt(getPostIDTx)
  oneUserPostArr = []
  manyUserComment = []
    try{
        // -----------------get one user post data in DB---------------
        oneUserPostArr = await connectDB
        .select('*')
        .from('community_all_post')
        .where('community_all_post.id',getPostID)
        oneUserPost = oneUserPostArr [0]
        // change time to basic time display
        oneUserPost.postTime = dayjs(oneUserPost.postTime).format('D MMM YYYY - HH:mm')

        // ------------get many user comment in one post in DB-----------------
        manyUserComment = await connectDB
        .select('*')
        .from('community_all_post_comments')
        .where('community_all_post_comments.postID',getPostID)
        // change time to basic time display
        manyUserComment = manyUserComment.map((data) =>{
            const createdAt = dayjs(data.createdAt).format('D MMM YYYY - HH:mm')
            return{...data, createdAt}
        })
    }
    catch(err){
        console.log(err)
    }

    res.render('commentsCmm.hbs',{oneUserPost,manyUserComment})
})


// {commentCmm} create comment (post)
router.post('/:commentID/createComment',async(req,res)=>{
    let {commentID} = req.params
    // get number from user_post_id text
    var getCommentIDTx = commentID.match(/\d/g);
    getCommentIDTx = getCommentIDTx.join("")
    let getPostID = parseInt(getCommentIDTx)
    let {username,userComment} = req.body ?? {};
    try{
        if(username != "" && userComment != ""){
            await connectDB.insert({username:username,content:userComment, createdAt:new Date() ,postID:getPostID}).into('community_all_post_comments')
        }
        else{
            throw new Error('Fail to get data')
        }
    }
    catch(err){
      console.log(err)
    }
})



module.exports = router