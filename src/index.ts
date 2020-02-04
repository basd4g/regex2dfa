import regex2NFA from "./regex2NFA";
import validate from "./validate";
import shrinkEpsilon from "./shrinkEpsilon";
import nfa2dfa from "./nfa2dfa";

const input:string = process.argv[2];

if( typeof input !== 'string' || input.length === 0 || !validate(input)){
  process.exit(0);
}

const regexNFA = regex2NFA( input );
shrinkEpsilon( regexNFA );

console.log( "nodes connecting epsilon: Start");
regexNFA.nodes.forEach( node => {

  const nodes = regexNFA.nodesConnectingWithEpsilon(node);
  console.log(nodes.map( n => n.id ));
});
console.log( "nodes connecting epsilon: End");

const dfa = nfa2dfa( regexNFA );

console.log( dfa.graphvizString );

