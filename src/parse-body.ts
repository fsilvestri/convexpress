import {json} from "body-parser";
import {RequestHandler} from "express";
// import {hasBody} from "type-is";

export default function parseBody () :RequestHandler {
    const jsonMiddleware = json();
    return (req, res, next) => {

        const reqHasBody = true;
        const reqBodyIsEmpty = (parseInt(req.headers["content-length"]) === 0);

        /*
        *   If the request doesn't have a body or the body is empty, go on
        *   without setting `req.body`.
        */
        if (!reqHasBody || reqBodyIsEmpty) {
            return next();
        }

        /*
        *   Here the request has a non-empty body. If it's not json, send a 415
        *   error.
        */
        if (!req.is("json")) {
            return res.status(415).send({
                message: "Body must have Content-Type application/json"
            });
        }

        /*
        *   Here the request has a non-empty, json-encoded body. We delegate its
        *   handling to the body-parser's `json` middleware. (If the body turns
        *   out to be incorrectly encoded - e.g. not a valid json string - the
        *   middleware will take care of sending an error back to the client)
        */
        jsonMiddleware(req, res, next);

    };
}
