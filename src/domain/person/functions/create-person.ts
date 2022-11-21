import { SNSClient } from '@aws-sdk/client-sns';
import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

import { DynamoDB } from 'aws-sdk';
import { Environments, LocalStackConfig } from '../../../../lib/person-service-stack.enum';
import { HttpResponseCodes } from '../constants/person.enums';
import { Person, PersonEvent } from '../models/person.model';
import { PersonService } from '../services/person.services';

const TABLE_NAME: string = process.env.TABLE_NAME ?? '';
const AWS_HOST: string = process.env.AWS_HOST ?? '';
const TOPIC_ARN: string = process.env.SNS_TOPIC_ARN ?? '';
let snsClient = new SNSClient({
    endpoint: LocalStackConfig.endpoint,
});

let dynamoClient = new DynamoDB.DocumentClient({
    endpoint: LocalStackConfig.endpoint,
});

if (AWS_HOST === Environments.production) {
    dynamoClient = new DynamoDB.DocumentClient();
    snsClient = new SNSClient({});
}

export const createPersonHandler: Handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    let body = '';
    let statusCode = HttpResponseCodes.ok;
    if (!event.body) {
        body = 'no person data given';
        statusCode = HttpResponseCodes.badRequest;
        return PersonService.handlerResponse(body, statusCode);
    }

    const requestJSON: Person = JSON.parse(event.body);

    if (!requestJSON.phoneNumber) {
        body = 'phone number is required';
        statusCode = HttpResponseCodes.badRequest;
        return PersonService.handlerResponse(body, statusCode);
    }

    try {
        const response: PersonEvent = {
            action: 'person created',
            phoneNumber: requestJSON.phoneNumber,
        };

        await PersonService.putPerson(requestJSON, TABLE_NAME, dynamoClient);

        await PersonService.raisePersonCreatedEvent(response, snsClient, TOPIC_ARN);

        body = `person created with phone number: ${requestJSON.phoneNumber}`;

        return PersonService.handlerResponse(body, statusCode);
    } catch (e) {
        statusCode = 400;
        body = `Update failed: ${e}`;
        return PersonService.handlerResponse(body, statusCode);
    }
};
