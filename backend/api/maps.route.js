import express from "express"
import MapsController from "./maps.controller.js"

const router = express.Router()

router.route("/").get(MapsController.apiGetMaps);

export default router