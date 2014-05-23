/**
 *  Deployment descriptor parser.
 *
 *  Author: Huu Da Tran <huuda.tran@quoininc.com>
 *  Since: 2014.05.23
 *  Organization: Quoin Inc.
 */



var _ = require('underscore');



var fs = require('fs');



fs.readFile('dd.json', 'ascii', function(error, data) {
    if (error) {
        console.log("Error reading file: %j", error);
        process.exit(1);
    } else {
        validateDD(JSON.parse(data));
    }
});


function validateDD(json) {
    validateLifecycle(json.lifecycle);
}


/**
 *  Validates the information in life cycle.
 *
 *  http://wiki.cengage.com/display/NG/MindApp+Development+Guide+-+Lifecycle+Notification+API
 */
function validateLifecycle(json) {
    var diff;

    if (json === undefined) {
        return;
    }

    if (json.notification === undefined) {
        throw Error("Missing lifecycle.notification");
    } else if (json.notification.uri === undefined) {
        throw Error("Missing lifecycle.notification.uri");
    } else if (json.notification.subscriptionEvents === undefined) {
        throw Error("Missing lifecycle.notification.subscriptionEvents");
    }

    diff = _.difference(_.keys(json), ['notification']);
    if (diff.length !== 0) {
        throw new Error("Unknown attributes in 'lifecycle': " + diff);
    }

    diff = _.difference(json.notification.subscriptionEvents,
        [
            "APP_ADDED",
            "APP_REMOVED",
            "ACTIVITY_ADDED",
            "ACTIVITY_CHANGED",
            "COURSE_CHANGED",
            "ACTIVITY_REMOVED",
            "WORKING_COPY_COMMIT"
        ]
    );
    if (diff.length !== 0) {
        throw new Error("Unknown value for 'lifecycle.notification.subscriptionEvents': " + diff);
    }
}
