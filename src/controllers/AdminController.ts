import express,  { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";


export const FindVendor = async (id: string | undefined, email?: string) => {

    if(email) {
        return await Vendor.findOne({email: email}); 
    } else {
        return await Vendor.findById(id);
    }


}

export const CreateVendor = async (req: Request, res: Response) => {
    const {name, address, pinCode, foodType, email, password, ownerName, phone} = <CreateVendorInput> req.body;


    const existVendor =  await FindVendor('', email);

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
        foods: [],
        raiting: 0,
    });

    return res.json(createdVendor);
}

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    const vendors = await Vendor.find({});

    if(vendors === null) {
        return res.status(400).json({message: "No vendor found"});
    }
    return res.json(vendors);
}

export const GetVendorsById = async (req: Request, res: Response, next: NextFunction) => {
    const vendorId = req.params.id;

    const vendor = await FindVendor(vendorId);

    if(vendor === null) {
        return res.status(400).json({message: "No vendor found"});
    }
    return res.json(vendor);
}