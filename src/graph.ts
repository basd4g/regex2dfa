import Node from "./node";
import Edge from "./edge";

class Graph {
  nodes: Node[];
  edges: Edge[];
  constructor(){
    const nodeStart = new Node(true,false);
    this.nodes = [ nodeStart ];
    this.edges = [];
  }

  addNode(isFinish:boolean):number{
    const node = new Node(false, isFinish);
    this.nodes.push(node);
    return node.id;
  }

  deleteNode(id:number):boolean{
    const lengthBefore = this.nodes.length;

    this.nodes = this.nodes.filter( node => { return node.id !== id });

    const lengthAfter = this.nodes.length;
    
    const successDelete = lengthBefore !== lengthAfter;
    return successDelete;
  }

  getNode(id: number): Node|undefined {
    return  this.nodes.find( n => { return n.id === id });
  }
  
  getEdge(id: number): Edge|undefined {
    return this.edges.find( e => { return e.id === id });
  }

  addEdge(fromId:number, toId:number, value:string):number|undefined{
    const nodeFrom = this.getNode(fromId);
    const nodeTo = this.getNode(toId);
    if ( nodeFrom === undefined || nodeTo === undefined ){
      // id is invalid
      return undefined;
    }
    if( value.length !== 1 ){
      // value is invalid
      return undefined;
    }

    const edge = new Edge(nodeFrom, nodeTo, value);
    this.edges.push(edge);

    return edge.id;

  }

  deleteEdge(id:number):boolean{
    const lengthBefore = this.edges.length;

    this.edges = this.edges.filter( edge => { return edge.id !== id });

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

  edgesFrom(nodeId:number):Edge[] {
    return this.edges.filter( edge => { return edge.from.id === nodeId });
  }

  edgesTo(nodeId:number):Edge[] {
    return this.edges.filter( edge => { return edge.to.id === nodeId });
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
