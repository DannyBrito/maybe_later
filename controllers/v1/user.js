const User = require('../../models/v1/User')

const params = require('../.././/util/strongParams')

const permitParams = ['firstName','lastName','username']

exports.getUser = async (req,res,next) =>{
    
    try{
        const id = req.params.id
        const currentUser = await User.findByPk(id)
        if(currentUser){
            return res.status(302).json(currentUser)
        }
        else {
            return res.status(404).json('User Not Found')
        }
    }
    catch(error){
        return next(error)
    }

}

exports.indexUsers = async (req,res,next) =>{
    try{
        return res.status(302).json(res.paginatedResults)
    }
    catch(error){
        next(error)
    }
}

exports.createUser = async (req, res, next) =>{
    let user = params(req.body,permitParams) 
    try{
        user = await User.create(user)
        return res.status(201).json(user)
    }
    catch(error){
        next(error)
    }
}

exports.updateUser = async (req, res, next) =>{
    try{
        const id = req.params.id
        const newUserInfo = params(req.body,permitParams)
        let currentUser = await User.findByPk(id)
        if(currentUser){
            Object.keys(newUserInfo)
                .forEach(key => currentUser[key] = newUserInfo[key])
            currentUser = await currentUser.save()
            return res.status(202).json(currentUser)
        }
        else{
            return res.status(404).json('User Not Found')
        }
    }
    catch(error){
        return next(error)
    }
}

