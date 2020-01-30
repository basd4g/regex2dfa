import Node from "./node";
import Edge from "./edge";

function convert2DFA(regExpStr: string): string {
//  console.log(`load:${regExpStr} in convert2DFA`);
  return `
digraph G {
    rankdir=LR;
    empty [label = "" shape = plaintext];
    node [shape = doublecircle]; e1 e2;
    node [shape = circle];
    empty -> s0 [label = "start"];
    s0 -> s1 [label = "1/a"];
    s0 -> e1 [label = "0"];
    s1 -> s2 [label = "2/b"];
    s1 -> s3 [label = "3/c"];
    s3 -> s2 [label = "2/d"];
    s3 -> e2 [label = "4"];
    s2 -> e1 [label = "0"];
    s2 -> s2 [label = "2"];
}
  `;

}

const inputString = process.argv[2];
const dfa = convert2DFA( inputString );
console.log( dfa );

const node = new Node(false,false)
const node2 = new Node(false,false)
console.log(node2.name);

const edge = new Edge(node,node2, "a");
console.log(edge.print());
