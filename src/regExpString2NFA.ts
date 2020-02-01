import Node from "./node";
import Edge from "./edge";
import NFA from "./nfa";
class CreateNFA {
  graph:NFA;
  
  constructor() {
    this.graph = new NFA();
  }

  get nodeStart():Node{
    const nodeStart = this.graph.nodeStart;
    if( nodeStart === undefined){
      throw new Error("start node is not generated");
    }
    return nodeStart;
  }

  addCharactor(nodeFrom:Node, charactor:string):Node {
   const node = this.graph.addNode(false);
   this.graph.addEdge(nodeFrom, node, charactor);
   return node;
  }

  addEpsilonTransitionNode(nodeFrom:Node):Node {
    return this.addCharactor(nodeFrom, "ε");
  }
  addEpsilonTransitionEdge(nodeFrom:Node, nodeTo:Node):Edge {
    return this.graph.addEdge(nodeFrom, nodeTo, "ε");
  }

  addString(nodeFrom:Node, str:string):Node {
    const charactorArray = str.split('');
    let nodeHead = nodeFrom;

    charactorArray.forEach( c => {
      nodeHead = this.addCharactor(nodeHead, c);
    });

    return nodeHead;
  }

  addStringRepeat(nodeFrom:Node, str:string):Node {
    
    const nodeLoop = this.addEpsilonTransitionNode(nodeFrom);

    const nodeEndStr = this.addString(nodeLoop, str);

    this.addEpsilonTransitionEdge(nodeEndStr, nodeLoop);

    const nodeAfter = this.addEpsilonTransitionNode(nodeEndStr);
    return nodeAfter;
  }

  addStringOr(nodeFrom:Node, string0:string, string1:string):Node {
    const nodeBeforeRoot0 = this.addEpsilonTransitionNode(nodeFrom);
    const nodeBeforeRoot1 = this.addEpsilonTransitionNode(nodeFrom);

    const nodeAfterRoot0 = this.addString(nodeBeforeRoot0, string0);
    const nodeAfterRoot1 = this.addString(nodeBeforeRoot1, string1);

    const nodeAfter = this.addEpsilonTransitionNode(nodeAfterRoot0);
    this.addEpsilonTransitionEdge(nodeAfterRoot1, nodeAfter);

    return nodeAfter;
  }

  finalize(node:Node){
    node.isFinish = true;
  }
}


export default (regExpString: string):NFA => {
  const createNfa = new CreateNFA();
  let nodeHead:Node = createNfa.nodeStart;

  nodeHead = createNfa.addStringOr(nodeHead, regExpString, regExpString);

  createNfa.finalize(nodeHead);

  return createNfa.graph;
}
