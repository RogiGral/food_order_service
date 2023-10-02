import express,  { Request, Response, NextFunction } from "express";
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateCustomerInput, CustomerLoginInput } from "../dto";
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, onRequestOTP } from "../utility";
import { Customer } from "../models";

export const CustomerSignUp = async (req: Request,res: Response, next: NextFunction) => {
    
    const customerInputs = plainToClass(CreateCustomerInput, req.body);

    const validationError = await validate(customerInputs, {validationError: { target: true}})

    if(validationError.length > 0){
        return res.status(400).json(validationError);
    }

    const { email, phone, password } = customerInputs;

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const {otp,expiry} = await GenerateOtp();

    const existingCustomer =  await Customer.find({ email: email});

    if(existingCustomer.length > 0){
        return res.status(400).json({message: "Email already exists."})
    }

    const result = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0,

    })

    if(!result){
        return res.status(400).json({message: "Error while creating user."})
    }

    await onRequestOTP(otp, phone);


    const signature = await GenerateSignature({
        _id: result._id,
        email: result.email,
        verified: result.verified
    });

    return res.status(201).json({signature: signature, verified: result.verified, email: result.email});
}

export const CustomerLogin = async (req: Request,res: Response, next: NextFunction) => {

    const loginInputs = plainToClass(CustomerLoginInput, req.body);
    
    return res.status(200).json({message: "Login successful."})
}


export const CustomerVerify = async (req: Request,res: Response, next: NextFunction) => {

    const { otp } = req.body;
    const customer = req.user;

    if(!customer){
        return res.status(500).json({message: "Internal server error."})
    }

    const profile = await Customer.findById(customer._id);

    if(!profile){
        return res.status(400).json({message: "Customer not found."})
    }

    if(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()){
        profile.verified = true;

        const updatedProfile = await profile.save();

        const signature = await GenerateSignature({
            _id: updatedProfile._id,
            email: updatedProfile.email,
            verified: updatedProfile.verified
        });

        return res.status(200).json({signature: signature, verified: updatedProfile.verified, email: updatedProfile.email});
    }

    return res.status(400).json({message: "Error with OTP validation."})

}


export const RequestOtp = async (req: Request,res: Response, next: NextFunction) => {


}


export const GetCustomerProfile = async (req: Request,res: Response, next: NextFunction) => {


}


export const EditCustomerProfile = async (req: Request,res: Response, next: NextFunction) => {


}
