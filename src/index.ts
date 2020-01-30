import Graph from "./graph";

const graph = new Graph();

const nodeStart = graph.nodeStart
if(nodeStart === undefined){
  process.exit(0);
}
const node0 = nodeStart.id;

const input = process.argv[2];

let nodeBefore:number = node0;
let nodeAfter:number;

input.split('').forEach( (c,idx) => {
  const isFinish = input.length-1 === idx;
  nodeAfter = graph.addNode(isFinish);
  graph.addEdge(nodeBefore, nodeAfter, c);
  
  nodeBefore = nodeAfter;
});

console.log(graph.graphvizString);
