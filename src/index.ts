import regExpString2NFA from "./regExpString2NFA";

const validateParenthesis = (str:string):boolean => {
  let depth:number = 0;
  
  for( let c of str ){
    if( c === '(' ){
      depth++;
    }else if( c === ')' ){
      depth--;
    }else if( c === '|' && depth === 0){
      return false
    }

    if( depth < 0 ){
      return false;
    }
  }
  return depth === 0;
};

const indexesOf = (string:string, charactor:string):number[] => {
  const charactors = string.split('')
  const indexesIncludeInvalid = charactors.map( (c,index) => {
    if ( c === charactor ){
      return index;
    } else {
      return -1;
    }
  });

  const indexes = indexesIncludeInvalid.filter( stringIndex => {
    return stringIndex !== -1;
  });
  
  return indexes;
};

const validatePostfixOperator = (str:string, operator:string):boolean => {
  const indexes = indexesOf( str, operator);
  for ( let index of indexes ) {
    if ( index === 0 ) {
      return false;
    } else if ( str[index-1] === "(" ) {
      return false;
    }
  }
  return true;
}

const validateBinaryOperator = (str:string, operator:string):boolean => {
  const indexes = indexesOf( str, operator);
  for ( let index of indexes ) {
    if ( index === 0 ) {
      return false;
    } else if ( str[index-1] === "(" ) {
      return false;
    } else if ( index+1 < str.length && str[index+1] === ")") {
      return false;
    }
  }
  return true;
}

const validateHeadVerticalBar = (str:string):boolean => {
  return validateBinaryOperator(str, "|");
};

const validateHeadAsterisk = (str:string):boolean => {
  return validatePostfixOperator(str, "*");
};

const input:string = process.argv[2];
if( typeof input !== 'string' || input.length === 0 ){
  process.exit(0);
}

if( !validateParenthesis( input )
   || ! validateHeadVerticalBar( input )
   || ! validateHeadAsterisk( input )
){
  process.exit(0);
}

const regexNFA = regExpString2NFA(input);
console.log(regexNFA.graphvizString);

