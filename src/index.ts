import regex2NFA from "./regex2NFA";
import validate from "./validate";
import shrinkEpsilon from "./shrinkEpsilon";

const input:string = process.argv[2];

if( typeof input !== 'string' || input.length === 0 || !validate(input)){
  process.exit(0);
}

const regexNFA = regex2NFA( input );
const shrinkedRegexNFA = shrinkEpsilon( regexNFA );

console.log( regexNFA.graphvizString );

