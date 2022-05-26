import * as Hapi from '@hapi/hapi';
import { Server ,Request, ResponseToolkit } from '@hapi/hapi';
import {run} from './mongoDB/mongoconnect';
run();
async function init() {
    const server: Server = new Server({
        port: 3000,
        host: 'localhost'
    });



      
    function index(req: Request,res: ResponseToolkit): string {
        console.log("Processing request", req.info.id);
        return "done"
    }
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            index
            return 'Hello World!';
        }
    });

    try {
        await server.start();
        console.log(`Listening on ${server.settings.host}:${server.settings.port}`);
    } catch(err) {
        console.log(err);
    }
    process.on('unhandledRejection', (err) => {
        console.error("unhandledRejection");
        console.error(err);
        process.exit(1);
    });

}
init()