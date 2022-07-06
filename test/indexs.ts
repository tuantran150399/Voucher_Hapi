import { expect, fail } from 'code';
import { script } from 'lab';

import {init} from "../src/index";
import { Server, ServerAuthSchemeObject } from "@hapi/hapi";


const { afterEach, beforeEach, describe, it } = exports.lab = script();

describe('GET /', () => {
    let server: Server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it('responds with 200', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/'
        });
        expect(res.statusCode).to.equal(200);
    });
});