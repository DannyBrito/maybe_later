const {DataTypes} = require('sequelize');

const sequelize = require('../../util/database');

const bcrypt = require('bcrypt')

const User = sequelize.define('User', 
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        },
        username:{
            type: DataTypes.STRING,
            allowNull:false,
            unique: {
                msg:'Username is already taken'
            },
            validate:{
                notNull:{
                    msg:'Please enter an username'
                },
                notEmpty:{
                    msg:'Username can\'t be empty'
                },
            }
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notNull:{
                    msg:'Please enter your first name'
                },
                notEmpty:{
                    msg:'First name required!'
                },
            }

        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notNull:{
                    msg:'Please enter your last name'
                },
                notEmpty:{
                    msg:'Last name required!'
                },
            }
        },
        password:{
            type: DataTypes.STRING,
            allowNull:false,
            validate:{
                notNull:{
                    msg:'Please enter an password'
                },
                notEmpty:{
                    msg:'Password required!'
                },
            }
        }
    },
    {
        hooks:{
            beforeCreate: async (user) =>{
            user.password = await bcrypt.hash(user.password, 1 * process.env.SALT_ROUNDS)
            }
        },

        defaultScope: {
            attributes: { exclude: ['password'] }
        },
        scopes: {
            withPassword: {
                attributes: {}
            }
        }
    }
);


User.deleteAll = function(){
    return this.destroy({force:true, where:{},truncate:true})
}

User.prototype.authenticate = async function(password){
    return bcrypt.compare(password, this.password)
}

User.prototype.toJSON = function(){
    const obj = {...this.get()}
    delete obj.password
    return obj
}

module.exports = User;