var express = require('express');
var router = express.Router()
var users = require('../models').user;
var methods = require('../methods');
var config = require('../config/config.js');
var jwt=require('jsonwebtoken');
var token;
var username;
var val=0;

var {PythonShell} = require('python-shell');


router.get('/',(req,res) =>{
    res.render('home');
})
router.get('/log',(req,res) =>{
    res.render('admin');
})
/*
router.get('/enter', (req,res) =>{
    var uss= new users({
        username:"admin123",
        password:"feedback",
    
      });
      bcrypt.hash(uss.password, saltRounds, function(err, hash) {
        console.log(hash);
        uss.password = hash;
        uss.save().then(() => {
        
            res.send({"Message ":"Successfully saved"});
        });
      });
    
})*/
router.post('/login',(req,res) =>{
    username = req.body.username;
    users.findOne({where:{
        username:req.body.username} }).then( user => {
            
            if(!user){
          console.log(req.body.username);
                res.send({success:false,message:"Authentication failed"});
            }else
            {
                if(user.verified==false)
                {
                    res.send("Your application has not been verified yet!!");
                }
                else
                {
          console.log(user);
                isMatch=users.comparePassword(req.body.password,user);
    
                    if(isMatch)
                    {
                         token=jwt.sign(user.dataValues,config,{
                             expiresIn : "1000ms"
                            
                            });
                        //res.cookie('jwt',token);
                //res.status(200).send({success: true , token :'JWT ' + token})
                            res.redirect('./me');
                            
    
                    }
                    else
                    {
                        res.send({success:false,message:"passwords did not match"});
                    }
                }
                
            }
    
        }
        );

})
router.get('/me',(req,res) =>{
    
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      else     
      res.redirect('/me/predict');

    });

})


router.post('/feedback', function(req,res){
    var feedback={};
    feedback.feedback=req.body.comment;
    console.log(feedback)
    methods.sentiment.insert(feedback).then((result) =>{
        console.log(result)
    })
    .catch((err) =>{
        console.log(err)
    })
    
})
router.get('/me/predict',(req,res) => {
    var i=0,fb=[];
    var total=0;
    methods.sentiment.getAll().then((results) =>{
        console.log("getall" , results)
        for(i=0;i<results[0].length;i++)
        {
        fb[i]=results[0][i].feedback;
        }
        total=results[0].length;
        console.log(total)
       
            let options = {
            mode: 'text',
            //pythonPath: '',
            pythonOptions: ['-u'], // get print results in real-time
            scriptPath: '/home/chithra/TheFeedBackApp/',
            args: [fb]
            };
            console.log(fb)
            var values = {}
            PythonShell.run('predict.py', options, function (err, results) {
            {
                console.log("result:",results)
                values.average = parseFloat(results[1])
                values.positive = parseInt(results[2])
                values.negative = parseInt(results[3])
                values.total = total
                var temp = results[4].replace(/['"]+/g, '');
                temp=temp.replace("[", '');
                temp=temp.replace("]", '');
                console.log(temp)
                var array = JSON.parse("[" + temp + "]");
                console.log(array)
                var temparr = {};
                methods.feed.drop().then((op) =>{
                    console.log(op)

                    for(i=0;i<array.length;i++)
                    {
                        temparr.value = array[i];
                        temparr.id=i+1;
                        console.log("inserting value at ",i," : ",temparr)
                        methods.feed.insert(temparr).then((result) =>{
                            console.log(result)
                        })
                    }
                    console.log(values)
                    res.render('chart', {values})
                })
                .catch((err) =>{
                    console.log(err)
                })
  
            }
            })
        
        console.log(val)


    })
    .catch((err) =>{
        console.log(err)
    })


})

router.get('/me/predict/feeds', (req,res) =>{
    var val ={}
    methods.feed.getFeedsPos().then((rest =>{
        console.log(rest)
        console.log(rest[0][0])
        var pos =[]
        var length =10;
        if(rest[0].length<=length)
        length = rest[0].length
        val.poslength = length
        for(var i=0;i<length;i++)
        {
            pos[i] = rest[0][i].feedback
        }
        val.pos=pos;
        methods.feed.getFeedsNeg().then((result =>{
            console.log(result)

        var neg =[]
        length =10
        if(result[0].length<=length)
        length = result[0].length
        val.neglength = length
        for(var i=0;i<length;i++)
        {
            neg[i] = result[0][i].feedback
        }
        val.neg=neg;            
        res.render('feeds',{val})
        }))
        .catch((err) =>{
            console.log(err)
        })
    }))
    .catch((err) =>{
        console.log(err)
    })
})


router.get('/logout', (req,res) =>{
    token= null;
    res.render('home')
})
module.exports = router;