/**
 * Vellum Predict API
 * Documentation of API endpoints used to make predictions through Vellum
 *
 * The version of the OpenAPI document: 1.0.0 (v1)
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { RequestFile } from './models';
import { GenerateOptions } from './generateOptions';
import { GenerateRequest } from './generateRequest';

export class GenerateRequestBody {
    'deploymentId'?: string | null;
    'deploymentName'?: string | null;
    'requests': Array<GenerateRequest>;
    'options'?: GenerateOptions | null;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "deploymentId",
            "baseName": "deployment_id",
            "type": "string"
        },
        {
            "name": "deploymentName",
            "baseName": "deployment_name",
            "type": "string"
        },
        {
            "name": "requests",
            "baseName": "requests",
            "type": "Array<GenerateRequest>"
        },
        {
            "name": "options",
            "baseName": "options",
            "type": "GenerateOptions"
        }    ];

    static getAttributeTypeMap() {
        return GenerateRequestBody.attributeTypeMap;
    }
}

