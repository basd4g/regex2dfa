import Graph from "./graph";
export default (regExpString: string):Graph => {
  const graph = new Graph();

  const nodeStart = graph.nodeStart
  if(nodeStart === undefined){
    throw new Error("start node is not generated");
    return graph;
  }

  let nodeBefore:number = nodeStart.id;
  let nodeAfter:number;

  regExpString.split('').forEach( (c,idx) => {
    const isFinish = regExpString.length-1 === idx;
    nodeAfter = graph.addNode(isFinish);
    graph.addEdge(nodeBefore, nodeAfter, c);
  
    nodeBefore = nodeAfter;
  });

  return graph;
}
