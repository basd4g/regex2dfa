import Node from "./Node";
import Edge from "./Edge";
import NFA from "./NFA";
import RegexNFA from "./RegexNFA";

const graphCreatorStringInAsterisk = (str:string):RegexNFA => {
  const regexNFA = new RegexNFA();
  let nodeHead = regexNFA.nodeStart;

  const charactors = str.split('');

  charactors.forEach( (c,idx) => {
    if ( c === '*' ) {
      return;
    }
    if ( idx+1 < charactors.length && charactors[idx+1] === '*' ) {
      nodeHead = regexNFA.addCharactorRepeat( nodeHead, c );
      return;
    }
    nodeHead = regexNFA.addCharactor(nodeHead, c );
  });
  regexNFA.finalize( nodeHead );

  return regexNFA;

};

const graphCreatorString = (str:string):RegexNFA => {
  const regexNFA = new RegexNFA();
  const nodeHead = regexNFA.addString(regexNFA.nodeStart, str);
  regexNFA.finalize(nodeHead);
  return regexNFA;
};

export default (regExpString: string):RegexNFA => {
//  return graphCreatorString(regExpString);
  return graphCreatorStringInAsterisk( regExpString );
}
