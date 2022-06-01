import * as Hapi from '@hapi/hapi';
import { Server ,Request, ResponseToolkit } from '@hapi/hapi';
import {run} from './mongoDB/mongoconnect';
import { userRoutes } from './routes/userRoute';
import * as HapiSwagger from 'hapi-swagger';
import Vision from '@hapi/vision';
import Inert from '@hapi/inert';



//../models/Events


run();
async function init() {
    const server: Server = new Server({
        port: 3000,
        host: 'localhost'
    });
    const swaggerOptions: HapiSwagger.RegisterOptions = {
        info: {
            title: 'API Documentation for Voucher-Application',
            version: 'v1.0.0',
            contact: {
                name: 'anh tuan',
                email: 'anhtuan3683242@gmail.com'
              }
        }
    };

    const plugins: Array<Hapi.ServerRegisterPluginObject<any>> = [
        {
            plugin: Inert
        },
        {
            plugin: Vision
        },
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ];


    userRoutes(server);

    await server.register(plugins);  
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