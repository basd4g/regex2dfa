import Node from "./node";
import Edge from "./edge";
import NFA from "./nfa";
import NFAcreator from "./NFAcreator";

const graphCreatorString = (str:string):NFA => {
  const nfaCreator = new NFAcreator();
  const nodeHead = nfaCreator.addString(nfaCreator.nodeStart, str);
  nfaCreator.finalize(nodeHead);
  return nfaCreator.graph;
};

export default (regExpString: string):NFA => {
  return graphCreatorString(regExpString);
}
