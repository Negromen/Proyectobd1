const express = require("express");
const { route } = require(".");
const router = express.Router();
const pool = require('../database');
const Query = require("mysql/lib/protocol/sequences/Query");
const { query } = require("express");
/*router.get('/add',(req,res) =>{
    res.send('hello world');
});*/


module.exports = router;