import { Person } from '../models/person.model';
import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyResult } from 'aws-lambda';

const handlerResponse = (body: string, statusCode: number): APIGatewayProxyResult => {
    return {
        statusCode,
        body,
    };
};

const putPerson = async (personToPut: Person, tableName: string, dynamoClient: DynamoDB.DocumentClient) => {
    const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: tableName,
        Item: {
            phoneNumber: personToPut.phoneNumber ?? null,
            firstName: personToPut.firstName ?? '',
            lastName: personToPut.lastName ?? '',
            address: personToPut.address ?? '',
        },
    };
    await dynamoClient.put(params).promise();
};

export const PersonService = {
    handlerResponse,
    putPerson,
};
