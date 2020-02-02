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

  addEpsilonTransitionNode(nodeFrom:Node):Node {
    return this.addCharactor(nodeFrom, "ε");
  }
  addEpsilonTransitionEdge(nodeFrom:Node, nodeTo:Node):Edge {
    return this.addEdge(nodeFrom, nodeTo, "ε");
  }

  addString(nodeFrom:Node, str:string):Node {
    const charactorArray = str.split('');
    let nodeHead = nodeFrom;

    charactorArray.forEach( c => {
      nodeHead = this.addCharactor(nodeHead, c);
    });

    return nodeHead;
  }

  addGraph(nodeFrom:Node, graph:NFA):Node {
    const nodeReplacing = this.addEpsilonTransitionNode(nodeFrom);
    const nodeAfter = this.addEpsilonTransitionNode(nodeReplacing);
    this.replaceNodeWithGraph(nodeReplacing, graph);
    return nodeAfter;
  }

  addGraphOr(nodeFrom:Node, graph0:NFA, graph1:NFA):Node {
    const nodeBeforeRoot0 = this.addEpsilonTransitionNode(nodeFrom);
    const nodeBeforeRoot1 = this.addEpsilonTransitionNode(nodeFrom);

    const nodeAfterRoot0 = this.addGraph(nodeBeforeRoot0, graph0);
    const nodeAfterRoot1 = this.addGraph(nodeBeforeRoot1, graph1);

    const nodeAfter = this.addEpsilonTransitionNode(nodeAfterRoot0);
    this.addEpsilonTransitionEdge(nodeAfterRoot1, nodeAfter);

    return nodeAfter;
  }

  addGraphRepeat(nodeFrom:Node, graph:NFA):Node {
    const nodeLoop = this.addEpsilonTransitionNode(nodeFrom);

    const nodeEndGraph = this.addGraph(nodeLoop,graph);

    this.addEpsilonTransitionEdge(nodeEndGraph, nodeLoop);

    const nodeAfter = this.addEpsilonTransitionNode(nodeEndGraph);

    return nodeAfter;
  }

  finalize(node:Node){
    node.isFinish = true;
  }
}

export default RegexNFA;
