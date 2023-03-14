import localVarRequest from 'request';

export * from './document';
export * from './enrichedNormalizedCompletion';
export * from './finishReasonEnum';
export * from './generateErrorResponse';
export * from './generateOptionsRequest';
export * from './generateRequestBodyRequest';
export * from './generateRequestRequest';
export * from './generateResponse';
export * from './generateResult';
export * from './generateResultData';
export * from './generateResultError';
export * from './logprobsEnum';
export * from './normalizedLogProbs';
export * from './normalizedTokenLogProbs';
export * from './searchErrorResponse';
export * from './searchRequestBodyRequest';
export * from './searchRequestOptionsRequest';
export * from './searchResponse';
export * from './searchResult';
export * from './searchWeightsRequest';
export * from './submitCompletionActualRequest';
export * from './submitCompletionActualsErrorResponse';
export * from './submitCompletionActualsRequestRequest';
export * from './uploadDocumentErrorResponse';
export * from './uploadDocumentRequestBodyRequest';
export * from './uploadDocumentResponse';

import * as fs from 'fs';

export interface RequestDetailedFile {
    value: Buffer;
    options?: {
        filename?: string;
        contentType?: string;
    }
}

export type RequestFile = string | Buffer | fs.ReadStream | RequestDetailedFile;


import { Document } from './document';
import { EnrichedNormalizedCompletion } from './enrichedNormalizedCompletion';
import { FinishReasonEnum } from './finishReasonEnum';
import { GenerateErrorResponse } from './generateErrorResponse';
import { GenerateOptionsRequest } from './generateOptionsRequest';
import { GenerateRequestBodyRequest } from './generateRequestBodyRequest';
import { GenerateRequestRequest } from './generateRequestRequest';
import { GenerateResponse } from './generateResponse';
import { GenerateResult } from './generateResult';
import { GenerateResultData } from './generateResultData';
import { GenerateResultError } from './generateResultError';
import { LogprobsEnum } from './logprobsEnum';
import { NormalizedLogProbs } from './normalizedLogProbs';
import { NormalizedTokenLogProbs } from './normalizedTokenLogProbs';
import { SearchErrorResponse } from './searchErrorResponse';
import { SearchRequestBodyRequest } from './searchRequestBodyRequest';
import { SearchRequestOptionsRequest } from './searchRequestOptionsRequest';
import { SearchResponse } from './searchResponse';
import { SearchResult } from './searchResult';
import { SearchWeightsRequest } from './searchWeightsRequest';
import { SubmitCompletionActualRequest } from './submitCompletionActualRequest';
import { SubmitCompletionActualsErrorResponse } from './submitCompletionActualsErrorResponse';
import { SubmitCompletionActualsRequestRequest } from './submitCompletionActualsRequestRequest';
import { UploadDocumentErrorResponse } from './uploadDocumentErrorResponse';
import { UploadDocumentRequestBodyRequest } from './uploadDocumentRequestBodyRequest';
import { UploadDocumentResponse } from './uploadDocumentResponse';

/* tslint:disable:no-unused-variable */
let primitives = [
                    "string",
                    "boolean",
                    "double",
                    "integer",
                    "long",
                    "float",
                    "number",
                    "any"
                 ];

let enumsMap: {[index: string]: any} = {
        "FinishReasonEnum": FinishReasonEnum,
        "LogprobsEnum": LogprobsEnum,
}

let typeMap: {[index: string]: any} = {
    "Document": Document,
    "EnrichedNormalizedCompletion": EnrichedNormalizedCompletion,
    "GenerateErrorResponse": GenerateErrorResponse,
    "GenerateOptionsRequest": GenerateOptionsRequest,
    "GenerateRequestBodyRequest": GenerateRequestBodyRequest,
    "GenerateRequestRequest": GenerateRequestRequest,
    "GenerateResponse": GenerateResponse,
    "GenerateResult": GenerateResult,
    "GenerateResultData": GenerateResultData,
    "GenerateResultError": GenerateResultError,
    "NormalizedLogProbs": NormalizedLogProbs,
    "NormalizedTokenLogProbs": NormalizedTokenLogProbs,
    "SearchErrorResponse": SearchErrorResponse,
    "SearchRequestBodyRequest": SearchRequestBodyRequest,
    "SearchRequestOptionsRequest": SearchRequestOptionsRequest,
    "SearchResponse": SearchResponse,
    "SearchResult": SearchResult,
    "SearchWeightsRequest": SearchWeightsRequest,
    "SubmitCompletionActualRequest": SubmitCompletionActualRequest,
    "SubmitCompletionActualsErrorResponse": SubmitCompletionActualsErrorResponse,
    "SubmitCompletionActualsRequestRequest": SubmitCompletionActualsRequestRequest,
    "UploadDocumentErrorResponse": UploadDocumentErrorResponse,
    "UploadDocumentRequestBodyRequest": UploadDocumentRequestBodyRequest,
    "UploadDocumentResponse": UploadDocumentResponse,
}

export class ObjectSerializer {
    public static findCorrectType(data: any, expectedType: string) {
        if (data == undefined) {
            return expectedType;
        } else if (primitives.indexOf(expectedType.toLowerCase()) !== -1) {
            return expectedType;
        } else if (expectedType === "Date") {
            return expectedType;
        } else {
            if (enumsMap[expectedType]) {
                return expectedType;
            }

            if (!typeMap[expectedType]) {
                return expectedType; // w/e we don't know the type
            }

            // Check the discriminator
            let discriminatorProperty = typeMap[expectedType].discriminator;
            if (discriminatorProperty == null) {
                return expectedType; // the type does not have a discriminator. use it.
            } else {
                if (data[discriminatorProperty]) {
                    var discriminatorType = data[discriminatorProperty];
                    if(typeMap[discriminatorType]){
                        return discriminatorType; // use the type given in the discriminator
                    } else {
                        return expectedType; // discriminator did not map to a type
                    }
                } else {
                    return expectedType; // discriminator was not present (or an empty string)
                }
            }
        }
    }

    public static serialize(data: any, type: string) {
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (type.lastIndexOf("Array<", 0) === 0) { // string.startsWith pre es6
            let subType: string = type.replace("Array<", ""); // Array<Type> => Type>
            subType = subType.substring(0, subType.length - 1); // Type> => Type
            let transformedData: any[] = [];
            for (let index = 0; index < data.length; index++) {
                let datum = data[index];
                transformedData.push(ObjectSerializer.serialize(datum, subType));
            }
            return transformedData;
        } else if (type === "Date") {
            return data.toISOString();
        } else {
            if (enumsMap[type]) {
                return data;
            }
            if (!typeMap[type]) { // in case we dont know the type
                return data;
            }

            // Get the actual type of this object
            type = this.findCorrectType(data, type);

            // get the map for the correct type.
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            let instance: {[index: string]: any} = {};
            for (let index = 0; index < attributeTypes.length; index++) {
                let attributeType = attributeTypes[index];
                instance[attributeType.baseName] = ObjectSerializer.serialize(data[attributeType.name], attributeType.type);
            }
            return instance;
        }
    }

    public static deserialize(data: any, type: string) {
        // polymorphism may change the actual type.
        type = ObjectSerializer.findCorrectType(data, type);
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (type.lastIndexOf("Array<", 0) === 0) { // string.startsWith pre es6
            let subType: string = type.replace("Array<", ""); // Array<Type> => Type>
            subType = subType.substring(0, subType.length - 1); // Type> => Type
            let transformedData: any[] = [];
            for (let index = 0; index < data.length; index++) {
                let datum = data[index];
                transformedData.push(ObjectSerializer.deserialize(datum, subType));
            }
            return transformedData;
        } else if (type === "Date") {
            return new Date(data);
        } else {
            if (enumsMap[type]) {// is Enum
                return data;
            }

            if (!typeMap[type]) { // dont know the type
                return data;
            }
            let instance = new typeMap[type]();
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            for (let index = 0; index < attributeTypes.length; index++) {
                let attributeType = attributeTypes[index];
                instance[attributeType.name] = ObjectSerializer.deserialize(data[attributeType.baseName], attributeType.type);
            }
            return instance;
        }
    }
}

export interface Authentication {
    /**
    * Apply authentication settings to header and query params.
    */
    applyToRequest(requestOptions: localVarRequest.Options): Promise<void> | void;
}

export class HttpBasicAuth implements Authentication {
    public username: string = '';
    public password: string = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        requestOptions.auth = {
            username: this.username, password: this.password
        }
    }
}

export class HttpBearerAuth implements Authentication {
    public accessToken: string | (() => string) = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (requestOptions && requestOptions.headers) {
            const accessToken = typeof this.accessToken === 'function'
                            ? this.accessToken()
                            : this.accessToken;
            requestOptions.headers["Authorization"] = "Bearer " + accessToken;
        }
    }
}

export class ApiKeyAuth implements Authentication {
    public apiKey: string = '';

    constructor(private location: string, private paramName: string) {
    }

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (this.location == "query") {
            (<any>requestOptions.qs)[this.paramName] = this.apiKey;
        } else if (this.location == "header" && requestOptions && requestOptions.headers) {
            requestOptions.headers[this.paramName] = this.apiKey;
        } else if (this.location == 'cookie' && requestOptions && requestOptions.headers) {
            if (requestOptions.headers['Cookie']) {
                requestOptions.headers['Cookie'] += '; ' + this.paramName + '=' + encodeURIComponent(this.apiKey);
            }
            else {
                requestOptions.headers['Cookie'] = this.paramName + '=' + encodeURIComponent(this.apiKey);
            }
        }
    }
}

export class OAuth implements Authentication {
    public accessToken: string = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (requestOptions && requestOptions.headers) {
            requestOptions.headers["Authorization"] = "Bearer " + this.accessToken;
        }
    }
}

export class VoidAuth implements Authentication {
    public username: string = '';
    public password: string = '';

    applyToRequest(_: localVarRequest.Options): void {
        // Do nothing
    }
}

export type Interceptor = (requestOptions: localVarRequest.Options) => (Promise<void> | void);
