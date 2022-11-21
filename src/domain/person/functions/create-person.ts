import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

import { DynamoDB } from 'aws-sdk';
import { Environments, LocalStackConfig } from '../../../../lib/person-service-stack.enum';
import { HttpResponseCodes } from '../constants/person.enums';
import { Person } from '../models/person.model';
import { PersonService } from '../services/person.services';

const TABLE_NAME: string = process.env.TABLE_NAME ?? '';
const AWS_HOST: string = process.env.AWS_HOST ?? '';

let dynamoClient = new DynamoDB.DocumentClient({
    endpoint: LocalStackConfig.endpoint,
});

if (AWS_HOST === Environments.production) {
    dynamoClient = new DynamoDB.DocumentClient();
}

export const createPersonHandler: Handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    let body = '';
    let statusCode = HttpResponseCodes.ok;
    if (!event.body) {
        body = JSON.stringify('no person data given');
        statusCode = HttpResponseCodes.badRequest;
        return PersonService.handlerResponse(body, statusCode);
    }

    const requestJSON: Person = JSON.parse(event.body);

    if (!requestJSON.phoneNumber) {
        body = JSON.stringify('phone number is required');
        statusCode = HttpResponseCodes.badRequest;
        return PersonService.handlerResponse(body, statusCode);
    }

    try {
        await PersonService.putPerson(requestJSON, TABLE_NAME, dynamoClient);
        statusCode = HttpResponseCodes.ok;
        body = JSON.stringify(`person created with phone number: ${requestJSON.phoneNumber}`);
        return PersonService.handlerResponse(body, statusCode);
    } catch (e) {
        statusCode = 400;
        body = `Update failed: ${e}`;
        return PersonService.handlerResponse(body, statusCode);
    }
};
