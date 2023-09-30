import express, { Request, Response, NextFunction } from 'express';
import { CreateVendor, GetVendors, GetVendorsById } from '../controllers';

const router = express.Router();

router.post("/vendor", CreateVendor)
router.get("/vendor/list", GetVendors)
router.get("/vendor/:id", GetVendorsById)

router.get("/", (req: Request, res: Response, next: NextFunction) => { 
    return res.json("Hello Admin") 
});

export{ router as AdminRoute };