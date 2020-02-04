import RegexNFA from "./RegexNFA";
import Graph from "./Graph";

/*
interface NodeMap {
  dfaNodeId: number;
  nfaNodesId: number[];
}

type NFAnodeIds = number[];
type DFAnodeId = number;
interface NodesMap {
  [key: DNAnodeId]: NFAnodeIds;
}

const nodesMap:NodesMap = {};
*/


const nfa2dfa = (regexNFA: RegexNFA):Graph => {
  const dfa = new Graph();

  dfa.nodes = regexNFA.nodes;
  dfa.edges = regexNFA.edges;

  return dfa;
}; 

export default nfa2dfa;
