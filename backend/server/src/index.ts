import express, { NextFunction } from "express";
import cors from "cors";

import bcrypt from "bcrypt";
import validator  from "validator";
import jwt from "jsonwebtoken";

import { Prisma, PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

const createToken = (id: String, username: String) => {
    const payload = {
        id,
        username
    }
    return jwt.sign(payload, process.env.SECRET, {expiresIn: '3d'})
}


const app = express();

app.use(express.json());
app.use(cors());


//login route
app.post('/user/login',async (req,res)=>{

    try {
        const {username, password} = req.body

        if(!username || !password) {
            throw Error('all fields must be filled')
        }

    
        const user = await prisma.user.findUnique({
            where: {
                name: username,
            }
        })
        if(!user) {
            throw Error('Incorrect username')
        }

        const match = await bcrypt.compare(password, user.password)

        if(!match) {
            throw Error('incorrect password')
        }

        const token = createToken(user.id, user.name)

        res.status(200).json({userid: user.id, username, money: user.money, token})


    } catch (error) {
        res.status(401).json({error: error.message})
    }



})

//signup route
app.post('/user/signup', async (req,res)=>{

    const {username,email,password,pokemonId} = req.body

    try {

        if(!email || !password || !username || !pokemonId) {
            throw Error('all fields must be filled')
        }

        if(!validator.isEmail(email)) {
            throw Error('invalid email')
        }

        if(!validator.isStrongPassword(password)) {
            throw Error('weak password')
        }

    

        const email_exists = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if(email_exists) {
            throw Error('email already in use')
        }

        const username_exists = await prisma.user.findUnique({
            where: {
                name: username
            }
        })
        if(username_exists) {
            throw Error('username already in use');
        }
        
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const user = await prisma.user.create({
            data: {
                name: username,
                email: email,
                password: hash,
                pokemons: {
                    connect: [{id: pokemonId}]
                }
            }
        })

        const token = createToken(user.id, user.name)
        res.status(200).json({
            userid: user.id,
            username,
            money: user.money,
            token
        })
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})


//auth check
interface UserPayload {
    id: string;
    username: string;
}

const requireAuth = async (req: any ,res: any,next: NextFunction) => {

    const {authorization} = req.headers

    if(!authorization) {
        return res.status(401).json({error: 'authorization token required'})
    }

    const token = authorization.split(' ')[1]

    try {
        const {id, username} = jwt.verify(token,process.env.SECRET) as UserPayload;


        req.user = await prisma.user.findUnique({
            where: {
                name: username
            }
        })
        next()
    } catch (error) {
        res.status(401).json({error: 'request is not authorized'})
    }

}

app.use(requireAuth);

//get all pokemon
app.get('/api/pokemons', async (req,res)=>{
    
    try {

        const pokemons = await prisma.pokemon.findMany({
            include: {
                moves: true
            }
        }
        );
        res.status(200).json({pokemons})
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "could not fetch all pokemon data"
        })
    }


})

//get user pokemon only
app.get('/api/pokemons/:username', async (req,res)=>{

    const {username} = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: {
                name: username
            },
            include: {
                pokemons: {
                    include: {
                        moves: true
                    }
                }
            }
        })
        res.status(200).json({
            userpokemons: user.pokemons
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "coult not fetch user's pokemon"
        })
    }
})

//get user money 
app.get('/api/money/:username', async(req,res)=>{
    const {username} = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                name: username
            }
        })
        res.status(200).json({
            money: user.money
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "could not get user's money"
        })
    }
})


//update user money
app.patch('/api/money/:username', async (req,res)=>{

    console.log("UPDATE MONEY REQ RECEIVED");
    const {username} = req.params
    const { money} = req.body;
    console.log("USERNAME: ",username);
    console.log("MONEY: ",money);
    try {

        const user = await prisma.user.update({
            where: {
                name: username
            },
            data: {
                money: {
                    increment: money
                }
            }
        })
        res.status(200).json({
            msg: "successfully udpated user's money",
            user
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "could not update user's money"
        })
    }

})


//update user pokemon array
interface Pokemon {
    id: string,
    name: string,
    hp: number,
    cost: number
}

app.patch('/api/addpokemon/:username', async (req,res)=>{

    const {username} = req.params
    const {pokemonId, userid} = req.body

    try {

        const userUpd = await prisma.user.update({
            where: {
                id: userid
            },
            data: {
                pokemons: {
                    connect: {
                        id: pokemonId
                    }
                }
            },
            include: {
                pokemons: true
            }
        })

        res.status(200).json({
            msg: "successfully updated user's pokemons",
            userUpd
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            msg: "failed to update user's pokemons"
        })
    }
    
})



app.listen(process.env.PORT, ()=>{
    console.log("SERVER IS LISTENING");
})
