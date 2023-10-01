import express, { Request, Response, NextFunction } from 'express';
import { GetFoodAvability, GetFoodInTime, GetRestaurantById, GetTopRestaurants, SearchFoods } from '../controllers';

const router = express.Router();


router.get("/:pinCode",GetFoodAvability)

router.get("/top-restaurants/:pinCode",GetTopRestaurants)

router.get("/foods-in-time/:time/:pinCode",GetFoodInTime)

router.get("/search/:pinCode",SearchFoods)

router.get("/restaurant/:id",GetRestaurantById)


export {router as ShoppingRoute}