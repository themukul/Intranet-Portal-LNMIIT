var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    Project_btp           = require("./models/project_btp"),
    Project_mini          = require("./models/project_mini"),
    cookieParser = require('cookie-parser'),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")
    
mongoose.connect("mongodb://intranet:xiaomimipad@ds157639.mlab.com:57639/portal");
var db = mongoose.connection;

db.on('error', function callback(err){console.error('mongoose connection error:', err)} );

db.once('open', function callback () {
    console.log("mongoose connected");
});

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//============
// ROUTES
//============

app.get("/", function(req, res){
    res.render("portal_login");
});

app.get("/dashboard", function(req, res){
    res.render("dashboard");
});

app.get("/enrollment", function(req, res){
    res.render("enrollment");
});

app.get("/material", function(req, res){
    res.render("material");
});

app.get("/profile", function(req, res){
    res.render("profile");
});

app.get("/secret", isLoggedIn, function(req, res){
   res.render("secret"); 
});

app.get("/project_btp",function(req,res){
    Project_btp.find({},function(err,btp){
        if(err){
            console.log("Error");
        } else{
            res.render("project_btp",{btp,btp});
        }
    });
});

app.get("/project_btp/new_btp", function(req,res){
    res.render("new_btp");
});

app.post("/project_btp",function(req,res){
    Project_btp.create(req.body.project_btp, function(err,newBtp){
        console.log(newBtp);
        if(err){
            console.log(err);
        }else{
            res.redirect("/project_btp");
        }
    });
});

app.get("/project_mini",function(req,res){
    Project_mini.find({},function(err,mini){
        if(err){
            console.log("Error");
        } else{
            res.render("project_mini",{mini,mini});
        }
    });
});


app.get("/project_mini/new_project_mini", function(req,res){
    res.render("new_project_mini");
});

app.post("/project_mini",function(req,res){
    Project_mini.create(req.body.project_mini, function(err,newMini){
        console.log(newMini);
        if(err){
            console.log(err);
        }else{
            res.redirect("/project_mini");
        }
    });
});

// Auth Routes

//show sign up form
app.get("/register", function(req, res){
   res.render("portal_register"); 
});

//handling user sign up
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username, type: req.body.type}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('portal_register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/dashboard"); 
        });
    });
});

// LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
   res.render("portal_login"); 
});

//login logic
//middleware
app.post("/login",passport.authenticate("local", {
        successRedirect: "/dashboard",                      
        failureRedirect: "/login",
    
    })
)
// app.post("/loginstudent" ,function(req, res){
//     if(req.body.hasOwnProperty('type') && req.body.type === 'student') {
//         return passport.authenticate("local", {
//         successRedirect: "/secret",                      
//         failureRedirect: "/login",
    
//     })
        
//     } else {
//         res.send({
//             "status": "fail",
//             "error": "restricted to students only"
//         })
//     }
// });

app.post("/loginteacher" ,function(req, res){
    if(req.body.hasOwnProperty('type') && req.body.type === 'teacher') {
        // return passport.authenticate(  'local', 
        // {
        //     session: false
        //   }), serialize, generateToken, respond);
          return res.send('success')
        
    } else {
        res.send({
            "status": "fail",
            "error": "restricted to teacher only"
        })
    }
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    console.log(req.isAuthenticated(), req.username)
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("server started.......");
})