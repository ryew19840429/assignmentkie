#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { PersonServiceStack } from '../lib/person-service-stack';

const app = new cdk.App();
new PersonServiceStack(app, 'PersonServiceStack');
