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

export default indexesOf;
