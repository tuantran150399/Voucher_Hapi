'use strict'
const Code = require("@hapi/code");
const Lab = require("@hapi/lab");
const { expect } = Code;
const { it, describe, afterEach, beforeEach } = (exports.lab = Lab.script());
const { init } = require("../src/server");
const HTTP_PORT = 3000;
const HTTP_STATUS_OK = 200;

describe("General Server Tests", () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it("Starts successfully", async () => {
        expect(server.type).to.equal("tcp");
        expect(server.settings.port).to.equal(HTTP_PORT);
        expect(server.settings.host).to.equal("localhost");
    });

    it("Responds to GET requests", async () => {
        const res = await server.inject({
            method: "GET",
            url: "/"
        });
        //console.log(res.result)
        expect(res.result).to.equal('Hello World!');
        expect(res.statusCode).to.equal(HTTP_STATUS_OK);
    });
    it("Responds to access user router", async () => {
        const res = await server.inject({
            method: "GET",
            url: "/users"
        });
        expect(res.statusCode).to.equal(HTTP_STATUS_OK);
    });
    it("Responds to access event router", async () => {
        const res = await server.inject({
            method: "GET",
            url: "/events"
        });
        expect(res.result).to.be.instanceof(Array);
        expect(res.statusCode).to.equal(HTTP_STATUS_OK);
    });
    it("Responds to access 1 choosen user", async () => {
        const res = await server.inject({
            method: "GET",
            url: "/user/62a6eb6653e1608f1a11393d"
        });

        expect(res.statusCode).to.equal(HTTP_STATUS_OK);
        expect(res.result).to.be.an.object();
        expect(res.result.email).to.equal('anhtuan150399@gmail.com');
    });
    it("Responds to access 1 choosen event", async () => {
        const res = await server.inject({
            method: "GET",
            url: "/event/62a6eb8953e1608f1a113941"
        });
        expect(res.statusCode).to.equal(HTTP_STATUS_OK);
        expect(res.result).to.be.an.object();

        expect(res.result.name).to.equal('BirthDay');
    });
    it("Testing with an invalid user", async () => {
        const res = await server.inject({
            method: "GET",
            url: "/user/62a6eb8953e1608f1a113944"
        });
        expect(res.statusCode).to.equal(500);
        // expect(res.result.error).to.equal("Internal Server Error");
    });
    it("Testing with an invalid page", async () => {
        const res = await server.inject({
            method: "GET",
            url: "/fall/"
        });
        expect(res.statusCode).to.equal(404);
    });
});

describe("General Server Tests", () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it("Starts successfully", async () => {
        expect(server.type).to.equal("tcp");
        expect(server.settings.port).to.equal(HTTP_PORT);
        expect(server.settings.host).to.equal("localhost");
    });



    it("TEST USER ROUTE", async () => {
        const userss = {
            username: "anhtuan1233",
            password: "anhtuan1232",
            email: "anhtuan1232@gmail.com"
        }
        let add_options = {
            method: "POST",
            url: "/user",
            payload: userss
        };

        
        const res = await server.inject(add_options);
        var resid = res.result._id.toString()
        expect(res.statusCode).to.equal(HTTP_STATUS_OK);
        expect(res.result.username).to.equal(add_options.payload.username);
        const resRead = await server.inject({
            method: "GET",
            url: "/user/"+resid
        });

        expect(resRead.statusCode).to.equal(HTTP_STATUS_OK);
        expect(resRead.result).to.be.an.object();
        expect(resRead.result.email).to.equal('anhtuan1232@gmail.com');
        const users = {
            username: "anhtuan1233333",
            password: "anhtuan1233333",
            email: "anhtuan1233333@gmail.com"
        }
        let edit_options = {
            method: "PUT",
            url: "/user/"+resid,
            payload:users
        };

        
        const resEdit = await server.inject(edit_options);
        expect(resEdit.statusCode).to.equal(HTTP_STATUS_OK);
        expect(resEdit.result.username).to.equal(edit_options.payload.username);


        let dell_options ={
            method: "DELETE",
            url: '/user/'+resid,
        }
        const resDell = await server.inject(dell_options);
        expect(resDell.statusCode).to.equal(HTTP_STATUS_OK);
    });
});