import express,  { Request, Response, NextFunction } from "express";
import { CreateFoodInput, EditVendorInput, VendorLoginInput } from "../dto";
import { FindVendor } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utility";
import { Food } from "../models";


export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {

    const {email, password} = <VendorLoginInput>req.body;

    

    const existingVendor = await FindVendor('', email);


    if(existingVendor === null) {
        return res.status(400).json({message: "Vendor not found"});
    }

    // Validation and give access

    const validation = await ValidatePassword(password, existingVendor.password, existingVendor.salt);

    if(!validation) {
        return res.status(400).json({message: "Invalid password"});
    }

    const signature = GenerateSignature({
        _id: existingVendor.id,
        email: existingVendor.email,
        name: existingVendor.name,
        foodTypes: existingVendor.foodType
    });

    return res.json(signature);



    
}

export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;

    if(!user){
        return res.status(400).json({message: "User information Not Found"});
    }

    const existingVendor = await FindVendor(user._id);
    return res.json(existingVendor);

}

export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {

    const { foodTypes, name, address, phone } = <EditVendorInput>req.body;

    const user = req.user;

    if(!user){
        return res.status(400).json({message: "Vendor information Not Found"});
    }

    const existingVendor = await FindVendor(user._id);
    if(!existingVendor){
        return res.status(400).json({message: "Vendor information Not Found"});
    }

    existingVendor.foodType = foodTypes;
    existingVendor.name = name;
    existingVendor.address = address;
    existingVendor.phone = phone;

    await existingVendor.save();

    return res.json(existingVendor);

}

export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if(!user){
        return res.status(400).json({message: "Vendor information Not Found"});
    }

    const existingVendor = await FindVendor(user._id);

    if(!existingVendor){
        return res.status(400).json({message: "Vendor information Not Found"});
    }

    existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
    const updatedVendor = await existingVendor.save();
    return res.json(updatedVendor);

}

export const UpdateVendorCoverImage = async (req: Request,res: Response, next: NextFunction) => {

    const user = req.user;

    if(user === null ){
        return res.status(400).json({message: "Vendor information Not Found"});
    }

    const vendor = await FindVendor(user._id);

    if(vendor === null){
        return res.status(400).json({message: "Vendor information Not Found"});
    }


    const files = req.files as [Express.Multer.File];
    const images = files.map((file: Express.Multer.File) => file.filename);
    vendor.coverImages.push(...images);
    const saveResult = await vendor.save();
    return res.json(saveResult);

}

export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if(!user){
        return res.status(400).json({message: "Vendor information Not Found"});
    }

    const {name, description, category, foodType, readyTime, price} = <CreateFoodInput>req.body;

    const existingVendor = await FindVendor(user._id);

    if(!existingVendor){
        return res.status(400).json({message: "Vendor information Not Found"});
    }

    console.log(req.files);

    const files = req.files as [Express.Multer.File]

    const images = files.map((file: Express.Multer.File) => file.filename )

    console.log(images);

    const createdFood = await Food.create({
        vendorId: existingVendor.id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        readyTime: readyTime,
        price: price,
        rating: 0,
        images: images,
    });

    existingVendor.foods.push(createdFood);

    console.log(existingVendor);

    const result = await existingVendor.save();

    return res.json(result);

}

export const GetFoods = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if(!user){
        return res.status(400).json({message: "Vendor information Not Found"});
    }

    const food = await Food.find({vendorId: user._id});

    if(food === null) {
        return res.status(400).json({message: "No food found"});
    }

    return res.json(food);

}