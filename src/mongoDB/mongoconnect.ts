import mongoose  from "mongoose";
import { Agenda } from "agenda";

const connectionString = 'mongodb://localhost:27017/VoucherApplication?retryWrites=true&w=majority';
export const  run= async()  =>{
    await mongoose.connect(connectionString, { keepAlive: true, keepAliveInitialDelay: 300000 }).then(()=>
    {
        console.log('Database connected');
    });

    const agenda = new Agenda({
        db: {address: connectionString, collection: 'Agenda'}});
    agenda.define("check connection", async (job,done) => {
        // mongoose.connection.readyState = 1  or 2 is connected
        if(mongoose.connection.readyState==1 ||mongoose.connection.readyState==2  ){
            console.log('1min -database is working fine');
            done()
        }
        else{
            console.log('dont have connection');
            done()
        }
        });
    await agenda.start();
    await agenda.every("1 minutes", "check connection");    
}
