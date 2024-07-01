import { HttpResponse } from "../protocols/protocols";

export const ok = <T>(body: any): HttpResponse<T> => {
    return {
        statusCode: 200,
        body: body,
    };
};

export const created = <T>(body: any): HttpResponse<T> => {
    return {
        statusCode: 201,
        body: body,
    };
};

export const badRequest = <T>(message: any): HttpResponse<T> => {
    return {
        statusCode: 400,
        body: message,
    };
};

export const internalError = <T>(message: any): HttpResponse<T> => {
    return {
        statusCode: 500,
        body: message,
    };
};
