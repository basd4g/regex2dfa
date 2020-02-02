import Node from "./Node";
import Edge from "./Edge";
import Graph from "./Graph";

class NFA extends Graph {

  addEpsilonTransitionNode(nodeFrom:Node):Node {
    const nodeTo = this.addNode( false );
    this.addEpsilonTransitionEdge( nodeFrom, nodeTo);
    return nodeTo;
  }

  addEpsilonTransitionEdge(nodeFrom:Node, nodeTo:Node):Edge {
    return this.addEdge(nodeFrom, nodeTo, "ε");
  }

  addGraph(nodeFrom:Node, graph:NFA):Node {

    const nodeStarted = graph.resetNodeStart();
    const nodeFinished = graph.resetNodesFinish();

    this.mergeNodes( graph.nodes );
    this.mergeEdges( graph.edges );

    this.addEpsilonTransitionEdge( nodeFrom, nodeStarted );

    return nodeFinished;
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

  private mergeNodes(nodes:Node[]) {
    this.nodes.push( ...nodes );
  }

  private mergeEdges(edges:Edge[]) {
    this.edges.push( ...edges );
  }

  private resetNodeStart():Node {
    const nodeStarted = this.nodeStart;
    if ( nodeStarted === undefined ) {
      throw new Error("Start node is not found.");
    }
    nodeStarted.isStart = false;
    return nodeStarted;
  }

  private resetNodesFinish():Node {
    const nodeFinished = this.bindNodesFinish();

    if( nodeFinished === undefined ) {
      throw new Error("Finish node is not found.");
    }
    nodeFinished.isFinish = false;
    return nodeFinished;
  }

  private bindNodesFinish():Node|undefined {
    const nodesFinish = this.nodesFinish;
    if( nodesFinish.length === 0 ){
      return undefined;
    }
    const newNodeFinish = this.addNode(true);

    nodesFinish.forEach( nodeFinish => {
      nodeFinish.isFinish = false;
      this.addEpsilonTransitionEdge( nodeFinish, newNodeFinish );
    });
    return newNodeFinish;
  }
}

export default NFA;
