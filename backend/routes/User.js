const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
//const bcrypt = require('bcrypt');
require('dotenv').config();
//check the info is valid


/*focus on these after getting the regular functionality up to date
const algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
const key = 'password';
function encryptStr(toEncr) {

}

function decryptStr(toDecr) {

}
*/

//routes
//Preconditions: all post details MUST be provided
router.post("/create", async (req, res) => {
  if(req.body.Username === undefined || req.body.password === undefined) {
    res.status(404)
    res.json({message: "no username or password passed"})
  } else reqWrapper( async () => global.dbHelper.createUser(crypto.randomBytes(16).toString("hex").slice(0,10), req.body.Username, req.body.password), res);
})

router.post('/login', async (req, res) => {
  if(req.body.Username === undefined || req.body.password === undefined) {
    res.status(404)
    res.json({message: "no username or password passed"})
  } else {    //wait for sql query to resolve and return
    try { 
      //verify login information exists in db and get result
      const dbResult = await global.dbHelper.checkUser(req.body.Username, req.body.password);
      //handle error
      if(!dbResult) {
        res.status(404)
        res.json("Incorrect login information")
      //create a new jwt token and pass it back to the user
      } else {  
        const accessToken = jwt.sign({name:req.body.Username}, global.secret)
        res.status(200)
        res.json({accessToken: accessToken})
      }
    } catch(error) { //catch any sort of errors or rejects
      console.log(error.message);
      res.status(404)
      res.json(error.message)
    }
  }
})

router.post('/validateLoginToken',  async (req, res) => {
  if(req.body.token === undefined) {
    res.status(404)
    res.json({message: "no session token passed, unable to autologin"})
  } else {
    const token = req.body.token;

  }
})


async function reqWrapper(command, res,  errorResponse={status:404, message: "Resource not found"}){
  try{
    //wait for sql query to resolve and return
    const dbResult = await command()
    res.json(dbResult)
  } catch(error) { //catch any sort of errors
    res.status(404)
    res.json(error.message)
  }
}

module.exports = router;