export * from './generateApi';
import { GenerateApi } from './generateApi';
export * from './searchApi';
import { SearchApi } from './searchApi';
export * from './submitCompletionActualsApi';
import { SubmitCompletionActualsApi } from './submitCompletionActualsApi';
import * as http from 'http';

export class HttpError extends Error {
    constructor (public response: http.IncomingMessage, public body: any, public statusCode?: number) {
        super('HTTP request failed');
        this.name = 'HttpError';
    }
}

export { RequestFile } from '../model/models';

export const APIS = [GenerateApi, SearchApi, SubmitCompletionActualsApi];
