import RegexNFA from "./RegexNFA";

const shrinkEpsilon = ( regexNFA:RegexNFA ):RegexNFA => {
  return shrinkPreEpsilon( shrinkPostEpsilon( regexNFA ) );
};


// 単一の遷移のみから遷移して、単一のε遷移のみを持つノードは、前者のエッジを付け替えて削除
const shrinkPostEpsilon = (regexNFA:RegexNFA):RegexNFA => {
  const nodes = regexNFA.nodes;

  const nodesToDelete = nodes.filter( node => {
    if ( regexNFA.edgesTo(node).length !== 1 ) {
      return false;
    }
    const edges = regexNFA.edgesFrom(node);
    if ( edges.length === 1 && edges[0].value === "ε") {
      return true;
    }
    return false;
  });

  nodesToDelete.forEach( nodeToDelete => {
    const edgeToDelete = regexNFA.edgesFrom( nodeToDelete )[0];
    const edgeToChange = regexNFA.edgesTo( nodeToDelete )[0];
    edgeToChange.to = edgeToDelete.to;
    regexNFA.deleteEdge( edgeToDelete );
    regexNFA.deleteNode( nodeToDelete );
  });
  return regexNFA;
};

// 単一のε遷移のみから遷移して、単一の遷移のみを持つノードは、後者のエッジを付け替えて削除
const shrinkPreEpsilon = (regexNFA:RegexNFA):RegexNFA => {
  const nodes = regexNFA.nodes;

  const nodesToDelete = nodes.filter( node => {
    if ( regexNFA.edgesFrom(node).length !== 1 ) {
      return false;
    }
    const edges = regexNFA.edgesTo(node);
    if ( edges.length === 1 && edges[0].value === "ε") {
      return true;
    }
    return false;
  });

  nodesToDelete.forEach( nodeToDelete => {
    const edgeToDelete = regexNFA.edgesTo( nodeToDelete )[0];
    const edgeToChange = regexNFA.edgesFrom( nodeToDelete )[0];
    edgeToChange.from = edgeToDelete.from;
    regexNFA.deleteEdge( edgeToDelete );
    regexNFA.deleteNode( nodeToDelete );
  });
  return regexNFA;
};

export default shrinkEpsilon;
