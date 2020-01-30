import Node from "./node";

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
  print():string{
    return `${this.from.name} -> ${this.to.name} [label = "${this.value}"];`;
  }

}

export default Edge;
