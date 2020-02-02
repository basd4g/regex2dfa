import Node from "./node";
import Edge from "./edge";
import NFA from "./nfa";

class NFAcreator {
  graph:NFA;
  
  constructor() {
    this.graph = new NFA();
  }

  get nodeStart():Node{
    const nodeStart = this.graph.nodeStart;
    if( nodeStart === undefined){
      throw new Error("start node is not generated");
    }
    return nodeStart;
  }

  addCharactor(nodeFrom:Node, charactor:string):Node {
   const node = this.graph.addNode(false);
   this.graph.addEdge(nodeFrom, node, charactor);
   return node;
  }

  addEpsilonTransitionNode(nodeFrom:Node):Node {
    return this.addCharactor(nodeFrom, "ε");
  }
  addEpsilonTransitionEdge(nodeFrom:Node, nodeTo:Node):Edge {
    return this.graph.addEdge(nodeFrom, nodeTo, "ε");
  }

  addString(nodeFrom:Node, str:string):Node {
    const charactorArray = str.split('');
    let nodeHead = nodeFrom;

    charactorArray.forEach( c => {
      nodeHead = this.addCharactor(nodeHead, c);
    });

    return nodeHead;
  }
  /*

  addStringRepeat(nodeFrom:Node, str:string):Node {
    
    const nodeLoop = this.addEpsilonTransitionNode(nodeFrom);

    const nodeEndStr = this.addString(nodeLoop, str);

    this.addEpsilonTransitionEdge(nodeEndStr, nodeLoop);

    const nodeAfter = this.addEpsilonTransitionNode(nodeEndStr);
    return nodeAfter;
  }

  addStringOr(nodeFrom:Node, string0:string, string1:string):Node {
    const nodeBeforeRoot0 = this.addEpsilonTransitionNode(nodeFrom);
    const nodeBeforeRoot1 = this.addEpsilonTransitionNode(nodeFrom);

    const nodeAfterRoot0 = this.addString(nodeBeforeRoot0, string0);
    const nodeAfterRoot1 = this.addString(nodeBeforeRoot1, string1);

    const nodeAfter = this.addEpsilonTransitionNode(nodeAfterRoot0);
    this.addEpsilonTransitionEdge(nodeAfterRoot1, nodeAfter);

    return nodeAfter;
  }
  */
  addGraph(nodeFrom:Node, graph:NFA):Node {
    const nodeReplacing = this.addEpsilonTransitionNode(nodeFrom);
    const nodeAfter = this.addEpsilonTransitionNode(nodeReplacing);
    this.graph.replaceNodeWithGraph(nodeReplacing, graph);
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

export default NFAcreator;
