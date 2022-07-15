
const Code = require("@hapi/code");
const Lab = require("@hapi/lab");
// import * as Code from '@hapi/code';
// import * as Lab from '@hapi/lab';
const { expect } = Code;
const { it, describe, afterEach, beforeEach } = (exports.lab = Lab.script());
const { init, start } = require("../src/index");
// import {init,start} from '../src/server'

describe("General Server Tests", () =>
{
    let server;

    beforeEach(async () =>
    {
        server = await init();
    });

    afterEach(async () =>
    {
        await server.stop();
    });

    // it("Starts successfully", async () =>
    // {
    //     server = await start();
    //     expect(server.type).to.equal("tcp");
    //     expect(server.settings.host).to.equal("0.0.0.0");
    // });
    it('responds with 200', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/'
        });
        expect(res.statusCode).to.equal(200);
    });
    // it("Responds to GET requests", async () =>
    // {
    //     const res = await server.inject({
    //         method: "GET",
    //         url: "/"
    //     });
    //     expect(res.statusCode).to.equal(HTTP_STATUS_OK);
    // });
});