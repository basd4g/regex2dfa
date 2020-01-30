import Graph from "./graph";

const graph = new Graph();

const nodeStart = graph.nodeStart
if(nodeStart === undefined){
  process.exit(0);
}
const node0 = nodeStart.id;
const node1 = graph.addNode(false);
const node2 = graph.addNode(true);
const node3 = graph.addNode(true);
graph.addEdge(node0, node1 , "A");
graph.addEdge(node1, node2 , "B");
graph.addEdge(node1, node2 , "R");
graph.addEdge(node0, node2 , "P");
graph.addEdge(node2, node3 , "B");

console.log(graph.graphvizString);
