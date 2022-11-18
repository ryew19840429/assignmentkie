import { Handler } from 'aws-lambda';

import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB.DocumentClient();
const TABLE_NAME = 'Person';

export const getPerson: Handler = async (event) => {
    return {
        body: JSON.stringify([
            { todoId: 1, text: 'walk the dog 🐕' },
            { todoId: 2, text: 'cook dinner 🥗' },
        ]),
        statusCode: 200,
    };
};
