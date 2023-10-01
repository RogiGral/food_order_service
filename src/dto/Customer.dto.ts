
import { IsEmail, IsEmpty, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCustomerDto {

    @IsEmail()
    email: string;

    @IsEmpty()
    @Length(7,12)
    phone: string;

    @IsEmpty()
    @Length(6,12)
    password: string;
}