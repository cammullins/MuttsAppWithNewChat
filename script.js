let userID = 3;
let baseUrl = 'http://demo.codingnomads.co:8082/muttsapp';

//As soon as JS file loads, we run this function to get all the items for the sidebar
function getUserChats() {
    fetch(`${baseUrl}/users/${userID}/chats`)
        //The info retrieved in the fetch request returns a response object.
        //The response object is assigned to the parameter in the following method as "response"
        .then(response => response.json())
        //The response object needs to be turned into a JS object for parsing. That process is above, then the result is passed to the next '.then' method

        // The object created in the last step is assigned to "dataObj", then the data object is passed to a function that handles preview box creation
        .then(dataObj => createPreviewBoxes(dataObj))
};

getUserChats();

//
function previewBoxClick(event) {
    // This makes reference to the preview box wrapper element that was clicked on
    let previewWrap = event.target.closest('.message-preview-box');
    // These two lines searche inside the preview wrap for thew image and the paragraph with the chat name
    let previewImg = previewWrap.querySelector('.img-wrap img');
    let chatName = previewWrap.querySelector('.message-text-wrap > p');
    
    // These two lines reference the image and paragraph in the header where we want to set the image and chat name
    let headerImg = document.querySelector('#hm-self-image img');
    let headerName = document.getElementById('chat-name');
    
    //These two lines set the image and chat name in the header elements
    headerImg.src = previewImg.src; // This is the same as using the setAttribute method (ie: headerImg.setAttribute('src', previewImg.src);)
    headerName.innerHTML = chatName.innerHTML;
    
    // This gets the value of the "data-chat_id" attribute on the clicked element
    let chatID = event.target.dataset.chat_id;
    let senderID = event.target.dataset.sender_id;
    document.getElementById('send-message').dataset.chat_id = chatID;
    if ( document.getElementById('send-message').dataset.chat_id ) {
        document.getElementById('new-message').removeAttribute('disabled');
    }
    console.log(`${baseUrl}/users/${userID}/chats/` + senderID)
    //The value of "chatID" is passed to this url, to create a dynamically generated API based on which preview box is clicked
    fetch(`${baseUrl}/users/${userID}/chats/` + senderID)
         //The info retrieved in the fetch request returns a response object.
         //The response object is assigned to the parameter in the following method as "response"
        .then(response => response.json())
        //The response object needs to be turned into a JS object for parsing. That process is above, then the result is passed to the next '.then' method

        // The object created in the last step is assigned to "dataObj", then the data object is passed to a function that handles the creation of a chat message bubble 
        .then(dataObj => createChatBubbles(dataObj))

}

//Attach a "submit" listener to the message form
let newMessageForm = document.getElementById('send-message')
newMessageForm.addEventListener('submit', function(event){
    console.log(event)
    event.preventDefault();
    let msg = document.getElementById('new-message').value;
    let msgObj = {
        sender_id: userID,
        chat_id: parseInt(event.target.dataset.chat_id),
        message: msg
    }
    console.log(msgObj);

    createChatBubble(msgObj);
    sendNewMessage(msgObj);
    
    document.getElementById('new-message').value = "";
});

/*  ===============

    These next two functions iterate over an array of objects, and pass the objects to the functions that create elements 

================= */
function createChatBubbles(dataObj) {
    document.getElementById('chat-bubble-wrapper').innerHTML = "";
    let messageArr = dataObj.data;
    messageArr.forEach(chat => createChatBubble(chat))
}

function createPreviewBoxes(dataObj){
    let chatsArr = dataObj.data;
    chatsArr.forEach(chat => createPreviewBox(chat))
}



/*  ===============

    These next two functions create elements on the page

================= */

/*
* This function creates a single "chat bubble" (an individual message element in the chat)
* and adds it to the page
* this function takes in one parameter, a message object
*/ 
const createChatBubble = (msg) => {
    console.log(msg)
    //Create chat bubble wrap and the pargraph that holds the chat message
    let chatBubble = document.createElement('div');
    // console.log(msg)
    let sentClassName;
    if( msg.sender_id === userID ){
        sentClassName = "out";
    } else {
        sentClassName = "in"
    };

    chatBubble.classList.add("chat-bubble", sentClassName);

    let paragraph = document.createElement('p');
    paragraph.innerText = msg.message;

    // console.log( paragraph.innerText )
    chatBubble.appendChild(paragraph);

    //Append the created elements to the page
    let wrapper = document.getElementById('chat-bubble-wrapper');
    

    wrapper.prepend(chatBubble);
}

/*
* This function creates a single "Chat Preview Box" (an individual sidebar item and its children)
* and adds it to the page
* this function takes in one parameter, a chat object
*/ 
 function createPreviewBox(chat, apppend=true) {

    console.log(chat)
   let chatInfo = {
       chat_name: chat.chat_name ? chat.chat_name : "No Title Yet",
       chat_id: chat.chat_id ? chat.chat_id : "",
       last_message: chat.last_message ? chat.last_message : "No messages yet",
       sender_id: chat.sender_id ? chat.sender_id : "",
       date_sent: chat.date_sent ? chat.date_sent : null,
       photo_url: chat.photo_url ? chat.photo_url : "./images/defaultIcon.svg"
   }
    //Make Wrapper Div and attach Click listener
    let previewBox = document.createElement('div');
    previewBox.classList.add('message-preview-box');
    previewBox.setAttribute('data-chat_id', chatInfo.chat_id)
    previewBox.setAttribute('data-sender_id', chatInfo.sender_id)
    previewBox.addEventListener('click', previewBoxClick)

    // make Image wrap, image element, and append to previewWrap
    let imageWrap = document.createElement('div');
    imageWrap.setAttribute('data-chat_id', chatInfo.chat_id)
    imageWrap.setAttribute('data-sender_id', chatInfo.sender_id)
    imageWrap.classList.add('img-wrap');
    let image = document.createElement('img');
    image.setAttribute('data-chat_id', chatInfo.chat_id)
    image.setAttribute('data-sender_id', chatInfo.sender_id)
    image.setAttribute('src', chatInfo.photo_url)
    image.setAttribute('alt', 'default icon')
    imageWrap.appendChild(image)
    previewBox.appendChild(imageWrap)

    //Make text wrap and paragraphs with chat name and last message, and append them to the previewWrap 
    let textWrap = document.createElement('div')
    textWrap.setAttribute('data-chat_id', chatInfo.chat_id);
    textWrap.setAttribute('data-sender_id', chatInfo.sender_id)
    textWrap.classList.add("message-text-wrap")
    let p1 = document.createElement('p')
    p1.setAttribute('data-chat_id', chatInfo.chat_id);
    p1.setAttribute('data-sender_id', chatInfo.sender_id)
    p1.innerHTML = chatInfo.chat_name;
    let p2 = document.createElement('p');
    p2.setAttribute('data-chat_id', chatInfo.chat_id);
    p2.setAttribute('data-sender_id', chatInfo.sender_id)
    p2.innerHTML = chatInfo.last_message
    textWrap.appendChild(p1)
    textWrap.appendChild(p2)
    previewBox.appendChild(textWrap)

    //Make date wrap, paragraph with date, and append them to the preview Wrap
    let dateWrap = document.createElement("div");
    dateWrap.setAttribute('data-chat_id', chatInfo.chat_id);
    dateWrap.setAttribute('data-sender_id', chatInfo.sender_id);
    dateWrap.classList.add("date-wrap");
    let dateP = document.createElement('p')
    dateP.setAttribute('data-chat_id', chatInfo.chat_id);
    dateP.setAttribute('data-sender_id', chatInfo.sender_id);
    dateP.innerHTML = new Date(chatInfo.date_sent).toLocaleDateString();
    dateWrap.appendChild(dateP)
    previewBox.appendChild(dateWrap)

    //append all element we just create to the div with the id "message-wrapper" already on the page
    let messageWrap = document.getElementById("message-wrapper")
    if(apppend){
        messageWrap.appendChild(previewBox)
    } else {
        messageWrap.prepend(previewBox)
    }
 }
 



/*
 * Our first post request example
 */
 function sendNewMessage(msgObj) {
     
     let postParams = {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(msgObj)
     }
     console.log(`${baseUrl}/users/` + userID + "/chat", postParams)

    //  fetch(`${baseUrl}/users/` + userID+ "/chat", postParams)
    //      .then(res => res.json())
    //      .then(res => console.log(res))
 };


 

let newChatBtn = document.getElementById('new-chat-btn');
let newChatModalBody = document.getElementById('new-chat-modal-body');
newChatBtn.addEventListener('click', makeNewChatForm)


function makeNewChatForm(){
    fetch(`${baseUrl}/users/`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            let usersArray = data.data;

            let frm = document.createElement('form');
            frm.id = `new-chat-frm`;

            let formString = ``;
            // formString += `<input type="text" list="users-list">`;
            // formString += `<datalist id="users-list">`
            formString += '<select name="user">'
            usersArray.forEach(userObj => {
                formString += `<option value="${userObj.id}">${userObj.first_name} ${userObj.last_name}</option> `
            })

            // formString += `</datalist>`
            formString += `</select>`
            formString += `<input type="submit" class="btn btn-success">`
            frm.innerHTML = formString;
            frm.addEventListener('submit', newChatSubmit)
            newChatModalBody.innerHTML = "";
            newChatModalBody.appendChild(frm);
        })
}

function newChatSubmit(e){
    e.preventDefault();



    let newChatUser = document.querySelector('select[name="user"]');
    let newChatUserId = newChatUser.value;
    let newChatUserName = newChatUser.querySelector('option:checked').innerHTML;

    console.log({ chat_title: newChatUserName })
    let postParams = {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({chat_title: newChatUserName})
    }
    

     fetch(`${baseUrl}/users/` + userID+ "/chats/" + newChatUserId , postParams)
         .then(res => res.json())
         .then(res => {
             console.log(res)
             createPreviewBox(res.data, false)
         })
}