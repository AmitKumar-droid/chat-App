

const socket = io()

const clientsTotal = document.getElementById("client-total")
const messageContainner = document.getElementById("message-container")
const nameInput = document.getElementById("name-input")
const messageForm = document.getElementById("form")
const messageInput = document.getElementById("message-input")

var msgTone = new Audio("/msg.mp3")

messageForm.addEventListener("submit", (e) => {
    e.preventDefault()
    sendMessage()
})

socket.on("client-total", (data) => {
    clientsTotal.innerText = `Total clients: ${data}`
    console.log(data)
})

function sendMessage() {
    if (messageInput.value === "")
        return
    //console.log(messageInput.value)
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }
    socket.emit("message", data)
    addMessage(true, data)
    messageInput.value = ""


}

socket.on("chat-message", (data) => {
    msgTone.play()
    addMessage(false, data)
})

function addMessage(isOwnMessage, data) {
    clearFeedback()
    const element =
        `<li class="${isOwnMessage ? "message-right" : "message-left"}">
        <p class="message">
            ${data.message}
            <span>${data.name}  ${moment(data.dateTime).fromNow()}</span>
        </p>
    </li>`

    messageContainner.innerHTML += element
    scrollContainer()
}

function scrollContainer() {
    messageContainner.scrollTo(0, messageContainner.scrollHeight)
}
messageInput.addEventListener("focus",(e)=>{
    socket.emit("feedback",{
        feedback: `✍️ ${nameInput.value} is typing a message`
    })
})

messageInput.addEventListener("keypress", (e)=>{
    socket.emit("feedback",{
        feedback: `✍️ ${nameInput.value} is typing a message`
    })
})
messageInput.addEventListener("blur", (e)=>{
    socket.emit("feedback",{
        feedback: "",
    })
    
})

socket.on("feedback", (data)=>{
    clearFeedback()
    const element = `<li class="message-feedback">
                <p class="feedback" id="feedback">
                    ${data.feedback}
                </p>
            </li>`

            messageContainner.innerHTML += element
})

function clearFeedback(){
    document.querySelectorAll("li.message-feedback").forEach(element =>{
        element.parentNode.removeChild(element)
    })
}