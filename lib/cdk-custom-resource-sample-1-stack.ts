import * as cdk from 'aws-cdk-lib';
import {CustomResource} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam'; // Import the missing 'iam' module
import {Provider} from 'aws-cdk-lib/custom-resources';
import {RetentionDays} from 'aws-cdk-lib/aws-logs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import path = require('path');
import * as fs from "node:fs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
const COLLECTION_ID = "demo_rekognition_collection";

export interface MyCustomResourceProps {
  /**
   * Message to echo
   */
  Message: string;
}

export class CdkCustomResourceSample1Stack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const rekognitionCustomResourceRole = new iam.Role(this, 'rekognitionCustomResourceRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });

        rekognitionCustomResourceRole.addToPolicy(new iam.PolicyStatement({
            resources: ['arn:aws:rekognition:*'],
            actions: ['rekognition:CreateCollection', 'rekognition:DeleteCollection']
        }))

        const onEvent = this.customResourceUsingJavaScript(rekognitionCustomResourceRole);
        // const onEvent = this.customResourceUsingPython(rekognitionCustomResourceRole);

        const rekognitionCustomResourceProvider = new Provider(this, "rekognitionCustomResourceProvider", {
            // onEventHandler: onEventHandlerFunction,
            onEventHandler: onEvent,
            // logRetention: RetentionDays.ONE_DAY
        });

        const resource = new CustomResource(this, 'rekognitionCustomResource', {
            serviceToken: rekognitionCustomResourceProvider.serviceToken,
            // resourceType: 'Custom::MohanRekognitionCollection',
            properties: {
                Message: 'Hello from Sample1 CDK!',
            }

        });

        // const response = resource.getAtt('Response').toString();

        // new cdk.CfnOutput(this, 'ResponseMessage', {
        //     description: 'The message that came back from the Custom Resource',
        //     value: response
        // });

    }

    private customResourceUsingJavaScript(rekognitionCustomResourceRole: iam.Role) {

        // const onEventHandlerFunction = new NodejsFunction(this, "rekognitionCustomResourceFunction", {
        //   // entry: "./lambda/rekognition-resource-handler.ts",
        //   entry: path.join(__dirname, "lambda/rekognition-custom-resource-ts.ts"),
        //   runtime: lambda.Runtime.NODEJS_20_X,
        //   handler: "onEventHandler123",
        //   environment: {
        //     COLLECTION_ID: COLLECTION_ID
        //   },
        //   role: rekognitionCustomResourceRole
        // });

        return new lambda.Function(this, 'rekognitionCustomResourceFunction', {
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'rekognition-custom-resource-js.handler',
            code: lambda.Code.fromAsset(path.resolve(__dirname, 'lambda/js')),
            environment: {
                COLLECTION_ID: COLLECTION_ID
            },
            role: rekognitionCustomResourceRole
        });

        
    }

// private static createLogGroup(
    //   scope: Construct,
    //   myFunctiontwo: lambda.Function
    // ) {
    //   new logs.LogGroup(scope, 'LogGroup', {
    //     logGroupName: `/aws/lambda/${myFunctiontwo.functionName}`,
    //     retention: logs.RetentionDays.ONE_DAY,
    //     removalPolicy: cdk.RemovalPolicy.DESTROY
    //   });
    // }
    private customResourceUsingPython(rekognitionCustomResourceRole: iam.Role) {

        // let readFileSync = fs.readFileSync('/Users/mohanraj.nagasamy/src/wrk/core/play-ground/cdk/cdk-custom-resource-sample-1/lib/rekognition-custom-resource-py.py', { encoding: 'utf-8' });
        // console.log('readFileSync', readFileSync)
        // let inlineCode = new lambda.InlineCode(path.resolve('/Users/mohanraj.nagasamy/src/wrk/core/play-ground/cdk/cdk-custom-resource-sample-1/lib/lambda/rekognition-custom-resource-py.py'));
        let inlineCode = new lambda.InlineCode(fs.readFileSync('/Users/mohanraj.nagasamy/src/wrk/core/play-ground/cdk/cdk-custom-resource-sample-1/lib/lambda/rekognition-custom-resource-py.py', { encoding: 'utf-8' }))
        console.log('inlineCode', inlineCode)

        return new lambda.SingletonFunction(this, 'Singleton', {
            uuid: 'B861DAFF-F17E-4DBA-BE63-9B66E76CC2E0',
            // code: lambda.Code.fromAsset(path.resolve(__filename, 'lambda/rekognition-custom-resource-py.py')),
            code: inlineCode,
            handler: 'index.on_event',
            timeout: cdk.Duration.seconds(300),
            runtime: lambda.Runtime.PYTHON_3_9,
            // role: rekognitionCustomResourceRole
        });
    }
}
