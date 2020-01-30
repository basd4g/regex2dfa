import NFA from "./nfa";
class CreateNFA {
  graph:NFA;
  newestNodeId:number;
  
  constructor() {
    this.graph = new NFA();
    const nodeStart = this.graph.nodeStart;
    if( nodeStart === undefined){
      throw new Error("start node is not generated");
      return;
    }
    this.newestNodeId = nodeStart.id;
  }

  addCharactor(str:string):boolean{
   const nodeId = this.graph.addNode(false);
   const successAddEdge = this.graph.addEdge(this.newestNodeId, nodeId, str);
   if(successAddEdge === null){
     return false;
   }
   this.newestNodeId = nodeId;
   return true;
  }

  finalize():boolean{
    const nodeIdFinish = this.newestNodeId;
    const nodeFinish = this.graph.getNode(nodeIdFinish);
    if( nodeFinish === undefined ){
      return false
    }
    nodeFinish.isFinish = true;
    return true;
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
