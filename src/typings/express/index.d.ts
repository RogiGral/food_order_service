import express from 'express';
import { AuthPayload } from '../../dto';

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload
        }
    }
}