import Node from "./Node";

class Edge {
  private static idCounter:number = 0;
  id:number;
  from:Node;
  to:Node;
  value:string;

  constructor(from:Node, to:Node, value:string){
    this.id = Edge.idCounter++;
    this.from = from;
    this.to = to;
    this.value = value;
  }
  get name():string {
    return `e${this.id}`;
  }
}

class EdgeGraphviz extends Edge {
  get graphvizString():string{
    return `${this.from.name} -> ${this.to.name} [label = "${this.value}"];`;
  }

}

export default EdgeGraphviz;
