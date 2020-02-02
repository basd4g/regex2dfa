import Node from "./Node";
import Edge from "./Edge";
import NFA from "./NFA";

class RegexNFA extends NFA{

  get nodeStart():Node{
    const nodeStart = super.nodeStart;
    if ( nodeStart === undefined ) {
      throw new Error("node start is undefined");
    }
    return nodeStart;
  }

  addCharactor(nodeFrom:Node, charactor:string):Node {
   const node = this.addNode(false);
   this.addEdge(nodeFrom, node, charactor);
   return node;
  }

  addString(nodeFrom:Node, str:string):Node {
    const charactorArray = str.split('');
    let nodeHead = nodeFrom;

    charactorArray.forEach( c => {
      nodeHead = this.addCharactor(nodeHead, c);
    });

    return nodeHead;
  }

  finalize(node:Node){
    node.isFinish = true;
  }
}

export default RegexNFA;
