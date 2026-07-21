let apiKey="";
let model="";
let userName="";
let emoji="🙂";

let history=[];

const login=document.getElementById("login");
const app=document.getElementById("app");

const messages=document.getElementById("messages");

document.getElementById("start").onclick=()=>{

apiKey=document.getElementById("apikey").value.trim();
userName=document.getElementById("name").value.trim();
emoji=document.getElementById("emoji").value.trim()||"🙂";
model=document.getElementById("model").value;

if(!apiKey||!userName){
alert("Please fill every field.");
return;
}

login.style.display="none";
app.style.display="flex";

document.getElementById("username").innerText=userName;
document.getElementById("pfp").innerText=emoji;

botMessage("Hello "+userName+"! How can I help you today?");
}

function add(role,text){

const div=document.createElement("div");
div.className="message "+role;

const avatar=document.createElement("div");
avatar.className="avatar";

avatar.innerText=role==="user"?emoji:"🤖";

const bubble=document.createElement("div");
bubble.className="bubble";
bubble.innerHTML=text.replace(/\n/g,"<br>");

div.appendChild(avatar);
div.appendChild(bubble);

messages.appendChild(div);

messages.scrollTop=messages.scrollHeight;

}

function userMessage(t){
add("user",t);
history.push({role:"user",content:t});
}

function botMessage(t){
add("bot",t);
history.push({role:"assistant",content:t});
}

async function send(){

const input=document.getElementById("prompt");

const text=input.value.trim();

if(text==="") return;

userMessage(text);

input.value="";

const typing=document.createElement("div");
typing.className="message bot";

typing.innerHTML=`
<div class="avatar">🤖</div>
<div class="bubble typing">Thinking...</div>
`;

messages.appendChild(typing);

messages.scrollTop=messages.scrollHeight;

try{

const response=await fetch("https://api.groq.com/openai/v1/chat/completions",{

method:"POST",

headers:{
"Authorization":"Bearer "+apiKey,
"Content-Type":"application/json"
},

body:JSON.stringify({

model:model,

messages:history,

temperature:0.7

})

});

const data=await response.json();

typing.remove();

const reply=data.choices[0].message.content;

botMessage(reply);

}catch(e){

typing.remove();

botMessage("Error: "+e.message);

}

}

document.getElementById("send").onclick=send;

document.getElementById("prompt").addEventListener("keydown",(e)=>{

if(e.key==="Enter") send();

});

document.getElementById("clear").onclick=()=>{

messages.innerHTML="";

history=[];

botMessage("Chat cleared.");

};
