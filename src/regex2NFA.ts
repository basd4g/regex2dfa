import Node from "./Node";
import Edge from "./Edge";
import NFA from "./NFA";
import RegexNFA from "./RegexNFA";

type mixedCell = string | RegexNFA;

const graphCreatorParen = (str:string):RegexNFA => {

  const mixedArray : mixedCell[] = str.split('');
  while(true){
    const indexOfRightParen = mixedArray.indexOf( ')' );

    if ( indexOfRightParen === -1 ){
      break;
    }
  
    const indexOfCorrespondingLeftParen = mixedArray.lastIndexOf( '(', indexOfRightParen );

    const innerParenMixedArray = mixedArray.slice( indexOfCorrespondingLeftParen+1, indexOfRightParen );
    const innerParenGraph = squashMixedArray( innerParenMixedArray );

    if( indexOfRightParen+1 < mixedArray.length && mixedArray[indexOfRightParen+1] === '*' ) {
      const nodeStart = innerParenGraph.nodeStart;
      const nodeFinish = innerParenGraph.bindNodesFinish();
      if ( nodeFinish === undefined ) {
        throw new Error("You forgot finalize");
      }
      innerParenGraph.addEpsilonTransitionEdge(nodeFinish, nodeStart);
    }

    mixedArray.splice(indexOfCorrespondingLeftParen, indexOfRightParen - indexOfCorrespondingLeftParen + 1, innerParenGraph);
  }
  return squashMixedArray( mixedArray );
}

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

const squashMixedArray = (mixedArray:mixedCell[]):RegexNFA => {
  if ( mixedArray.length === 1 && typeof mixedArray[0] !== 'string' ) {
    return mixedArray[0];
  }
  let parallelGraphs: RegexNFA[] = [];

  let partOfMixedArray:mixedCell[]=[];
  for (let mixedCell of mixedArray ) {
    if( mixedCell === '|' ){
      const graph = squashMixedArrayWithoutBar( partOfMixedArray );
      partOfMixedArray = [];
      parallelGraphs.push( graph );
    } else {
      partOfMixedArray.push( mixedCell );
    }
  }
  const graph = squashMixedArrayWithoutBar( partOfMixedArray );
  partOfMixedArray = [];
  parallelGraphs.push( graph );

  return connectGraphsParallel( parallelGraphs );
}

const squashMixedArrayWithoutBar = (mixedArray:mixedCell[]):RegexNFA => {
  if ( mixedArray.length === 1 && typeof mixedArray[0] !== 'string' ) {
    return mixedArray[0];
  }

  let regexNFA = emptyGraph();
  
  let stack:string = "";
  for ( let mixedCell of mixedArray ) {
    if ( typeof mixedCell === 'string' ) {
      stack += mixedCell;
    } else {
      regexNFA = connectGraphs( regexNFA, graphCreatorStringInAsterisk( stack ) );
      stack = "";
      regexNFA = connectGraphs( regexNFA, mixedCell );
    }
  }

  regexNFA = connectGraphs( regexNFA, graphCreatorStringInAsterisk( stack ) );
  return regexNFA
};

const connectGraphsParallel = ( graphs:RegexNFA[] ):RegexNFA => {
  const regexNFA = new RegexNFA();
  let nodeHead = regexNFA.nodeStart;

  nodeHead = regexNFA.addGraphsParallel(nodeHead, graphs);

  regexNFA.finalize(nodeHead);

  return regexNFA;
};

const connectGraphs = ( graphHead:RegexNFA, graphTail:RegexNFA ):RegexNFA => {
  const regexNFA = new RegexNFA();
  let nodeHead = regexNFA.nodeStart;

  nodeHead = regexNFA.addGraph(nodeHead, graphHead);
  nodeHead = regexNFA.addGraph(nodeHead, graphTail);

  regexNFA.finalize(nodeHead);

  return regexNFA;
};

const emptyGraph = ():RegexNFA => {
  const regexNFA = new RegexNFA();
  regexNFA.finalize( regexNFA.nodeStart );
  return regexNFA;
};

const regex2NFA = (regexString: string):RegexNFA => {
  const regexNFA = graphCreatorParen( regexString )
  return regexNFA;
}

export default regex2NFA;
