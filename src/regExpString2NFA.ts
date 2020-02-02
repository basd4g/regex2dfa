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

const graphCreatorStringInAsteriskBar = (str:string):RegexNFA => {
  const indexOfBar = str.indexOf( '|' );
  if( indexOfBar === -1 ){
    return graphCreatorStringInAsterisk( str );
  }

  const strBeforeBar = str.slice(0, indexOfBar);
  const strAfterBar = str.slice(indexOfBar+1);

  return connectGraphsOr(
    graphCreatorStringInAsterisk( strBeforeBar ),
    graphCreatorStringInAsteriskBar( strAfterBar )
  );
};

type mixedCell = string | RegexNFA;

const graphCreatorParen = (str:string):RegexNFA => {

  const mixedArray : mixedCell[] = str.split('');
  while(true){
    const indexOfRightParen = mixedArray.indexOf( ')' );
    console.log( indexOfRightParen );

    if ( indexOfRightParen === -1 ){
      break;
    }
  
    const indexOfCorrespondingLeftParen = mixedArray.lastIndexOf( '(', indexOfRightParen );
    console.log( indexOfCorrespondingLeftParen );

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
      regexNFA = connectGraphs( regexNFA, graphCreatorStringInAsteriskBar( stack ) );
      stack = "";
      regexNFA = connectGraphs( regexNFA, mixedCell );
    }
  }

  regexNFA = connectGraphs( regexNFA, graphCreatorStringInAsteriskBar( stack ) );
  return regexNFA
};

const graphRepeatOwn = (graph:RegexNFA):RegexNFA => {
  const regexNFA = new RegexNFA();
  let nodeHead = regexNFA.nodeStart;

  nodeHead = regexNFA.addGraphRepeat(nodeHead, graph);

  regexNFA.finalize(nodeHead);

  return regexNFA;
};


const connectGraphsOr = ( graph0:RegexNFA, graph1:RegexNFA ):RegexNFA => {
  const regexNFA = new RegexNFA();
  let nodeHead = regexNFA.nodeStart;

  nodeHead = regexNFA.addGraphOr(nodeHead, graph0, graph1);

  regexNFA.finalize(nodeHead);

  return regexNFA;
};

const connectGraphsParallel = ( parallelGraphs:RegexNFA[] ):RegexNFA => {
  if ( parallelGraphs.length === 0 ) {
    throw new Error("parallelGraphs.length = 0");
  }

  while ( parallelGraphs.length > 1 ) {
    const tail = parallelGraphs.pop();
    const preTail = parallelGraphs.pop();
    if ( tail === undefined || preTail === undefined ) {
      throw new Error("tail or preTail is undefined");
    }
    const newTail = connectGraphsOr(preTail, tail);
    parallelGraphs.push( newTail );
  }
  return parallelGraphs[0];
  
}

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

const graphCreatorString = (str:string):RegexNFA => {
  const regexNFA = new RegexNFA();
  const nodeHead = regexNFA.addString(regexNFA.nodeStart, str);
  regexNFA.finalize(nodeHead);
  return regexNFA;
};


export default (regExpString: string):RegexNFA => {
  return graphCreatorParen( regExpString );
}
