import Graph from "./graph";

class NFA {
  graph:Graph;
  newestNodeId:number;
  
  constructor() {
    this.graph = new Graph;
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


export default (regExpString: string):Graph => {
  const nfa = new NFA();

  regExpString.split('').forEach( (c,idx) => {
    nfa.addCharactor(c);
  });

  nfa.finalize();

  return nfa.graph;
}
