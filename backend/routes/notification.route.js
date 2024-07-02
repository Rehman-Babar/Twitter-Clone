import express from 'express'
import {protectRoutes} from '../middleware/protectRoutes.js'
import { DeleteNotification, GetNotification } from '../controller/notification.controller.js'
const router = express.Router()

router.get("/", protectRoutes, GetNotification)
router.delete("/", protectRoutes, DeleteNotification)

export default router