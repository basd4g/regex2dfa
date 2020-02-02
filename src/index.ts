import regExpString2NFA from "./regExpString2NFA";

const validateParenthesis = (inputStr:string):boolean => {
  let depth:number = 0;
  
  for( let c of inputStr ){
    if( c === '(' ){
      depth++;
    }else if( c === ')' ){
      depth--;
    }
    if( depth < 0 ){
      return false;
    }
  }
  return depth === 0;
};

const input:string = process.argv[2];
if( typeof input !== 'string' || input.length === 0 ){
  process.exit(0);
}

if( !validateParenthesis( input ) ){
  process.exit(0);
}

const regexNFA = regExpString2NFA(input);
console.log(regexNFA.graphvizString);


