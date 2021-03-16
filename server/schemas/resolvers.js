const {User,Book}= require('../models');
const {signToken}=require('../utils/auth');
const {AuthenticationError}= require('ap');

const resolvers={
    Query: {
        me: async (parent,args,context){
            if(context.user){
                const userData= await User.findOne({_id:context.user._id})
                .select('-__v -password')
                return userData;
            }
            throw new AuthenticationError(`You haven't loggen in yet!`);
        },
        Mutation:{
            login: async(parent, {email,password})=>{
                const user= await User.findOne({email})
                if(!user){
                    throw new AuthenticationError('Wrong Username');
                }
                const verifyPassword= await user.isCorrectPassword(password);
                if(!verifyPassword){
                    throw new AuthenticationError('Wrong password');
                }
                const token= signToken(user);
                return {token,user}
            }
        },
        saveBook: async (parent,{input},context)=>{
            if(context.user){
                const updateUser=await User.findByIdAndUpdate(
                 {_id: context.user._id},
                 {$addToSet:{savedBooks: input}},
                 {new:true}
                );
                return updateUser;
            }
            throw new AuthenticationError('God! you need to be logged in!');
        },
        removeBook: async (parent,args,context)=>{
            if(context.user){
                const updateUser= await User.findOneAndUpdate(
                {_id:context.user._id},
                {$pull:{savedBooks:{bookId:args.bookId}}},
                {new: true}
                );
                return updateUser;
            }
            throw new AuthenticationError('You have to log in man!')
        }
      
    }
   

}
module.exports=resolvers;