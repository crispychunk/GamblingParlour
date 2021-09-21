
import LocalStrategy from "passport-local"
import Encrypt from "bcrypt"

function init(passport,User) {
    console.log("Initiating!!!")
    const authenticateUser = async (username,password,done) =>{
        //console.log(username)
        var currUser;
        await User.findOne({username : username}).where('userInfo').then((user) => {
            //console.log(user)
            currUser = user
        })
        if (currUser== null) {
            console.log("USER NOT FOUND!!!")
            return done(null, false,{ message : 'No username'})
            
        }
        try {
            console.log("Trying!!")
            //console.log(currUser)
            if (await Encrypt.compare(password,currUser.password)) {
                console.log("Welcome")
                return done(null, currUser)
            } else {
                return done(null,false,{ message : 'Password Incorrect'})
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy.Strategy(authenticateUser))
    // Will change later IMPORTANT!!!!
    passport.serializeUser((currUser,done) => done(null,currUser))
    passport.deserializeUser(function(user,done){
        User.findById(user._id, function(err,user) {
            done(err,user);
        })
    })
}

export default init;