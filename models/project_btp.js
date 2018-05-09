var mongoose= require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var Project_btpSchema= new mongoose.Schema({
    faculty:String,
    project:String
});

// Project_btpSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("Project_btp",Project_btpSchema);