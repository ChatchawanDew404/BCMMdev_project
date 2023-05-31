/* ===================================== */
/*                Blog.hbs               */
/* ===================================== */
let allBlogBox = document.querySelectorAll('.blog .blog-col')
let categoryBlog = document.querySelector('.category-blog')
let noHaveBlog = document.querySelector('.not-have-blog-category')
let searchInput = document.querySelector('#search_Input')
// let searchBox = document.querySelector('')


if(noHaveBlog){
    noHaveBlog.style.display="none"

//  Select Category System
categoryBlog.addEventListener('change',()=>{
    // clear search input
    searchInput.value = ""

    // check category in select and all blog
    let checkBlogCategory = []
    let getOptionSelect = categoryBlog.options[categoryBlog.selectedIndex].text;
    allBlogBox.forEach((blogBx)=>{
        let getBlogCategoryTx = blogBx.querySelector('.category').textContent
        if(getBlogCategoryTx ==  getOptionSelect){
            checkBlogCategory.push(getBlogCategoryTx)
            blogBx.style.display="block"
        }else if( getOptionSelect == "All"){
            checkBlogCategory.push(getBlogCategoryTx)
            blogBx.style.display="block"
        }
        else{
            blogBx.style.display="none"
        }
    })
    // if category not have content
    if(checkBlogCategory.length == 0){
        noHaveBlog.style.display="flex"
    }
    else{
        noHaveBlog.style.display="none"
    }
})

// Search blog System
searchInput.addEventListener('change',(e)=>{
    let getSearchText = e.target.value

    allBlogBox.forEach((getBlogData)=>{
        let blogTitle = getBlogData.querySelector('.title').textContent
        // check blog title lower and upper font
        let lowerText = blogTitle.toLowerCase()
        let upperText = blogTitle.toUpperCase()

        let checkTextLower =  lowerText.includes(getSearchText)
        let checkTextUpper =  upperText.includes(getSearchText)
        if(checkTextLower || checkTextUpper ){
            getBlogData.style.display="block"
            noHaveBlog.style.display="none"
            searchInput.value=""
        }else{
            getBlogData.style.display="none"
            noHaveBlog.style.display="flex"
            searchInput.value=""
        }
    })
})
}

/* ===================================== */
/*              readBlog.hbs             */
/* ===================================== */
let getReadBlog = document.querySelector('.blog-left')

// get api blog data to show in readBlog.hbs
if(getReadBlog){
    // get readBlog ID
    let getReadBlogID = getReadBlog.getAttribute('id')
    fetch(`/blog/readBlog/${getReadBlogID}`,{
        method:"POST",
    }).then(res => res.json())
    .then((json)=>{
    
        console.log(json)
        // get all blog data in backend
        let {title,content,category,creator,imageBlog,createDate,creatorImg} = json
        displayBlogData(title,content,category,creator,imageBlog,createDate,creatorImg)
    })
    
    function displayBlogData(title,content,category,creator,imageBlog,createDate,creatorImg){
        let readBlogCategory = document.querySelector('.readBlog .category')
        let readBlogCreator = document.querySelector('.readBlog .creator')
        let readBlogCreateDate = document.querySelector('.readBlog .createDate')
        let readBlogTitle = document.querySelector('.readBlog .title h1')
        let readBlogArticle = document.querySelector('.readBlog .content')
        let readBlogShowImg = document.querySelector('.readBlog .blogShowImg img')
        let readBlogShowCreator = document.querySelector('.readBlog .blogShowCreator img')
       let creatorNameBlogRight = document.querySelector('.blog-right .name')
       let creatorImageRight = document.querySelector('.blog-right .image img')

        // Show all blog data in db to frontend

        // check if admin has been delete
        if(creator == null){
            readBlogCreator.textContent = "admin has been delete"
            creatorNameBlogRight.textContent = "admin has been delete"
        }
        else{
            // show admin creator blog
            readBlogCreator.textContent = creator
            creatorNameBlogRight.textContent = creator
            creatorImageRight.src = `/public/adminImage/${creatorImg}`
        }

        // show blog data and img
        readBlogCategory.textContent = category
        readBlogCreateDate.textContent = createDate
        readBlogTitle.textContent = title
        readBlogShowImg.src = `/public/createBlogImg/${imageBlog}`
        readBlogShowCreator.src = `/public/adminImage/${creatorImg}`


        // Create header Text and show all text in blog
        displayBlogArticle( readBlogArticle,content)
    }
    
    function displayBlogArticle( readBlogArticle,content){
    
        console.log(content)
        let getDataArticle = content.trim().split("\n").filter(item => item.length)
        getDataArticle.forEach((text)=>{
            if(text[0] == "#"){  
               let headerCount = 0;
               let i = 0;
               while(text[i] == "#"){
                   headerCount++;
                   i++;
               }
               let headerTag = `h${headerCount}`
                readBlogArticle.innerHTML +=  `<${headerTag}>${text.slice(headerCount,text.length)}</${headerTag}>` 
            }else{
               readBlogArticle.innerHTML += `<p>${text}</p>` 
            }
       })
    }
    
}

