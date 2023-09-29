import * as addon from "../";

if (addon.<%= moduleClassName %> === undefined){
  throw new Error("The expected class is undefined");
}

const instance = new addon.<%= moduleClassName %>("Greeter");

if (instance.greet === undefined){
  throw new Error("The expected method is undefined");
}

const result = instance.greet("Greetee");

if (result !== "Greeter"){
  throw new Error("Unexpected value returned");
}

// tslint:disable-next-line:no-console
console.log("Tests passed- everything looks OK!");
