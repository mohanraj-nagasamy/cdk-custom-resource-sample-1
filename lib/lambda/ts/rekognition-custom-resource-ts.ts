console.log('Loading function');

import * as AWS from 'aws-sdk';
import { OnEventRequest, OnEventResponse } from 'aws-cdk-lib/custom-resources/lib/provider-framework/types';

const rekognition = new AWS.Rekognition();

const COLLECTION_ID: string = process.env.COLLECTION_ID ?? 'default_collection_id';

// export onEventHandler without async
export function onEventHandler_works1(event) {
    console.log("onEventHandler:", JSON.stringify(event, null, 2));
}


export const onEventHandler123 = async (event: OnEventRequest): Promise<OnEventResponse> => {
    console.log("mo_onEventHandler:", JSON.stringify(event, null, 2));

    if (event.RequestType === "Create") {
        console.log("mo_onEventHandler creating collection");
        const data = rekognition.createCollection({ CollectionId: COLLECTION_ID });
        console.log("mo_onEventHandler createCollection data:", data);
    } else if (event.RequestType === "Delete") {
        console.log("mo_onEventHandler deleting collection");
        const data = rekognition.deleteCollection({ CollectionId: COLLECTION_ID });
        console.log("mo_onEventHandler deleteCollection data:", data);
    }

    return {
        Status: 'SUCCESS',
        RequestId: event.RequestId,
        StackId: event.StackId,
        LogicalResourceId: event.LogicalResourceId,
        PhysicalResourceId: COLLECTION_ID,
    };
    // return {
    //     PhysicalResourceId: COLLECTION_ID
    // };
}
