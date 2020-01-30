import regExpString2NFA from "./regExpString2NFA";
import Graph from "./graph";

const input:string = process.argv[2];
if( typeof input !== 'string' || input.length === 0 ){
  process.exit(0);
}


const NFA = regExpString2NFA(input);

console.log(NFA.graphvizString);
