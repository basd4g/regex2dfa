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
  cloneNode(originNodeId:number):number|undefined{
    const originNode = this.graph.getNode(originNodeId);
    if( originNode === undefined ){
      return undefined;
    }
    const newNodeIsFinish = originNode.isFinish;
    const newNodeId = this.graph.addNode(newNodeIsFinish);
    if( newNodeId === undefined){
      return undefined;
    }
    const newNode = this.graph.getNode(newNodeId);
    if( newNode === undefined ){
      return undefined;
    }

    const edgeId = this.graph.addEdge(originNode.id, newNode.id, "ε");
    if( edgeId === undefined ){
      return undefined;
    }
    const edge = this.graph.getEdge(edgeId);
    if( edge === undefined ){
      return undefined;
    }

    const edgesFrom = this.graph.edgesFrom(originNodeId);
    edgesFrom.forEach( e => {
      if( e.id !== edge.id ){
        e.from = newNode;
      }
    });

    return newNodeId;

  }
}


export default (regExpString: string):Graph => {
  const nfa = new NFA();

  regExpString.split('').forEach( (c,idx) => {
    nfa.addCharactor(c);
  });

  nfa.cloneNode(3);

  nfa.finalize();

  return nfa.graph;
}
