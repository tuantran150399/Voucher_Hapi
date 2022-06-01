import * as Hapi from "@hapi/hapi";





//interface joi
export interface EventRequestInterface extends Hapi.Request {
    payload: {
        name: string,
        startTime: Date,
        endTime: Date,
        maxQuantityVoucher: number
    };
}

export interface UserRequestInterface extends Hapi.Request {
    payload: {
        username: string,
        password: string,
        email: string
    };
}
