import regExpString2NFA from "./regExpString2NFA";
import validate from "./validate";


const input:string = process.argv[2];

if( typeof input !== 'string' || input.length === 0 || !validate(input)){
  process.exit(0);
}

const regexNFA = regExpString2NFA(input);
console.log(regexNFA.graphvizString);

