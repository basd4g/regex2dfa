import Node from "./Node";
import Edge from "./Edge";

class Graph {
  nodes: Node[];
  edges: Edge[];
  constructor(){
    const nodeStart = new Node(true,false);
    this.nodes = [ nodeStart ];
    this.edges = [];
  }

  addNode(isFinish:boolean):Node{
    const node = new Node(false, isFinish);
    this.nodes.push(node);
    return node;
  }

  deleteNode(node:Node):boolean{
    const lengthBefore = this.nodes.length;

    this.nodes = this.nodes.filter( n => { return n.id !== node.id });

    const lengthAfter = this.nodes.length;
    
    const successDelete = lengthBefore !== lengthAfter;
    return successDelete;
  }

  addEdge(nodeFrom:Node, nodeTo:Node, value:string):Edge {
    if( value.length !== 1 ){
      throw new Error("value is a charactor");
    }

    const edge = new Edge(nodeFrom, nodeTo, value);
    this.edges.push(edge);

    return edge;

  }

  deleteEdge(edge:Edge):boolean{
    const lengthBefore = this.edges.length;

    this.edges = this.edges.filter( e => { return e.id !== edge.id });

    const lengthAfter = this.nodes.length;
    
    const successDelete = lengthBefore !== lengthAfter;
    return successDelete;
  }

  get nodeStart():Node|undefined {
    return this.nodes.find( node => { return node.isStart == true });
  }
  
  get nodesFinish():Node[] {
    return this.nodes.filter( node => { return node.isFinish == true });
  }

  edgesFrom(node:Node):Edge[] {
    return this.edges.filter( edge => { return edge.from.id === node.id });
  }

  edgesTo(node:Node):Edge[] {
    return this.edges.filter( edge => { return edge.to.id === node.id });
  }
}

class GraphGraphviz extends Graph {

  private get graphvizStringEdges():string {
    const edgeGraphvizStrings = this.edges.map( edge => { return edge.graphvizString });
    return edgeGraphvizStrings.join("\n");
  }

  private get graphvizStringNodeStart():string {
    const nodeStartName = (this.nodeStart !== undefined)? this.nodeStart.name : "";
    return `empty -> ${ nodeStartName } [label = "start"];`;
  }

  private get graphvizStringNodesFinish():string {
    if(this.nodesFinish.length === 0){
      return "";
    }
    const nodesFinishName = this.nodesFinish.map( node => { return node.name; }).join(" ");
    return `node [shape = doublecircle];${nodesFinishName};`;
  }

  get graphvizString():string {
    return `
      digraph G {
        rankdir=LR;
        empty [label = "" shape = plaintext];
        ${this.graphvizStringNodesFinish}
        node [shape = circle];
        ${this.graphvizStringNodeStart}
        ${this.graphvizStringEdges}
      }
    `;
  }

}
export default GraphGraphviz;
