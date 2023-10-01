import express,  { Request, Response, NextFunction } from "express";
import { FoodDoc, Vendor } from "../models";

export const GetFoodAvability = async (req: Request, res: Response, next: NextFunction) => {

    const pinCode = req.params.pinCode;

    const result = await Vendor.find({pinCode: pinCode, serviceAvailable: false})
    .sort([['rating', 'descending']])
    .populate("foods") 


    if( result.length > 0 ) {
        return res.status(200).json({message: "Available", data: result})
    } 

    return res.status(400).json({message: "Data not found", data: []})
}

export const GetTopRestaurants = async (req: Request, res: Response, next: NextFunction) => {

    const pinCode = req.params.pinCode;

    const result = await Vendor.find({pinCode: pinCode, serviceAvailable: false})
    .sort([['rating', 'descending']])
    .limit(3)

    if( result.length > 0 ) {
        return res.status(200).json({message: "Available.", data: result})
    } 

    return res.status(400).json({message: "Data not found.", data: []})

}

export const GetFoodInTime = async (req: Request, res: Response, next: NextFunction) => {

    const pinCode = req.params.pinCode;
    const time = req.params.time;

    const result = await Vendor.find({pinCode: pinCode, serviceAvailable: false})
    .populate("foods")

    if( result.length > 0 ) {
        let foodResult: any = [];

        result.map((vendor: any) => {
            const foods = vendor.foods as [FoodDoc]
            foodResult.push(...foods.filter(food => food.readyTime <= parseInt(time) ))
        })

        if( foodResult.length === 0 ) {
            return res.status(400).json({message: "There is no food available in "+parseInt(time)+" minutes.", data: []})
        }


        return res.status(200).json({message: "Foods in "+parseInt(time)+" minutes.", data: foodResult})
    } 

    return res.status(400).json({message: "Data not found.", data: []})

}

export const SearchFoods = async (req: Request, res: Response, next: NextFunction) => {

    const pinCode = req.params.pinCode;

    const result = await Vendor.find({pinCode: pinCode, serviceAvailable: false})
    .populate("foods")

    if( result.length > 0 ) {

        let foodResult: any = [];

        result.map( item => foodResult.push(...item.foods) )
   
        return res.status(200).json({message: "Foods available.", data: foodResult})
    } 

    return res.status(400).json({message: "Data not found.", data: []})

}


export const GetRestaurantById = async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id;

    const result = await Vendor.findById(id).populate("foods")

    if( result ) {
        return res.status(200).json({message: "Available.", data: result})
    } 

    return res.status(400).json({message: "Data not found.", data: []})


}