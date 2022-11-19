import { APIGatewayEvent, Handler } from 'aws-lambda';

import { DynamoDB, config } from 'aws-sdk';
import { HttpResponseCodes } from '../constants/person.constants';
import { PersonModel } from '../models/person.model';

const dynamo = new DynamoDB.DocumentClient({
    endpoint: `http://localstack:4566`,
});
const TABLE_NAME = 'Person';

config.update({
    region: 'eu-west-1',
});

export const createPersonHandler: Handler = async (event: APIGatewayEvent) => {
    if (!event.body) {
        return {
            body: JSON.stringify('no person data given'),
            statusCode: HttpResponseCodes[200],
        };
    }

    const requestJSON: PersonModel = JSON.parse(event.body);

    if (!requestJSON.phoneNumber) {
        return {
            body: JSON.stringify('phone number is requred'),
            statusCode: HttpResponseCodes[200],
        };
    }

    const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: TABLE_NAME,
        Item: {
            phoneNumber: requestJSON.phoneNumber ?? null,
            firstName: requestJSON.firstName ?? '',
            lastName: requestJSON.lastName ?? '',
            address: requestJSON.address ?? '',
        },
    };

    try {
        const review = await dynamo.put(params).promise();
        console.log(`Update complete. ${JSON.stringify(review)}`);
        return {
            statusCode: 200,
            headers: {},
            body: JSON.stringify(review),
        };
    } catch (e) {
        console.error('GET failed! ', e);
        return {
            statusCode: 400,
            headers: {},
            body: `Update failed: ${e}`,
        };
    }
};
