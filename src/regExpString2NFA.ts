import Node from "./node";
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

  addCharactor(nodeFrom:Node, str:string):Node {
   const node = this.graph.addNode(false);
   this.graph.addEdge(nodeFrom, node, str);
   return node;
  }

  addString(nodeFrom:Node, str:string):Node {
    const charactorArray = str.split('');
    let nodeHead = nodeFrom;

    charactorArray.forEach( c => {
      nodeHead = this.addCharactor(nodeHead, c);
    });

    return nodeHead;
  }

  addCharactorRepeat(nodeFrom:Node, str:string):Node {

    const nodeLoop = this.addCharactor(nodeFrom, "ε");

    this.graph.addEdge(nodeLoop, nodeLoop, str);

    const nodeAfter = this.addCharactor(nodeLoop, "ε");
    return nodeAfter;
  }

  finalize(node:Node){
    node.isFinish = true;
  }

}


export default (regExpString: string):NFA => {
  const createNfa = new CreateNFA();
  let nodeHead:Node = createNfa.nodeStart;

  nodeHead = createNfa.addString(nodeHead, regExpString);

  createNfa.finalize(nodeHead);

  return createNfa.graph;
}
