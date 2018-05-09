var mongoose= require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var Project_miniSchema= new mongoose.Schema({
    faculty:String,
    project:String
});

// Project_miniSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("Project_mini",Project_miniSchema);