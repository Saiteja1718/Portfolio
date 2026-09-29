const EMAIL="sd3990@columbia.edu";
import React,{useState,useEffect} from "react";
import PHOTO from "./assets/photo.jpg";
const h=React.createElement;

const EXP=[
 {t:"AI Intern",o:"Starr Insurance, New York, NY",d:"Jun 2026 – Aug 2026",b:[
  "Built a Claims Similarity Search tool using TF-IDF and embedding-based retrieval to surface relevant historical claims from unstructured text.",
  "Developed machine-learning models that predict claim severity across the claim lifecycle, reaching 90% accuracy with a two-stage Gaussian model.",
  "Built a Python data quality pipeline that profiles datasets, detects anomalies and writes prioritized business rules with Meta LLaMA 3.3 8B, replacing a manual multi-step process.",
  "Presented methodology, prototype and recommendations to the AI/ML team weekly and folded stakeholder feedback into each iteration."]}];
const RES=[
 {t:"HVD-Random Forest Classifier for Multi-Class Arrhythmia Recognition",d:"Mar 2024 – Jan 2025",b:[
  "Led a 3-member research team: scoped the project with faculty, set milestones and ran weekly reviews.",
  "Extracted intrinsic mode functions with Hilbert Vibration Decomposition and used CORAL domain adaptation to handle distribution shift between datasets.",
  "Tuned a domain-adapted Random Forest with feature selection to reach 98% test accuracy and better cross-domain performance."],c:["Signal processing","Domain adaptation","Random Forest"]},
 {t:"CBAM-Based Hybrid CNN-Autoencoder for Brain Tumor Classification",d:"Research paper",b:[
  "Proposed the project direction, assigned tasks and mentored teammates on deep learning.",
  "Designed hybrid CNN-Autoencoder models with attention to capture spatial features for multiclass classification.",
  "Reached 95% test accuracy on 1,400 brain tumor images using the Convolutional Block Attention Module.",
  "Co-authored and presented the findings in a conference paper."],c:["CNN","Autoencoder","CBAM","PyTorch"]}];
const PRJ=[
 {t:"ResumeFit: AI Semantic Matching for Jobs",d:"Oct – Dec 2025",b:[
  "FastAPI + SQLite job platform that auto-applies to roles scoring 75%+ using sentence-transformer embeddings and hybrid scoring, cutting application time by 80%.",
  "Resume optimizer that lifts 65–75% matches by injecting 10–15 missing keywords, analyzing each job in under 2 seconds with TF-IDF.",
  "Secure multi-user system with authentication and profiles, tracking 100+ applications across 30+ tech job descriptions."],c:["FastAPI","SQLite","Sentence Transformers","TF-IDF"]},
 {t:"Smart Diet Recommendation System with LLM",d:"Nov – Dec 2025",b:[
  "k-NN engine over 500K+ recipes with 95% budget accuracy and 156 ms query latency using cosine similarity.",
  "FastAPI + Streamlit microservices in Docker on Hugging Face Spaces, with three modules behind a REST API.",
  "Budget-aware planner using TinyLlama-1.1B for meal plans, shopping lists and cost estimates."],c:["FastAPI","Streamlit","Docker","TinyLlama","k-NN"]}];
const SKILLS=[
 ["Languages","Python, SQL, R, C/C++, MATLAB, JavaScript, HTML, CSS"],
 ["Machine learning","Scikit-learn, NumPy, Pandas, NLTK, spaCy, Transformers, OpenCV, Torchvision"],
 ["Deep learning & GenAI","PyTorch, TensorFlow, Keras, LangChain, LlamaIndex, RAG, Prompt Engineering, PySpark, Streamlit"],
 ["Data analysis & viz","Excel, Tableau, Power BI, Matplotlib, Seaborn"],
 ["Cloud & platforms","AWS, Microsoft Azure, Google Cloud Platform"],
 ["Data tools","Snowflake, Databricks, Git/GitHub, Docker, ETL Pipelines, A/B Testing"]];

const Bul=b=>h("ul",null,b.map((x,i)=>h("li",{key:i},x)));
const Chips=c=>c&&h("div",{className:"chips"},c.map(x=>h("span",{className:"chip mono",key:x},x)));
const Sec=(id,tag,title,kids)=>h("section",{id},h("div",{className:"wrap"},h("h2",null,h("i",null,tag),title),kids));
const Item=(x,i)=>h(Rv,{key:i},h("div",{className:"card"},h("div",{className:"top"},h("h3",null,x.t),h("span",{className:"d mono"},x.d)),x.o&&h("div",{className:"org"},x.o),Bul(x.b),Chips(x.c)));

function Rv({children}){const r=React.useRef();useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){r.current.classList.add("on");o.disconnect()}},{threshold:.12});o.observe(r.current);return()=>o.disconnect()},[]);return h("div",{className:"rv",ref:r},children)}
function TL({items}){const r=React.useRef();useEffect(()=>{const f=()=>{const b=r.current.getBoundingClientRect();r.current.style.setProperty("--p",Math.max(0,Math.min(1,(innerHeight*.75-b.top)/b.height)))};f();addEventListener("scroll",f,{passive:true});return()=>removeEventListener("scroll",f)},[]);return h("div",{className:"tl",ref:r},items.map(Item))}
function Proj({x}){const [o,setO]=useState(false);
const mv=e=>{const t=e.currentTarget,b=t.getBoundingClientRect(),px=(e.clientX-b.left)/b.width,py=(e.clientY-b.top)/b.height;t.style.setProperty("--x",px*100+"%");t.style.setProperty("--y",py*100+"%");t.style.transform="perspective(800px) rotateX("+(.5-py)*7+"deg) rotateY("+(px-.5)*9+"deg)"};
return h(Rv,null,h("div",{className:"card sp",onMouseMove:mv,onMouseLeave:e=>{e.currentTarget.style.transform=""}},h("div",{className:"top"},h("h3",null,x.t),h("span",{className:"d mono"},x.d)),h("ul",null,h("li",null,x.b[0])),h("div",{className:"det"+(o?" open":"")},h("div",null,Bul(x.b.slice(1)))),Chips(x.c),h("button",{className:"more",onClick:()=>setO(!o),"aria-expanded":o},o?"Hide details −":"Show details +")))}
function Num({v}){const r=React.useRef(),[n,setN]=useState(0),T=parseFloat(v),S=v.replace(/[0-9.]/g,""),D=(v.split(".")[1]||"").length;useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(!e.isIntersecting)return;o.disconnect();if(matchMedia("(prefers-reduced-motion: reduce)").matches)return setN(T);const t0=performance.now(),f=now=>{const p=Math.min((now-t0)/1400,1);setN(T*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)});o.observe(r.current);return()=>o.disconnect()},[]);return h("strong",{ref:r},n.toFixed(D)+S)}
function Fx(){const c=React.useRef();useEffect(()=>{const cv=c.current,x=cv.getContext("2d"),m={x:-999,y:-999},rd=matchMedia("(prefers-reduced-motion: reduce)").matches;let W,H,P=[],id;
const rs=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight;P=Array.from({length:Math.min(70,Math.floor(W/16))},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4}))};
rs();addEventListener("resize",rs);const mm=e=>{m.x=e.clientX;m.y=e.clientY};addEventListener("mousemove",mm);
const dr=()=>{x.clearRect(0,0,W,H);P.forEach((p,i)=>{if(!rd){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1}
x.fillStyle="rgba(34,211,238,.7)";x.beginPath();x.arc(p.x,p.y,1.6,0,7);x.fill();
for(let j=i+1;j<P.length;j++){const q=P[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<130){x.strokeStyle="rgba(139,92,246,"+(1-d/130)*.35+")";x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}}
const dm=Math.hypot(p.x-m.x,p.y-m.y);if(dm<160){x.strokeStyle="rgba(34,211,238,"+(1-dm/160)*.6+")";x.beginPath();x.moveTo(p.x,p.y);x.lineTo(m.x,m.y);x.stroke()}});
if(!rd)id=requestAnimationFrame(dr)};dr();
const sc=()=>{document.getElementById("bar").style.width=scrollY/(document.documentElement.scrollHeight-innerHeight)*100+"%"};addEventListener("scroll",sc,{passive:true});
return()=>{cancelAnimationFrame(id);removeEventListener("resize",rs);removeEventListener("mousemove",mm);removeEventListener("scroll",sc)}},[]);
return h(React.Fragment,null,h("canvas",{id:"bg",ref:c}),h("div",{id:"bar"}))}
const LINKS=[["LinkedIn","https://www.linkedin.com/in/sai-teja-dusari-a627b02b4/"],["GitHub","https://github.com/Saiteja1718"],["Google Scholar","https://scholar.google.com/citations?user=v5aOO8MAAAAJ"]];
function Social(){return h("div",{className:"soc mono"},LINKS.map(([l,u])=>h("a",{key:l,href:u,target:"_blank",rel:"noopener noreferrer"},l)))}
function Typing(){
  const words=["Data Scientist","Machine Learning Engineer","GenAI Builder","Researcher"];
  const [i,setI]=useState(0),[n,setN]=useState(0),[del,setDel]=useState(false);
  useEffect(()=>{
    const w=words[i];
    if(matchMedia("(prefers-reduced-motion: reduce)").matches){setN(w.length);const t=setTimeout(()=>setI((i+1)%words.length),2500);return()=>clearTimeout(t)}
    const t=setTimeout(()=>{
      if(!del&&n<w.length)setN(n+1);
      else if(!del)setDel(true);
      else if(n>0)setN(n-1);
      else{setDel(false);setI((i+1)%words.length)}
    },!del&&n===w.length?1400:del?35:70);
    return()=>clearTimeout(t);
  },[n,del,i]);
  return h("div",{className:"role mono"},"> ",h("b",null,words[i].slice(0,n)),h("span",{className:"cur"}));
}

function ResumeBtn({solid}){return h("a",{className:"btn"+(solid?" solid":""),href:"SaiTeja_Dusari_Resume.pdf",download:"SaiTeja_Dusari_Resume.pdf"},"Download resume")}

function Feedback(){
  const [name,setName]=useState(""),[msg,setMsg]=useState("");
  const href="mailto:"+EMAIL+"?subject="+encodeURIComponent("Portfolio feedback"+(name?" from "+name:""))+"&body="+encodeURIComponent(msg+(name?"\n\n"+name:""));
  return h("form",{onSubmit:e=>e.preventDefault()},
    h("input",{placeholder:"Your name (optional)","aria-label":"Your name",value:name,onChange:e=>setName(e.target.value)}),
    h("textarea",{placeholder:"Your feedback or message","aria-label":"Your feedback",value:msg,onChange:e=>setMsg(e.target.value)}),
    h("div",{className:"cta"},h("a",{className:"btn solid",href,target:"_blank",rel:"noopener"},"Send feedback by email")),
    h("p",{className:"note",style:{margin:0}},"This opens your email app with the message ready to send to "+EMAIL+"."));
}

function App(){
  return h(React.Fragment,null,
    h(Fx,null),h("header",null,h("div",{className:"wrap"},
      h("a",{className:"logo mono",href:"#top"},"sai",h("span",null,".teja")),
      h("nav",null,[["experience","Experience"],["research","Research"],["projects","Projects"],["skills","Skills"],["education","Education"],["contact","Contact"]].map(([id,l])=>h("a",{key:id,href:"#"+id},l))),
      h(ResumeBtn,null))),
    h("main",{id:"top"},h("div",{className:"wrap"},
      h("div",{className:"hero"},
        h("div",{className:"in"},
          h("div",{className:"tag mono"},"Columbia University · MS Data Science"),
          h("h1",null,"Sai Teja Dusari"),
          h(Typing,null),
          h("p",{className:"lead"},"I build machine learning systems, from claims-severity models and LLM-driven data quality pipelines to published research in medical signal and image classification."),
          h("div",{className:"cta"},h("a",{className:"btn solid",href:"#contact"},"Get in touch"),h("a",{className:"btn",href:"#projects"},"View projects"),h(ResumeBtn,null)),h(Social,null)),
        h("div",{className:"ph"},h("img",{src:PHOTO,alt:"Portrait of Sai Teja Dusari"}))),
      h("div",{className:"stats"},[["4.00","CGPA, B.Tech in AI"],["98%","arrhythmia recognition accuracy"],["95%","brain tumor classification accuracy"],["90%","claim severity model accuracy"]].map(([a,b])=>h("div",{key:b},h(Num,{v:a}),h("span",null,b)))))),
    Sec("experience","01","Experience",h(TL,{items:EXP})),
    Sec("research","02","Research",h(TL,{items:RES})),
    Sec("projects","03","Projects",h("div",{className:"grid"},PRJ.map((x,i)=>h(Proj,{x,key:i})))),
    Sec("skills","04","Technical skills",h("div",{className:"card"},SKILLS.map(([k,v])=>h("div",{className:"sk",key:k},h("h3",{className:"mono"},k),Chips(v.split(", ")))))),
    Sec("education","05","Education",h("div",{className:"grid"},
      h("div",{className:"card edu"},h("div",{className:"top"},h("h3",null,"Columbia University"),h("span",{className:"d mono"},"Expected Dec 2026")),h("div",{className:"org"},"MS in Data Science · New York, NY"),h("p",{className:"note",style:{margin:0}},"Computer Systems for Data Science, Applied Machine Learning, Statistical Inference and Modeling, Exploratory Data Analysis and Visualization, Generative AI using LLMs.")),
      h("div",{className:"card edu"},h("div",{className:"top"},h("h3",null,"SRM Institute of Science and Technology"),h("span",{className:"d mono"},"Sep 2021 – Aug 2025")),h("div",{className:"org"},"B.Tech in Artificial Intelligence · CGPA 4.00/4.00"),h("p",{className:"note",style:{margin:0}},"Data Structures and Algorithms, Deep Learning, NLP, Neural Networks, Cloud Computing, Database Management Systems.")))),
    Sec("contact","06","Contact",h("div",{className:"two"},
      h("div",null,h("p",{style:{marginTop:0,color:"var(--mut)"}},"Open to conversations about data science and AI roles, research and collaboration. Email is the fastest way to reach me."),
        h("p",null,h("a",{className:"mono",href:"mailto:"+EMAIL},EMAIL)),h("p",{className:"mono",style:{color:"var(--mut)",fontSize:14}},"(646) 515-8585 · New York, NY"),
        h("div",{className:"cta"},h(ResumeBtn,{solid:true})),h(Social,null)),
      h(Feedback,null))),
    h("footer",null,h("div",{className:"wrap mono"},"© 2026 Sai Teja Dusari")));
}
export default App;
