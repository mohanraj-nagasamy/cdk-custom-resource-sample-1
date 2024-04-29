import logging as log
log.getLogger().setLevel(log.INFO)

def on_event(event, context):
    log.getLogger().setLevel(log.INFO)

    log.info("on_event : ", event)
    print(event)
    request_type = event['RequestType']
    if request_type == 'Create': return on_create(event)
    if request_type == 'Update': return on_update(event)
    if request_type == 'Delete': return on_delete(event)
    raise Exception("Invalid request type: %s" % request_type)


def on_create(event):
    log.info("on_create : ", event)
    props = event["ResourceProperties"]
    log.info("create new resource with props %s" % props)

    message = event['ResourceProperties']['Message']

    attributes = {
        'Response': 'You said "%s"' % message
    }
    return {'Data': attributes}


def on_update(event):
    log.info("on_update : ", event)
    physical_id = event["PhysicalResourceId"]
    props = event["ResourceProperties"]
    log.info("update resource %s with props %s" % (physical_id, props))
    # ...

    return {'PhysicalResourceId': physical_id}


def on_delete(event):
    log.info("on_delete : ", event)
    physical_id = event["PhysicalResourceId"]
    log.info("delete resource %s" % physical_id)
    # ...

    return {'PhysicalResourceId': physical_id}


def is_complete(event, context):
    log.info("is_complete : ", event)
    physical_id = event["PhysicalResourceId"]
    request_type = event["RequestType"]

    # check if resource is stable based on request_type
    # is_ready = ...

    return {'IsComplete': True}
