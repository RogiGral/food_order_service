import express,  { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";


export const CreateVendor = async (req: Request, res: Response) => {
    const {name, address, pinCode, foodType, email, password, ownerName, phone} = <CreateVendorInput> req.body;


    const existVendor =  await Vendor.findOne({email: email});

    if(existVendor !== null) {
        return res.status(400).json({message: "Vendor already exist"});
    }

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);


    const createdVendor = await Vendor.create({
        name: name,
        address: address,
        pinCode: pinCode,
        foodType: foodType,
        email: email,
        password: userPassword,
        ownerName: ownerName,
        phone: phone,
        salt: salt,
        serviceAvailable: false,
        coverImages: [],
        raiting: 0
    });

    return res.json(createdVendor);
}

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    
}

export const GetVendorsById = async (req: Request, res: Response, next: NextFunction) => {
    
}