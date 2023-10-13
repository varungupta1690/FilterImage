import express from "express";
import {filterImageFromURL} from "../util/util.js"

export const router = express.Router();

router.get( "/filteredimage/", async ( req, res ) => {
    console.log('Get list of tweets')
    console.log(req.query.image_url)
    let { image_url } = req.query.image_url;    
    res.status(200).send(filterImageFromURL(image_url));

  } );
  