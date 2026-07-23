let apiKey = "";
let model = "";
let userName = "";
let history = [];
const loginScreen = document.getElementById("loginScreen");
const app = document.getElementById("app");
const messages = document.getElementById("messages");
document.getElementById("startBtn").onclick = () => {
apiKey = document.getElementById("apikey").value.trim();
userName = document.getElementById("name").value.trim();
model = document.getElementById("model").value;
if (!apiKey || !userName) {
alert("Enter your name and API key.");
return;
}
loginScreen.style.display = "none";
app.style.display = "flex";
document.getElementById("username").innerText = userName;
addMessage("bot","❤ Welcome to RizzAI! Ask for pickup lines, replies,
or texting advice.");
};
function addMessage(role,text){
const wrap=document.createElement("div");
wrap.className="message "+role;
wrap.innerHTML=`
<div class="chatAvatar">${role==="user"?"":"❤"}</div>
<div class="bubble">${text.replace(/\n/g,"<br>")}</div>
`;
messages.appendChild(wrap);
messages.scrollTop=messages.scrollHeight;
}
async function sendMessage(){
const input=document.getElementById("prompt");
const text=input.value.trim();
if(!text) return;
input.value="";
history.push({role:"user",content:text});
addMessage("user",text);
addMessage("bot","<span class='typing'>Thinking...</span>");
try{
const res=await fetch("https://api.groq.com/openai/v1/chat/completio
ns",{
method:"POST",
headers:{
"Authorization":"Bearer "+apiKey,
"Content-Type":"application/json"
},
body:JSON.stringify({
model:model,
temperature:0.9,
messages:[
{
role:"system",
content:`You are RizzAI.
Be charming, playful, witty and respectful.
Help users craft pickup lines, replies and flirting advice.
Never generate explicit sexual content or harassment.`
},
...history
]
})
});
const data=await res.json();
messages.lastChild.remove();
const reply=data.choices?.[0]?.message?.content || "No response.";
history.push({role:"assistant",content:reply});
addMessage("bot",reply);
}catch(err){
messages.lastChild.remove();
addMessage("bot","Error: "+err.message);
}
}
document.getElementById("send").onclick=sendMessage;
document.getElementById("prompt").addEventListener("keydown",e=>{
if(e.key==="Enter") sendMessage();
});
document.getElementById("clearChat").onclick=()=>{
history=[];
messages.innerHTML="";
addMessage("bot","Chat cleared.");
};
