document.addEventListener("DOMContentLoaded",function(){

/* MOBILE MENU */

const menuBtn=document.getElementById("menuBtn");
const navMenu=document.getElementById("navMenu");

if(menuBtn&&navMenu){

menuBtn.addEventListener("click",function(){
navMenu.classList.toggle("open");
});

navMenu.querySelectorAll("a").forEach(function(link){

link.addEventListener("click",function(){
navMenu.classList.remove("open");
});

});

}

/* REGISTER */

const registerForm=document.getElementById("registerForm");
const loginForm=document.getElementById("loginForm");

if(registerForm){

registerForm.addEventListener("submit",function(event){

event.preventDefault();

const name=document.getElementById("regName").value.trim();
const email=document.getElementById("regEmail").value.trim().toLowerCase();
const password=document.getElementById("regPassword").value;
const year=document.getElementById("regYear").value;
const department=document.getElementById("regDepartment").value;

if(name.length<2){
showToast("Please enter your name.");
return;
}

if(!email||!email.includes("@")){
showToast("Please enter a valid email.");
return;
}

if(password.length<6){
showToast("Password must contain at least 6 characters.");
return;
}

if(!year||!department){
showToast("Please select year and department.");
return;
}

const existing=JSON.parse(
localStorage.getItem("freeverseUser")||"null"
);

if(existing&&existing.email===email){

showToast("Account already exists. Please sign in.");

setTimeout(function(){

closeModal("registerModal");
openLogin();

},1200);

return;
}

const user={
name:name,
email:email,
password:password,
year:year,
department:department,
registeredAt:new Date().toISOString()
};

localStorage.setItem(
"freeverseUser",
JSON.stringify(user)
);

localStorage.setItem(
"freeverseLoggedIn",
"false"
);

registerForm.reset();

showToast("✓ Registration successful!");

setTimeout(function(){

closeModal("registerModal");
openLogin();

const emailInput=document.getElementById("loginEmail");

if(emailInput){
emailInput.value=email;
}

},1200);

});

}

/* LOGIN */

if(loginForm){

loginForm.addEventListener("submit",function(event){

event.preventDefault();

const email=document.getElementById("loginEmail")
.value.trim()
.toLowerCase();

const password=document.getElementById("loginPassword")
.value;

if(!email||!password){

showToast("Please enter email and password.");

return;
}

const saved=localStorage.getItem("freeverseUser");

if(!saved){

showToast("Please register first.");

return;
}

let user;

try{

user=JSON.parse(saved);

}catch(error){

localStorage.removeItem("freeverseUser");

showToast(
"Account data was reset. Please register again."
);

return;
}

if(user.email===email&&user.password===password){

localStorage.setItem(
"freeverseLoggedIn",
"true"
);

loginForm.reset();

showToast("✓ Sign In successful!");

setTimeout(function(){

closeModal("loginModal");

updateUserInterface();

},1000);

}else{

showToast("Invalid email or password.");

}

});

}

/* GALLERY ZOOM */

document.querySelectorAll(".zoomable").forEach(function(image){

image.addEventListener("click",function(){

openLightbox(this.src);

});

});

/* SCROLL REVEAL */

const observer=new IntersectionObserver(
function(entries){

entries.forEach(function(entry){

if(entry.isIntersecting){

entry.target.classList.add("visible");

}

});

},
{threshold:0.1}
);

document.querySelectorAll(".reveal").forEach(function(element){

observer.observe(element);

});

/* ANIMATED STATISTICS */

const stats=document.querySelectorAll(
".hero-highlights strong"
);

const statsObserver=new IntersectionObserver(
function(entries){

entries.forEach(function(entry){

if(entry.isIntersecting){

const element=entry.target;

if(element.dataset.animated==="true"){
return;
}

element.dataset.animated="true";

animateNumber(element);

}

});

},
{threshold:0.5}
);

stats.forEach(function(stat){

statsObserver.observe(stat);

});

/* INITIAL STATE */

updateUserInterface();

});

/* LOGIN */

function openLogin(){

closeModal("registerModal");

const modal=document.getElementById("loginModal");

if(modal){

modal.classList.add("show");

document.body.style.overflow="hidden";

setTimeout(function(){

const email=document.getElementById("loginEmail");

if(email){
email.focus();
}

},100);

}

}

/* REGISTER */

function openRegister(){

closeModal("loginModal");

const modal=document.getElementById("registerModal");

if(modal){

modal.classList.add("show");

document.body.style.overflow="hidden";

setTimeout(function(){

const name=document.getElementById("regName");

if(name){
name.focus();
}

},100);

}

}

/* CLOSE MODAL */

function closeModal(id){

const modal=document.getElementById(id);

if(modal){

modal.classList.remove("show");

}

if(!document.querySelector(".modal.show")){

document.body.style.overflow="";

}

}

/* SWITCH TO REGISTER */

function switchToRegister(){

closeModal("loginModal");

setTimeout(function(){

openRegister();

},100);

}

/* SWITCH TO LOGIN */

function switchToLogin(){

closeModal("registerModal");

setTimeout(function(){

openLogin();

},100);

}

/* JOIN FREEVERSE */

function joinFreeverse(){

const loggedIn=
localStorage.getItem("freeverseLoggedIn")==="true";

if(loggedIn){

showToast(
"✓ You are already a Freeverse member!"
);

return;

}

openRegister();

}

/* TOAST */

function showToast(message){

const toast=document.getElementById("toast");
const messageBox=document.getElementById("toastMessage");

if(!toast||!messageBox){
return;
}

messageBox.textContent=message;

toast.classList.add("show");

clearTimeout(window.toastTimer);

window.toastTimer=setTimeout(function(){

toast.classList.remove("show");

},3000);

}

/* EVENT FILTER */

function filterEvents(category,button){

const cards=document.querySelectorAll(".event-item");

document.querySelectorAll(".filter-btn").forEach(
function(btn){

btn.classList.remove("active");

}
);

if(button){

button.classList.add("active");

}

cards.forEach(function(card){

if(category==="all"){

card.classList.remove("hidden");

}else if(card.classList.contains(category)){

card.classList.remove("hidden");

}else{

card.classList.add("hidden");

}

});

}

/* EVENT DETAILS */

function showEventDetails(type){

const events={

workshop:{
icon:"🛠️",
title:"Freeverse Workshops",
text:"Interactive workshops help students learn practical skills for projects, internships and freelancing.",
items:[
"Hands-on learning sessions",
"Technology and freelancing topics",
"Beginner-friendly activities",
"Project-oriented learning"
]
},

competition:{
icon:"🏆",
title:"Freeverse Competitions",
text:"Competitions give students opportunities to solve challenges and showcase creativity, technical skills and teamwork.",
items:[
"Technical challenges",
"Design challenges",
"Team-based activities",
"Teamwork and problem solving"
]
},

seminar:{
icon:"🎤",
title:"Freeverse Seminars",
text:"Seminars introduce students to industry trends, career development and freelancing opportunities.",
items:[
"Industry-oriented topics",
"Career guidance",
"Expert interaction",
"Question and answer sessions"
]
},

technical:{
icon:"💡",
title:"Technical & Non-Technical Events",
text:"Freeverse supports technical and non-technical activities to develop professional skills.",
items:[
"Coding activities",
"Design activities",
"Communication events",
"Creative challenges"
]
}

};

const event=events[type];

if(!event){
return;
}

const box=document.getElementById("eventDetails");

box.innerHTML=
'<div class="detail-icon">'+
event.icon+
'</div>'+
'<h2>'+
event.title+
'</h2>'+
'<p>'+
event.text+
'</p>'+
'<ul>'+
event.items.map(function(item){

return "<li>"+item+"</li>";

}).join("")+
'</ul>';

document.getElementById("eventModal")
.classList.add("show");

document.body.style.overflow="hidden";

}

/* FREELANCER SEARCH */

function searchFreelancers(){

const input=document.getElementById(
"freelancerSearch"
);

const searchValue=input.value
.trim()
.toLowerCase();

const cards=document.querySelectorAll(
".freelancer-item"
);

let visibleCount=0;

cards.forEach(function(card){

const searchText=
card.dataset.search.toLowerCase();

if(
searchValue===""||
searchText.includes(searchValue)
){

card.classList.remove("hidden");

visibleCount++;

}else{

card.classList.add("hidden");

}

});

const noResults=
document.getElementById("noFreelancers");

if(noResults){

if(visibleCount===0){

noResults.classList.add("show");

}else{

noResults.classList.remove("show");

}

}

}

function clearFreelancerSearch(){

const input=document.getElementById(
"freelancerSearch"
);

if(input){

input.value="";

}

searchFreelancers();

if(input){

input.focus();

}

}

/* FREELANCER PROFILE */

function showProfile(type){

const profiles={

arun:{
initials:"AK",
name:"Arun Kumar",
role:"Web Developer",
skills:"HTML • CSS • JavaScript • Flask",
projects:"8 completed projects",
email:"demo.arun@freeverse.example"
},

priya:{
initials:"PN",
name:"Priya N",
role:"UI/UX Designer",
skills:"Figma • UI/UX • Canva",
projects:"6 completed projects",
email:"demo.priya@freeverse.example"
},

kavin:{
initials:"KR",
name:"Kavin R",
role:"AI & ML Developer",
skills:"Python • AI • ML • Data",
projects:"5 completed projects",
email:"demo.kavin@freeverse.example"
},

meera:{
initials:"MS",
name:"Meera S",
role:"Graphic & Video Editor",
skills:"Graphic Design • Video Editing • Canva • Branding",
projects:"10 completed projects",
email:"demo.meera@freeverse.example"
}

};

const profile=profiles[type];

if(!profile){
return;
}

document.getElementById("profileDetails").innerHTML=

'<div class="profile-circle profile-modal-circle">'+
profile.initials+
'</div>'+

'<h2>'+
profile.name+
'</h2>'+

'<p><b>'+
profile.role+
'</b></p>'+

'<p style="margin-top:12px">'+
profile.skills+
'</p>'+

'<p style="margin-top:10px">'+
'<b>'+
profile.projects+
'</b>'+
'</p>'+

'<p style="margin-top:10px">'+
'Contact: '+
profile.email+
'</p>'+

'<p style="margin-top:15px;font-size:12px;opacity:.8">'+
'This is a fictional demonstration profile for the website.'+
'</p>';

document.getElementById("profileModal")
.classList.add("show");

document.body.style.overflow="hidden";

}

/* GALLERY LIGHTBOX */

let galleryPhotos=[];
let currentPhotoIndex=0;

function collectGalleryPhotos(){

galleryPhotos=Array.from(
document.querySelectorAll(".zoomable")
);

}

function openLightbox(source){

const lightbox=
document.getElementById("lightbox");

const image=
document.getElementById("lightboxImage");

if(!lightbox||!image){
return;
}

collectGalleryPhotos();

currentPhotoIndex=
galleryPhotos.findIndex(function(photo){

return photo.src===source;

});

if(currentPhotoIndex<0){

currentPhotoIndex=0;

}

showCurrentPhoto();

lightbox.classList.add("show");

document.body.style.overflow="hidden";

}

function showCurrentPhoto(){

const image=
document.getElementById("lightboxImage");

if(
!image||
galleryPhotos.length===0
){

return;

}

image.src=
galleryPhotos[currentPhotoIndex].src;

image.alt=
galleryPhotos[currentPhotoIndex].alt||
"Gallery Preview";

}

function nextPhoto(){

if(galleryPhotos.length===0){

collectGalleryPhotos();

}

if(galleryPhotos.length===0){

return;

}

currentPhotoIndex++;

if(currentPhotoIndex>=galleryPhotos.length){

currentPhotoIndex=0;

}

showCurrentPhoto();

}

function previousPhoto(){

if(galleryPhotos.length===0){

collectGalleryPhotos();

}

if(galleryPhotos.length===0){

return;

}

currentPhotoIndex--;

if(currentPhotoIndex<0){

currentPhotoIndex=
galleryPhotos.length-1;

}

showCurrentPhoto();

}

function closeLightbox(){

const lightbox=
document.getElementById("lightbox");

if(lightbox){

lightbox.classList.remove("show");

}

if(!document.querySelector(".modal.show")){

document.body.style.overflow="";

}

}

/* ANIMATED NUMBER */

function animateNumber(element){

const target=parseInt(
element.dataset.count||"0"
);

let current=0;

const duration=1200;

const steps=40;

const increment=target/steps;

let step=0;

const timer=setInterval(function(){

step++;

current+=increment;

if(step>=steps){

current=target;

clearInterval(timer);

}

element.textContent=
Math.floor(current)+"+";

},duration/steps);

}

/* USER INTERFACE */

function updateUserInterface(){

const loggedIn=
localStorage.getItem("freeverseLoggedIn")==="true";

const registerButton=
document.querySelector(".register-btn");

const loginButtons=
document.querySelectorAll(
".nav-actions .nav-btn"
);

if(loggedIn){

const saved=
localStorage.getItem("freeverseUser");

if(saved){

try{

const user=JSON.parse(saved);

if(registerButton){

registerButton.textContent="Member ✓";

registerButton.onclick=function(){

showMemberInfo(user);

};

}

if(loginButtons.length>0){

loginButtons[0].textContent="Logout";

loginButtons[0].onclick=function(){

logoutUser();

};

}

}catch(error){

console.log(
"Unable to read member data."
);

}

}

}else{

if(registerButton){

registerButton.textContent="Register";

registerButton.onclick=openRegister;

}

if(loginButtons.length>0){

loginButtons[0].textContent="Sign In";

loginButtons[0].onclick=openLogin;

}

}

}

/* MEMBER INFORMATION */

function showMemberInfo(user){

const message=
"Welcome, "+
user.name+
"! You are registered as a "+
user.year+
" "+
user.department+
" member.";

showToast("✓ "+message);

}

/* LOGOUT */

function logoutUser(){

localStorage.setItem(
"freeverseLoggedIn",
"false"
);

showToast(
"✓ You have been signed out."
);

setTimeout(function(){

updateUserInterface();

},800);

}

/* OUTSIDE CLICK */

window.addEventListener("click",function(event){

document.querySelectorAll(".modal")
.forEach(function(modal){

if(event.target===modal){

closeModal(modal.id);

}

});

const lightbox=
document.getElementById("lightbox");

if(event.target===lightbox){

closeLightbox();

}

});

/* ESCAPE KEY */

document.addEventListener("keydown",function(event){

if(event.key==="Escape"){

document.querySelectorAll(".modal.show")
.forEach(function(modal){

closeModal(modal.id);

});

const lightbox=
document.getElementById("lightbox");

if(
lightbox&&
lightbox.classList.contains("show")
){

closeLightbox();

}

}

/* GALLERY KEYBOARD CONTROLS */

if(
document.getElementById("lightbox")&&
document.getElementById("lightbox")
.classList.contains("show")
){

if(event.key==="ArrowRight"){

nextPhoto();

}

if(event.key==="ArrowLeft"){

previousPhoto();

}

}

});

/* GLOBAL FUNCTIONS */

window.openLogin=openLogin;
window.openRegister=openRegister;
window.closeModal=closeModal;
window.switchToLogin=switchToLogin;
window.switchToRegister=switchToRegister;
window.joinFreeverse=joinFreeverse;
window.showToast=showToast;
window.filterEvents=filterEvents;
window.showEventDetails=showEventDetails;
window.searchFreelancers=searchFreelancers;
window.clearFreelancerSearch=clearFreelancerSearch;
window.showProfile=showProfile;
window.openLightbox=openLightbox;
window.closeLightbox=closeLightbox;
window.previousPhoto=previousPhoto;
window.nextPhoto=nextPhoto;
window.logoutUser=logoutUser;
/* =========================================
   NEW INTERACTIVE FEATURES
========================================= */

/* FREELANCING PATH QUIZ */

const freeverseQuizQuestions=[
{
question:"What kind of work sounds most interesting?",
options:[
["Web & Coding","web"],
["Design & Visuals","design"],
["AI & Data","ai"],
["Video & Content","content"]
]
},
{
question:"What do you enjoy creating?",
options:[
["Websites","web"],
["Interfaces & Graphics","design"],
["Smart Tools","ai"],
["Reels & Media","content"]
]
},
{
question:"How do you prefer to work?",
options:[
["Build & Solve","web"],
["Design & Improve","design"],
["Experiment & Analyze","ai"],
["Create & Communicate","content"]
]
}
];

let freeverseQuizIndex=0;

let freeverseQuizScores={
web:0,
design:0,
ai:0,
content:0
};

let selectedQuizPath="";

function initFreeverseQuiz(){
freeverseQuizIndex=0;

freeverseQuizScores={
web:0,
design:0,
ai:0,
content:0
};

selectedQuizPath="";

renderFreeverseQuiz();
}

function renderFreeverseQuiz(){

const question=freeverseQuizQuestions[freeverseQuizIndex];

const step=document.getElementById("quizStep");
const questionBox=document.getElementById("quizQuestion");
const optionsBox=document.getElementById("quizOptions");
const nextButton=document.getElementById("quizNext");
const result=document.getElementById("quizResult");

if(!question||!questionBox||!optionsBox){
return;
}

if(step){
step.textContent="Question "+(freeverseQuizIndex+1)+" of "+freeverseQuizQuestions.length;
}

questionBox.textContent=question.question;

optionsBox.innerHTML="";

question.options.forEach(function(option){

const button=document.createElement("button");

button.type="button";
button.className="quiz-option";
button.textContent=option[0];

button.onclick=function(){
selectQuizOption(button,option[1]);
};

optionsBox.appendChild(button);

});

selectedQuizPath="";

if(nextButton){
nextButton.textContent=
freeverseQuizIndex===freeverseQuizQuestions.length-1
?"Show My Path"
:"Next";
}

if(result){
result.classList.remove("show");
result.innerHTML="";
}
}

function selectQuizOption(button,path){

document.querySelectorAll(".quiz-option").forEach(function(option){
option.classList.remove("selected");
});

button.classList.add("selected");

selectedQuizPath=path;
}

function nextPathQuestion(){

if(!selectedQuizPath){
showToast("Please select an option first.");
return;
}

freeverseQuizScores[selectedQuizPath]++;

if(freeverseQuizIndex<freeverseQuizQuestions.length-1){

freeverseQuizIndex++;

renderFreeverseQuiz();

}else{

showFreeverseQuizResult();

}

}

function showFreeverseQuizResult(){

const result=document.getElementById("quizResult");
const questionBox=document.getElementById("quizQuestion");
const optionsBox=document.getElementById("quizOptions");
const nextButton=document.getElementById("quizNext");

if(!result){
return;
}

let path="web";
let highest=freeverseQuizScores.web;

Object.keys(freeverseQuizScores).forEach(function(key){

if(freeverseQuizScores[key]>highest){
highest=freeverseQuizScores[key];
path=key;
}

});

const results={
web:{
title:"Web Development 🌐",
text:"You may enjoy building websites and interactive web applications.",
skills:"HTML • CSS • JavaScript • Flask",
project:"Personal portfolio or club website"
},
design:{
title:"UI/UX & Graphic Design 🎨",
text:"You may enjoy creating interfaces, visuals and attractive digital experiences.",
skills:"Figma • Canva • UI/UX • Branding",
project:"App landing page or student brand kit"
},
ai:{
title:"AI & Data 🤖",
text:"You may enjoy experimenting with intelligent systems and data-driven projects.",
skills:"Python • AI • ML • Data",
project:"Student assistant or data dashboard"
},
content:{
title:"Video & Content 🎬",
text:"You may enjoy storytelling, editing and creating digital content.",
skills:"Video Editing • Storytelling • Social Media",
project:"Event reel or social media content pack"
}
};

const selected=results[path];

if(questionBox){
questionBox.style.display="none";
}

if(optionsBox){
optionsBox.style.display="none";
}

if(nextButton){
nextButton.style.display="none";
}

result.innerHTML=
"<h4>"+selected.title+"</h4>"+
"<p>"+selected.text+"</p>"+
"<p><strong>Skills to explore:</strong> "+selected.skills+"</p>"+
"<p><strong>Starter project:</strong> "+selected.project+"</p>"+
"<button type='button' onclick='resetFreeverseQuiz()'>Retake Quiz</button>";

result.classList.add("show");
}

function resetFreeverseQuiz(){

const questionBox=document.getElementById("quizQuestion");
const optionsBox=document.getElementById("quizOptions");
const nextButton=document.getElementById("quizNext");

if(questionBox){
questionBox.style.display="";
}

if(optionsBox){
optionsBox.style.display="";
}

if(nextButton){
nextButton.style.display="";
}

initFreeverseQuiz();
}


/* FEATURED PROJECTS */

const freeverseProjects={

arun:{
title:"Freeverse Club Portal",
person:"Arun Kumar",
role:"Web Developer",
type:"Web Development",
tools:"HTML • CSS • JavaScript • Flask",
description:"A demonstration club website concept with responsive pages, interactive sections and a simple Flask backend."
},

priya:{
title:"Student Event App UI",
person:"Priya N",
role:"UI/UX Designer",
type:"UI/UX Design",
tools:"Figma • Canva",
description:"A demonstration mobile interface concept for discovering student events, workshops and competitions."
},

kavin:{
title:"AI Study Assistant",
person:"Kavin R",
role:"AI & ML Developer",
type:"Artificial Intelligence",
tools:"Python • AI • ML",
description:"A demonstration AI project concept designed to help students organize learning resources and study tasks."
},

meera:{
title:"Freeverse Brand Reel",
person:"Meera S",
role:"Graphic & Video Editor",
type:"Video & Content",
tools:"Canva • Video Editing • Branding",
description:"A demonstration creative content project concept for promoting Freeverse events through short-form video."
}

};

function showFeaturedProject(type){

const project=freeverseProjects[type];
const box=document.getElementById("featuredProjectDetails");

if(!project||!box){
return;
}

box.innerHTML=
"<h4>"+project.title+"</h4>"+
"<p><strong>Creator:</strong> "+project.person+" — "+project.role+"</p>"+
"<p><strong>Category:</strong> "+project.type+"</p>"+
"<p><strong>Tools:</strong> "+project.tools+"</p>"+
"<p>"+project.description+"</p>"+
"<small>Demo project for website presentation.</small>";

}


/* SKILL EXPLORER */

const freeverseSkills={

web:{
title:"Web Development 🌐",
text:"Build websites and interactive web applications.",
learn:["HTML","CSS","JavaScript"],
practice:["Responsive websites","Forms","Interactive UI"],
freelance:["Business websites","Portfolio websites","Club websites"]
},

uiux:{
title:"UI/UX Design 🎨",
text:"Design simple, attractive and user-friendly digital experiences.",
learn:["Figma","Wireframing","User flows"],
practice:["Landing pages","Mobile screens","Prototypes"],
freelance:["App UI","Website UI","Dashboard design"]
},

graphic:{
title:"Graphic Design 🖌️",
text:"Create visual content for brands, events and social media.",
learn:["Canva","Typography","Color theory"],
practice:["Posters","Logos","Social media designs"],
freelance:["Event posters","Brand kits","Social media graphics"]
},

video:{
title:"Video Editing 🎬",
text:"Turn raw footage into engaging digital content.",
learn:["Video editing","Transitions","Storytelling"],
practice:["Reels","Event videos","Promotional videos"],
freelance:["Instagram reels","Event highlights","Promotional videos"]
},

ai:{
title:"AI & ML 🤖",
text:"Explore intelligent systems and data-driven applications.",
learn:["Python","Machine Learning","Data handling"],
practice:["Prediction models","AI tools","Data dashboards"],
freelance:["AI prototypes","Data analysis","Student AI projects"]
},

app:{
title:"App Development 📱",
text:"Create useful mobile applications for real-world needs.",
learn:["App UI","Programming","APIs"],
practice:["Login screens","CRUD apps","Mobile interfaces"],
freelance:["Student apps","Business apps","Utility apps"]
}

};

function exploreSkill(type,button){

const skill=freeverseSkills[type];
const box=document.getElementById("skillDetails");

if(!skill||!box){
return;
}

document.querySelectorAll(".skill-btn").forEach(function(btn){
btn.classList.remove("active");
});

if(button){
button.classList.add("active");
}

box.innerHTML=
"<h4>"+skill.title+"</h4>"+
"<p>"+skill.text+"</p>"+
"<div class='skill-lists'>"+
"<div class='skill-list'><strong>📚 Learn</strong><ul>"+
skill.learn.map(function(item){
return "<li>"+item+"</li>";
}).join("")+
"</ul></div>"+
"<div class='skill-list'><strong>🛠️ Practice</strong><ul>"+
skill.practice.map(function(item){
return "<li>"+item+"</li>";
}).join("")+
"</ul></div>"+
"<div class='skill-list'><strong>💼 Freelance</strong><ul>"+
skill.freelance.map(function(item){
return "<li>"+item+"</li>";
}).join("")+
"</ul></div>"+
"</div>";

}


/* INITIALIZE NEW FEATURES */

document.addEventListener("DOMContentLoaded",function(){

initFreeverseQuiz();
exploreSkill("web");

});


/* NEW GLOBAL FUNCTIONS */

window.nextPathQuestion=nextPathQuestion;
window.selectQuizOption=selectQuizOption;
window.resetFreeverseQuiz=resetFreeverseQuiz;
window.showFeaturedProject=showFeaturedProject;
window.exploreSkill=exploreSkill;
/* =========================================
   FEATURED FREELANCER + SKILL BADGES
========================================= */

const featuredFreelancers=[
{
initials:"AK",
name:"Arun Kumar",
role:"Web Developer",
description:"Building responsive websites and turning ideas into useful digital experiences.",
projects:8,
skills:["HTML","CSS","JavaScript","Flask"],
badges:["🌐 Web Creator","💻 Frontend Builder"],
profile:"arun"
},
{
initials:"PN",
name:"Priya N",
role:"UI/UX Designer",
description:"Creating clean and user-friendly interfaces that make digital experiences simple and attractive.",
projects:6,
skills:["Figma","UI/UX","Canva"],
badges:["🎨 UI/UX Creator","✨ Design Thinker"],
profile:"priya"
},
{
initials:"KR",
name:"Kavin R",
role:"AI & ML Developer",
description:"Exploring artificial intelligence and machine learning to build useful student-focused solutions.",
projects:5,
skills:["Python","AI","ML","Data"],
badges:["🤖 AI Builder","🧠 ML Explorer"],
profile:"kavin"
},
{
initials:"MS",
name:"Meera S",
role:"Graphic & Video Editor",
description:"Creating visual stories, event content and digital designs for student communities and brands.",
projects:10,
skills:["Graphic Design","Video Editing","Canva","Branding"],
badges:["🎬 Creative Editor","🎨 Visual Creator"],
profile:"meera"
}
];

let featuredFreelancerIndex=0;

function getFeaturedWeekIndex(){

const now=new Date();

const start=new Date(now.getFullYear(),0,1);

const difference=now-start;

const oneWeek=1000*60*60*24*7;

const week=Math.floor(difference/oneWeek);

return week%featuredFreelancers.length;

}

function renderFeaturedFreelancer(){

const freelancer=featuredFreelancers[featuredFreelancerIndex];

if(!freelancer){
return;
}

const avatar=document.getElementById("featuredAvatar");
const name=document.getElementById("featuredName");
const role=document.getElementById("featuredRole");
const description=document.getElementById("featuredDescription");
const projects=document.getElementById("featuredProjects");
const skillCount=document.getElementById("featuredSkillCount");
const badges=document.getElementById("featuredBadges");

if(avatar){
avatar.textContent=freelancer.initials;
}

if(name){
name.textContent=freelancer.name;
}

if(role){
role.textContent=freelancer.role;
}

if(description){
description.textContent=freelancer.description;
}

if(projects){
projects.textContent=freelancer.projects;
}

if(skillCount){
skillCount.textContent=freelancer.skills.length;
}

if(badges){

badges.innerHTML="";

freelancer.badges.forEach(function(badge){

const badgeElement=document.createElement("span");

badgeElement.className="skill-badge";

badgeElement.textContent=badge;

badges.appendChild(badgeElement);

});

}

}

function openFeaturedProfile(){

const freelancer=featuredFreelancers[featuredFreelancerIndex];

if(!freelancer){
return;
}

showProfile(freelancer.profile);

}

function nextFeaturedFreelancer(){

featuredFreelancerIndex++;

if(featuredFreelancerIndex>=featuredFreelancers.length){
featuredFreelancerIndex=0;
}

renderFeaturedFreelancer();

showToast("⭐ Featured freelancer changed.");

}

function addFreelancerSkillBadges(){

const badgeData={

"Arun Kumar":[
"🌐 Web Creator",
"💻 Frontend Builder"
],

"Priya N":[
"🎨 UI/UX Creator",
"✨ Design Thinker"
],

"Kavin R":[
"🤖 AI Builder",
"🧠 ML Explorer"
],

"Meera S":[
"🎬 Creative Editor",
"🎨 Visual Creator"
]

};

document.querySelectorAll(".freelancer-card").forEach(function(card){

const nameElement=card.querySelector("h3");

if(!nameElement){
return;
}

const name=nameElement.textContent.trim();

const badges=badgeData[name];

if(!badges){
return;
}

if(card.querySelector(".card-badges")){
return;
}

const badgeContainer=document.createElement("div");

badgeContainer.className="card-badges";

badges.forEach(function(badge){

const badgeElement=document.createElement("span");

badgeElement.className="skill-badge";

badgeElement.textContent=badge;

badgeContainer.appendChild(badgeElement);

});

const button=card.querySelector("button");

if(button){

card.insertBefore(badgeContainer,button);

}else{

card.appendChild(badgeContainer);

}

});

}


/* INITIALIZE FEATURED FREELANCER */

document.addEventListener("DOMContentLoaded",function(){

featuredFreelancerIndex=getFeaturedWeekIndex();

renderFeaturedFreelancer();

addFreelancerSkillBadges();

});


/* GLOBAL FUNCTIONS */

window.openFeaturedProfile=openFeaturedProfile;
window.nextFeaturedFreelancer=nextFeaturedFreelancer;
/* =========================================
   FREELANCE OPPORTUNITY BOARD
========================================= */

const freelanceOpportunities={

portfolio:{
title:"Student Portfolio Website",
category:"Web Development",
skills:"HTML • CSS • JavaScript",
level:"Beginner",
description:"Create a responsive personal portfolio that showcases a student's skills, projects, certificates and contact information.",
deliverables:[
"Responsive homepage",
"Skills section",
"Project showcase",
"Contact section"
]
},

eventui:{
title:"College Event App UI",
category:"UI/UX Design",
skills:"Figma • UI/UX",
level:"Intermediate",
description:"Design a simple mobile interface where students can discover upcoming workshops, competitions and club activities.",
deliverables:[
"Home screen",
"Event listing screen",
"Event details screen",
"Simple navigation flow"
]
},

dashboard:{
title:"Student Data Dashboard",
category:"AI & ML",
skills:"Python • AI • Data",
level:"Intermediate",
description:"Build a useful dashboard that presents student-related information through simple data analysis or an AI-powered feature.",
deliverables:[
"Data input",
"Dashboard interface",
"Useful visual information",
"Simple AI or analysis feature"
]
},

reel:{
title:"Event Promotion Reel",
category:"Video & Content",
skills:"Video Editing • Canva",
level:"Beginner",
description:"Create a short promotional video that introduces a Freeverse event and encourages students to participate.",
deliverables:[
"Event introduction",
"Creative visuals",
"Short-form editing",
"Call-to-action ending"
]
}

};

function filterOpportunities(category,button){

document.querySelectorAll(".opportunity-filter").forEach(function(btn){
btn.classList.remove("active");
});

if(button){
button.classList.add("active");
}

document.querySelectorAll(".opportunity-card").forEach(function(card){

if(category==="all"){
card.classList.remove("hidden");
return;
}

if(card.classList.contains("opportunity-"+category)){
card.classList.remove("hidden");
}else{
card.classList.add("hidden");
}

});

}

function showOpportunity(type){

const opportunity=freelanceOpportunities[type];
const box=document.getElementById("opportunityDetails");

if(!opportunity||!box){
return;
}

box.innerHTML=
"<h4>"+opportunity.title+"</h4>"+
"<p><strong>Category:</strong> "+opportunity.category+"</p>"+
"<p><strong>Skills:</strong> "+opportunity.skills+"</p>"+
"<p><strong>Difficulty:</strong> "+opportunity.level+"</p>"+
"<p>"+opportunity.description+"</p>"+
"<p><strong>Suggested Deliverables:</strong></p>"+
"<ul>"+
opportunity.deliverables.map(function(item){
return "<li>"+item+"</li>";
}).join("")+
"</ul>";

box.scrollIntoView({
behavior:"smooth",
block:"nearest"
});

}


/* =========================================
   FREELANCING READINESS METER
========================================= */

const readinessQuestions=[

"Do you have at least one practical skill?",

"Have you completed at least one project?",

"Do you have a portfolio or project showcase?",

"Are you comfortable communicating your work to others?"

];

let readinessIndex=0;
let readinessScore=0;
let readinessSelected=false;

function initReadiness(){

readinessIndex=0;
readinessScore=0;
readinessSelected=false;

const result=document.getElementById("readinessResult");

if(result){
result.classList.remove("show");
result.innerHTML="";
}

renderReadinessQuestion();

}

function renderReadinessQuestion(){

const question=document.getElementById("readinessQuestion");
const options=document.getElementById("readinessOptions");

if(!question||!options){
return;
}

question.textContent=readinessQuestions[readinessIndex];

options.innerHTML=
"<button onclick='selectReadiness(20,this)'>Yes</button>"+
"<button onclick='selectReadiness(0,this)'>Not Yet</button>";

readinessSelected=false;

}

function selectReadiness(points,button){

document.querySelectorAll("#readinessOptions button").forEach(function(btn){
btn.classList.remove("selected");
});

button.classList.add("selected");

button.dataset.points=points;

readinessSelected=true;

}

function nextReadinessQuestion(){

if(!readinessSelected){

showToast("Please select an option first.");

return;

}

const selected=document.querySelector("#readinessOptions button.selected");

if(selected){
readinessScore+=Number(selected.dataset.points||0);
}

if(readinessIndex<readinessQuestions.length-1){

readinessIndex++;

renderReadinessQuestion();

}else{

showReadinessResult();

}

}

function showReadinessResult(){

const question=document.getElementById("readinessQuestion");
const options=document.getElementById("readinessOptions");
const result=document.getElementById("readinessResult");
const nextButton=document.querySelector(".readiness-next");

if(question){
question.style.display="none";
}

if(options){
options.style.display="none";
}

if(nextButton){
nextButton.style.display="none";
}

let title="";
let message="";

if(readinessScore>=80){

title="Ready to Explore Freelancing 🚀";
message="You have a strong foundation. Start building your portfolio and explore suitable opportunities.";

}else if(readinessScore>=50){

title="Almost Ready 💡";
message="You have a good starting point. Focus on completing more projects and improving your portfolio.";

}else{

title="Keep Building Your Skills 🌱";
message="Start with one practical skill, complete a small project and gradually build your portfolio.";

}

result.innerHTML=
"<div class='readiness-score'>"+readinessScore+"%</div>"+
"<h4>"+title+"</h4>"+
"<p>"+message+"</p>"+
"<button onclick='resetReadiness()'>Check Again</button>";

result.classList.add("show");

}

function resetReadiness(){

const question=document.getElementById("readinessQuestion");
const options=document.getElementById("readinessOptions");
const nextButton=document.querySelector(".readiness-next");

if(question){
question.style.display="";
}

if(options){
options.style.display="";
}

if(nextButton){
nextButton.style.display="";
}

initReadiness();

}


/* INITIALIZE NEW FEATURES */

document.addEventListener("DOMContentLoaded",function(){

initReadiness();

});


/* GLOBAL FUNCTIONS */

window.filterOpportunities=filterOpportunities;
window.showOpportunity=showOpportunity;
window.selectReadiness=selectReadiness;
window.nextReadinessQuestion=nextReadinessQuestion;
window.resetReadiness=resetReadiness;