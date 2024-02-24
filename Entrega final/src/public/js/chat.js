const socket = io();
const messageForm = document.getElementById("messageForm");
const authentication = Cookies.get("token") || Cookies.get("user");
const chat = document.getElementById("chat");

socket.emit("getMessages");

socket.on("newMessages", (messages) => {
  compileChat(messages);
});

messageForm.onsubmit = async (e) => {
  e.preventDefault();

  let newMessage = {
    message: document.getElementById("message").value,
  };

  try {
    validMessage(newMessage);

    socket.emit("messageSent", newMessage, JSON.parse(Cookies.get("user")));

    document.getElementById("message").value = "";
  } catch (error) {
    alert(error.message);
  }
};

function validMessage(message) {
  if (!message.message) {
    throw new Error("Form incomplete");
  }
}

function compileChat(messages) {
  const userId = JSON.parse(Cookies.get("user")).id;

  const chatTemplate = messages.map((message) => {
    if (userId === message.userId) {
      return `<div 
class='text-white h-fit flex gap-x-3 w-fit self-end'
}>
<p class="text-sm p-2 bg-indigo-500 
rounded-br-lg rounded-tl-lg mt-3 secondary-font" >${message.message}</p>
<img class="rounded-full border border-solid border-orange-600" style="width:30px;height:30px;"
src="${message.user.url_profile_photo}">
</div>`;
    } else {
      return `<div 
class='text-white h-fit flex gap-x-3 w-fit'
}>
<img class="rounded-full border border-solid border-orange-600" style="width:30px;height:30px;"
src="${message.user.url_profile_photo}">
<p class="text-sm p-2 bg-indigo-500 
rounded-bl-lg rounded-tr-lg mt-3 secondary-font" >${message.message}</p>
</div>`;
    }
  });

  chat.innerHTML = "";

  chatTemplate.forEach((template) => {
    chat.innerHTML = chat.innerHTML + template;
  });
}
