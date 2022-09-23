const { Model, DataTypes} = require('sequelize');
const sequelize = require ('../config/connection');
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {
    //instance method; set up method to run on instance data (per user) to check password
    checkPassword(loginPw){
        return bcrypt.compareSync(loginPw, this.password);
    }
};

//define table columns and configuration
User.init(
    {
        //TABLE COLUMN DEFINITION GO HERE:

        //define an id column
        id: {
            //use the special Sequelize DataTypes object to provide what type of data it is
            type: DataTypes.INTEGER,
            //this is the equivalent of 'NOT NULL' option
            allowNull: false,
            //instruct that this is the Primary Key
            primaryKey: true,
            //turn on auto increment
            autoIncrement: true
        },
        // define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table
            unique: true,
            //if allowNull is set to false we can run our data through validators before creating the table data
            validate: {
                isEmail: true//sequelize has built in validators e.g. for email is checks <string>@<string>.<string>
            }
        },
        //define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //this means the password must be at least four characters long
                len: [4]
            }
        }
    },
    {
        //TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration)
        //hooks
        hooks: {
            //setup beforeCreate lifecycle hook functionality
            async beforeCreate(newUserData){
                newUserData.password = await bcrypt.hash(newUserData.password, 10);//async is a prefix to the function that contains the asynchronous function.await is the prefix for the async funtion.
                return newUserData;
                },
            //setup beforeUpdate lifecycle hook functionality
            async beforeUpdate(updatedUserData){
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
            },
        //pass in our imported sequelize connection (the direct connect to our database)
        sequelize,
        //don't automatically create createAt/updatedAt timestamp fields
        timestamps: false,
        //don't pluralize name of database table
        freezeTableName: true,
        //use underscores instead of camel-caseing (ie. `comment_text` and not `comemntText)
        underscored: true,
        //make it so our model name stays lowercase in the database
        modelName: 'user'
    }
)

module.exports = User;