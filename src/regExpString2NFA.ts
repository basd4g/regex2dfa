import Node from "./node";
import NFA from "./nfa";
class CreateNFA {
  graph:NFA;
  newestNode:Node;
  
  constructor() {
    this.graph = new NFA();
    const nodeStart = this.graph.nodeStart;
    if( nodeStart === undefined){
      throw new Error("start node is not generated");
      return;
    }
    this.newestNode = nodeStart;
  }

  addCharactor(str:string):boolean{
   const node = this.graph.addNode(false);
   const successAddEdge = this.graph.addEdge(this.newestNode, node, str);
   if(successAddEdge === null){
     return false;
   }
   this.newestNode = node;
   return true;
  }

  finalize(){
    const nodeFinish = this.newestNode;
    nodeFinish.isFinish = true;
  }


  
}


export default (regExpString: string):NFA => {
  const createNfa = new CreateNFA();

  regExpString.split('').forEach( (c,idx) => {
    createNfa.addCharactor(c);
  });

  createNfa.finalize();

  createNfa.graph.addNode(true);
  
  createNfa.graph.bindNodesFinish();

  return createNfa.graph;
}
