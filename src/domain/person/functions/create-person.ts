import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

import { DynamoDB } from 'aws-sdk';
import { HttpResponseCodes } from '../constants/person.enums';
import { Person } from '../models/person.model';
import { PersonService } from '../services/person.services';

const dynamo = new DynamoDB.DocumentClient({
    endpoint: `http://localstack:4566`,
});
const tableName = 'Person';

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
        body = JSON.stringify('phone number is requred');
        statusCode = HttpResponseCodes.badRequest;
        return PersonService.handlerResponse(body, statusCode);
    }

    try {
        await PersonService.putPerson(requestJSON, tableName, dynamo);
        statusCode = HttpResponseCodes.ok;
        body = JSON.stringify('person created with');
        return PersonService.handlerResponse(body, statusCode);
    } catch (e) {
        statusCode = 400;
        body = `Update failed: ${e}`;
        return PersonService.handlerResponse(body, statusCode);
    }
};
