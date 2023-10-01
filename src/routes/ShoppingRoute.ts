import express, { Request, Response, NextFunction } from 'express';
import { GetFoodAvability, GetFoodInTime, GetRestaurantById, GetTopRestaurants, SearchFoods } from '../controllers';

const router = express.Router();


router.get("/:pincode",GetFoodAvability)

router.get("/top-restaurants/:pincode",GetTopRestaurants)

router.get("/foods-in-time/:time/:pincode",GetFoodInTime)

router.get("/search/:pincode",SearchFoods)

router.get("/restaurant/:id",GetRestaurantById)


export {router as ShoppingRoute}