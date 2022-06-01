import Boom from '@hapi/boom';

export const handleError = (error: unknown) => {
    if (typeof error === "string"){
        return Boom.badImplementation(error.toUpperCase());
    }else if(error instanceof Error) {
        return Boom.badImplementation(error.message);
    }else{
        return Boom.notImplemented('method not implemented');
    }
  };




  
//   export const handleError = (error: unknown) => {
//     if (typeof error === "string"){
//         return Boom.badImplementation(error.toUpperCase());
//     }else if(error instanceof Error) {
//         return Boom.badImplementation(error.message);
//     }else{
//         return Boom.notImplemented('method not implemented');
//     }
//   };
