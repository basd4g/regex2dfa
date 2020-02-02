import indexesOf from "./indexesOf";

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

const validatePostfixOperator = (str:string, operator:string):boolean => {
  const indexes = indexesOf( str, operator);
  for ( let index of indexes ) {
    if ( index === 0 ) {
      return false;
    } else if ( str[index-1] === "(" ) {
      return false;
    } else if ( str[index-1] === "|" ) {
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

const validate = (str:string):boolean => {
  return (
    validateParenthesis( str )
    && validateHeadVerticalBar( str )
    && validateHeadAsterisk( str )
  );
};

export default validate;
