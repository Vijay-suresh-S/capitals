import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app=express();
const port=3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
// app.use(express.static("public"));
let quiz;
let question;
let incorrectAnswer=false;
let total=0;

const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"world",
    password:"Vijay",
    port:5432
    // idleTimeoutMillis: 300000
})

db.connect();
db.query("select * from capitals",(err,res)=>{
    if(err)
    {
        console.log(`there has been an error ${err.stack} `);
    }
    else{
     quiz=res.rows;
    // console.log(quiz);
    }
    // db.end();
});


app.get("/",async (req,res)=>{
    await nextQuestion();
    res.render("index.ejs",{
        data:question
    })
});
async function nextQuestion(){
 question=quiz[Math.floor((Math.random()*quiz.length))];
console.log(question);
};


app.post("/submit",async (req,res)=>{
    let ans=req.body.capital.trim();
    console.log(ans);
    if(ans.toLowerCase()===question.capital.toLowerCase())
    {
        total=total+1;
        await nextQuestion();
        res.render("index.ejs",{
            data:question,
            total:total
        })
    }
    else{
        // alert(`your total score ${total}`);
        total=0;
        incorrectAnswer=true;
        await nextQuestion();
        res.render("index.ejs",{
            data:question,
            total:total,
            result:incorrectAnswer
           })
    }
})

app.listen(port,(req,res)=>{
    console.log(`The server is running on port ${port}`);
});
