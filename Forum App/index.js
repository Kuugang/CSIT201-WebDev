let userId;
let profileId;
let profileActivity;
let username;
let posts

let postFocusTemplate;
let postsTemplate
if (localStorage.userId) {
    userId = localStorage.userId;
    username = localStorage.username
    checkUser()
}

function checkUser(){
    if(userId){
        $("#registerBtn, #loginBtn").hide();
        $("#signOutBtn").show();
        $("#createPostBtn").show();
        $("#sidebar-button").show();
        $("#currentUser").text(username)
    }else{
        $("#registerBtn, #loginBtn").show();
        $("#signOutBtn").hide();
        $("#createPostBtn").hide();
        $("#sidebar-button").hide();
    }
}

$("#searchInput").on("input", function() {
    const input = $("#searchInput");
    const query = input.val().toLowerCase(); 
    const filteredPosts = posts.filter(item => {
        const postText = item.post.toLowerCase();
        const replyText = item.reply ? item.reply.map(replyItem => replyItem.reply.toLowerCase()).join(" ") : '';
        const authorName = item.user.toLowerCase(); 
        const replyAuthorName = item.reply ? item.reply.map(replyItem => replyItem.user.toLowerCase()).join(" ") : '';
        return postText.includes(query) || replyText.includes(query) || authorName.includes(query) || replyAuthorName.includes(query);
    });
    renderData(filteredPosts, userId, $("#posts-container"))
});

$("#sidebar-button").on("click", function () {
    var isChecked = $("#sidebar-checkbox").prop("checked");
    $("#sidebar-checkbox").prop("checked", !isChecked);
    if (!isChecked) {
        $("#drawer").css("right", 0).css("transform", "translateX(0)");
        renderActivity(posts) 
        const overlay = $("<div class='sidebar-overlay z-1'></div>");
        $("body").append(overlay);
        overlay.click(function (event) {
            if (event.target == this) {
                $("#sidebar-checkbox").prop("checked", isChecked);
                $("#drawer").css("right", "-100%").css("transform", "translateX(100%)");
                overlay.remove();
            }
        });
    } else {
        $("#drawer").css("right", "-100%").css("transform", "translateX(100%)");
    }
});
    
// $.ajax({
//     url: "./postFocus.hbs",
//     method: "GET",
//     dataType: "html",
//     success: function(templateContent){
//         postFocusTemplate = templateContent;                    
//     }
// })

// $.ajax({
//     url: "./posts.hbs",
//     method: "GET",
//     dataType: "html",
//     success: function(templateContent){
//         postsTemplate = templateContent;                    
//     }
// })

function getPosts(page) {
    return new Promise((resolve, reject) => {
        $("#sidebar-button").prop("disabled", true)
        $.ajax({
            type: "GET",
            url: "http://hyeumine.com/forumGetPosts.php",
            success: (data) => {
                let postData = JSON.parse(data).reverse();
                posts  = postData
                $("#sidebar-button").prop("disabled", false)
                resolve(posts);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.error("An error occurred:", thrownError);
                reject(thrownError);
            }
        });
    });
}

Handlebars.registerHelper('getUserState', function() {
  return userId !== undefined; 
});
 
Handlebars.registerHelper('getUsername', function() {
  return username; 
});

function renderData(posts, userNameId, container) {
    posts.forEach(post => {
        if(userNameId == post.uid){
            post.postOwner = true;
        }
        if(post.reply){
            post.replyCount = post.reply.length;
        }else{
            post.replyCount = 0;
        }
    });
    const postsTemplate = $("#posts").html();
    const template = Handlebars.compile(postsTemplate);
    const context = { data: posts, state : userId ? true : false };
    const html = template(context);
    container.html(html)
}

function renderActivity(posts) {
    const activity = posts.filter(item => {
        const id = item.uid;
        const replyText = item.reply ? item.reply.map(replyItem => replyItem.uid) : [];
        return id ===  userId || replyText.includes(userId);
    });
    
    const template = Handlebars.compile($("#activities").html());
    const content = { data : activity };
    const html = template(content);
    document.getElementById("activity").innerHTML = html;
}

function createFocusedPostTemplate(item, usernameId, container) {
    item.uid == usernameId ? item.postOwner = true : item.postOwner = false
    usernameId == undefined ? item.username = null: item.username = username;
    const template = Handlebars.compile($("#postFocus").html())
    const context = { data: item };
    const html = template(context);
    container.html(html)
}
function getProfileActivity(profileId, posts){
    return posts.filter(item => {
        const id = item.uid;
        const replyText = item.reply ? item.reply.map(replyItem => replyItem.uid) : [];
        return id === profileId || replyText.includes(profileId);
    });
}
function createUserProfileTemplate(posts, profileId, username){
    profileActivity = getProfileActivity(profileId, posts);

    const isMainUser = userId === profileId ? true : false;
    const template = Handlebars.compile($("#userProfile").html());
    const context = { username : username, isMainUser : isMainUser};
    const html = template(context)
    $("main").html(html);
    renderData(profileActivity, profileId, $("#userContentContainer"))
}

function createUserProfileFocusedPostTemplate(item, usernameId , container){
    item.uid == usernameId ? item.postOwner = true : item.postOwner = false
    usernameId == undefined ? item.username = null: item.username = username;

    const template = Handlebars.compile($("#postFocus").html())
    const context = { data: item };
    const html = template(context);
    container.html(html)
}

function openForm($form) {
    $form.show(100);
    $("#registerBtn, #loginBtn, #signOutBtn").prop("disabled", true);
    $(".overlay").removeClass("hidden");
}

function closeForms() {
    $(".registerContainer, .loginContainer, .createPostContainer, #signOutConfirm").hide();
    $("#registerBtn, #loginBtn, #signOutBtn").prop("disabled", false);
    $(".overlay").html("")
    $(".overlay").addClass("hidden");
}

function displaySpinner(){
    $(".spinner").removeClass("hidden")
}
function hideSpinner(){
    $(".spinner").addClass("hidden")
}

function handleCreatePost(id, message){
    return new Promise((resolve, reject) => {
        $.ajax({ 
            type: "POST",
            url: "http://hyeumine.com/forumNewPost.php",
            data: {
                post: message,
                id: userId,
            },
            success : data => {
                resolve(data)
            },
            error : error => {
                reject(error);
            }
        });
        } 
    )
}

function handleDeletePost(postId){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: "http://hyeumine.com/forumDeletePost.php",
            data : {
                id : parseInt(postId)
            },
            success : (data) => {
                resolve(data)
            },
            error : (error) =>{
                reject(error)
            }
        })
    })
}

async function deletePost(postId){
    displaySpinner()
    try {
        const result = await handleDeletePost(postId);
        $(`#${postId}`).remove()
        hideSpinner()
        closeForms();
        $("#postFocusContainer").html("")
    } catch (error) {
        alert("Something went wrong");
        console.log(error)
    }
} 

function handleReply(postId, message) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: "http://hyeumine.com/forumReplyPost.php",
            data: {
                user_id: userId,
                post_id: postId,
                reply: message
            },
            success: (data) => {
                resolve(data);
            },
            error: (error) => {
                reject(error);
            }
        });
    });
}

async function replyPost(postId) {
    const message = $("#replyMessage").val()
    displaySpinner()
    try {
        const result = await handleReply(postId, message);

        posts = getPosts()
            .then((posts) =>{                
                renderData(posts, userId, $("#posts-container"))

                renderData(getProfileActivity(profileId, posts), profileId, $("#userContentContainer"))
                let item = posts.find(item => item.id === postId)

                if(item.reply){
                    (item.reply).forEach(reply => {
                        reply.uid === userId ? reply.replyOwner = true : reply.replyOwner = false;
                    });
                }
                hideSpinner()
                $(".overlay").html("")
                createFocusedPostTemplate(item, userId, $("#mainPostFocusContainer"))
                createFocusedPostTemplate(item, userId, $("#userProfileFocusContainer"))
            })
    } catch (error) {
        alert("Something went wrong")
        console.log(error)
    }
}

function handleDeleteReply(replyId){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: `http://hyeumine.com/forumDeleteReply.php?id=${replyId}`,
            success: (data) =>{
                resolve(data)
            },
            error: (error) => {
                reject(error)
            }
        })
    })
}

async function deletePostReply(replyId){
    displaySpinner()
    try{
        getPosts()
            .then((posts) =>{
                let replyItem;
                for (const post of posts) {
                    if (post.reply) {
                        post.reply.forEach(item => {
                            if(item.id === replyId){
                                replyItem = post
                                replyItem.reply = replyItem.reply.filter(reply => reply.id !== replyId);
                                handleDeleteReply(replyId);
                            } 
                        })
                    }
                } 
                $(".overlay").html("")
                if(replyItem.reply){
                    (replyItem.reply).forEach(item => {
                        item.uid === userId ? item.replyOwner = true : item.replyOwner = false;
                    })
                }
                renderData(posts, userId, $("#posts-container"))
                renderData(getProfileActivity(profileId, posts), profileId, $("#userContentContainer"))
                createFocusedPostTemplate(replyItem, userId, $("#mainPostFocusContainer"));
                createFocusedPostTemplate(replyItem, userId, $("#userProfileFocusContainer"))
                hideSpinner()
            }) 
        const posts = await getPosts();
    }catch(error){
        console.log("Something went wrong", error);
    }
}
function handleUserLogin(loginUsername) {
    return new Promise((resolve, reject) => {
        $.ajax({
        type : "POST",
        url: "http://hyeumine.com/forumLogin.php",
        data : {
            username: loginUsername,
        },
        success: (data) => {
            try{
                data = JSON.parse(data)
                userId = data.user.id;
                username = loginUsername
                localStorage.setItem("userId", userId);
                localStorage.setItem("username", username);
                renderData(posts, userId, $("#posts-container"))
                checkUser()
                resolve(data)
            }catch(error){
                console.log(error)    
                reject(error)
            }
            },
        })

    });
}
function editProfile(){
    createUserProfileTemplate(posts, userId, username)
    var isChecked = $("#sidebar-checkbox").prop("checked");
    $("#sidebar-checkbox").prop("checked", !isChecked);
    $("#drawer").css("right", "-100%").css("transform", "translateX(100%)");
    $(".sidebar-overlay").remove();
}

function closePostFocus(){
    $(".postFocusContainer").html("")
}

document.onkeydown = function(e){
    switch (e.keyCode){
        case 27:
            closeForms();
            break;
    }
}

function noUserError() {
    const overlay = $('<div class="overlay" id="overlay"></div>');

    overlay.click(function (event) {
        if (event.target === this) {
        overlay.remove()
        closeForms();
        }
    });

    const error = $(
        '<div class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">'
    );

    error.append('<p class="font-bold">Error!</p>');
    error.append("<p>Invalid User Credentials!</p>");

    overlay.append(error);

    $("body").append(overlay);
}
window.addEventListener('scroll', function() {
  if (window.scrollY > 200) {
    $("#backToTop").removeClass("hidden");
  } else {
    $("#backToTop").addClass("hidden");
  }
});
function backToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}

$('document').ready( function(){
    checkUser()
    getPosts(1)
        .then((posts) => {
            posts = posts;
            console.log(posts)
            // createUserProfileTemplate(posts, '62', "testo")
            renderData(posts, userId, $("#posts-container"));
            $(".posts-loader").addClass("hidden")
        })
        .catch((error) => {
            console.error("Error getting posts:", error);
        }); 

    $("#register").on("submit", function(e) {
        e.preventDefault();
        const registerLastName = $("#registerLastName").val();
        const registerFirstName = $("#registerFirstName").val();
        const registerUserName = $("#registerUserName").val()
        $.ajax({
            type: "POST",
            url: "http://hyeumine.com/forumCreateUser.php",
            data: {
                lastName : registerLastName,
                firstName : registerFirstName,
                username: registerUserName 
            },
            success: (data) => {
                data = JSON.parse(data);
                console.log(data)
                userId = data.id
                username = data.username
                localStorage.setItem("userId", userId);
                localStorage.setItem("username", username);
                checkUser();
            }
        })
        closeForms();
    })


    $("#login").on("submit", async function(e) {
        e.preventDefault(); // Prevent the default form submission

        displaySpinner();
        const loginUsername = $("#loginUserName").val();

        try {
            await handleUserLogin(loginUsername);
        } catch (error) {
            console.log("Something went wrong" + error);
        } finally {
            hideSpinner();
            closeForms();
        }
  });


    $("#signOutBtn").bind("click", function(){
        openForm($("#signOutConfirm"));
        $("#signoutCancelButton").on("click", function(){
            closeForms();
        })
        $("#signoutConfirmButton").on("click", function(){
            localStorage.removeItem("userId")
            localStorage.removeItem("username")
            location.reload();
        })
    })

    $("#newPost").on("submit", async function(e) {
        e.preventDefault();
        const message = $("#message").val();

        displaySpinner();
        try{
            await handleCreatePost(userId, message);
            $("#message").val('');
            getPosts()
                .then((data) => {
                    renderData(data, userId, $("#posts-container"));
                    hideSpinner();
                    closeForms();
                })    
        }catch(error){
            console.log("Something went wrong", error)
        }
    });
    $("#registerBtn").on("click", function () {
        openForm($(".registerContainer"));
    });

    $("#loginBtn").on("click", function () {
        openForm($(".loginContainer"));
    });

    $("#createPostBtn").on("click", function () {
        openForm($(".createPostContainer"));
    });

    $(".overlay").on("click", function (event) {
        if ($(event.target).hasClass("overlay")) {
            closeForms();
        }
    });

    $('#activity').on('click', '.post-item', function() {
        console.log("asd")
        const id = $(this).attr('id');
        let item = posts.find(item => item.id === id)

        if(item.reply){
            (item.reply).forEach(reply => {
                reply.uid === userId ? reply.replyOwner = true : reply.replyOwner = false;
            });
        }

        const overlay = $(".sidebar-overlay");
        createFocusedPostTemplate(item, userId, $("#mainPostFocusContainer"))

        var isChecked = $("#sidebar-checkbox").prop("checked");
        $("#sidebar-checkbox").prop("checked", !isChecked);
        $("#drawer").css("right", "-100%").css("transform", "translateX(100%)");
        overlay.remove();
    });

    $(document).on('click', '.posts-container .post-item', function(event) {
        const target = event.target;
        const id = $(this).attr('id');
      
        let item = posts.find(item => item.id === id);
        profileId = item.uid;

        const username = item.user;
      
          if (item.reply) {
            item.reply.forEach(reply => {
              reply.uid === userId ? reply.replyOwner = true : reply.replyOwner = false;
            });
          }
            createFocusedPostTemplate(item, userId, $("#mainPostFocusContainer"));
            createUserProfileFocusedPostTemplate(item, userId, $("#userProfileFocusContainer"))
      });

    $(document).on("click", ".userLink", function(event){
        const id = $(this).attr('id')
        profileId = id
        console.log(id)

        let item = posts.find(post => post.uid === id);

        if (!item) {
            const postWithReply = posts.find(post => post.reply && post.reply.some(reply => reply.uid === id));
            if (postWithReply) {
                item = postWithReply.reply.find(reply => reply.uid === profileId);
            }
        }

        const username = item.user;
    
        createUserProfileTemplate(posts, profileId, username);
        window.scrollTo({top: 0}); 
        closePostFocus();
    })
});
