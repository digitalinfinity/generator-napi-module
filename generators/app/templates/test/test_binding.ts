import * as addon from "../";

if (addon.<%= moduleClassName %> === undefined){
  throw new Error("The expected function is undefined");
}

const result = addon.<%= moduleClassName %>();

if (result !== "world"){
  throw new Error("Unexpected value returned");
}

// tslint:disable-next-line:no-console
console.log("Tests passed- everything looks OK!");
