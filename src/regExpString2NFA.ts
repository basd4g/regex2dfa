import Node from "./Node";
import Edge from "./Edge";
import NFA from "./NFA";
import RegexNFA from "./RegexNFA";

const graphCreatorString = (str:string):RegexNFA => {
  const regexNFA = new RegexNFA();
  const nodeHead = regexNFA.addString(regexNFA.nodeStart, str);
  regexNFA.finalize(nodeHead);
  return regexNFA;
};

export default (regExpString: string):RegexNFA => {
  return graphCreatorString(regExpString);
}
