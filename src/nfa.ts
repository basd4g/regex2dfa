import Node from "./Node";
import Edge from "./Edge";
import Graph from "./Graph";
import Epsilon from "./Epsilon";

class NFA extends Graph {

  addEpsilonTransitionNode(nodeFrom:Node):Node {
    const nodeTo = this.addNode( false );
    this.addEpsilonTransitionEdge( nodeFrom, nodeTo);
    return nodeTo;
  }

  addEpsilonTransitionEdge(nodeFrom:Node, nodeTo:Node):Edge {
    return this.addEdge(nodeFrom, nodeTo, Epsilon);
  }

  addGraph(nodeFrom:Node, graph:NFA):Node {

    const nodeStarted = graph.resetNodeStart();
    const nodeFinished = graph.resetNodesFinish();

    this.mergeNodes( graph.nodes );
    this.mergeEdges( graph.edges );

    this.addEpsilonTransitionEdge( nodeFrom, nodeStarted );

    return nodeFinished;
  }

  addGraphsParallel(nodeFrom:Node, graphs:NFA[]):Node {
    const nodeAfterBinded = this.addNode(false);
    graphs.forEach( graph => {
      const nodeBeforeGraph = this.addEpsilonTransitionNode( nodeFrom );
      const nodeAfterGraph = this.addGraph( nodeBeforeGraph, graph );
      this.addEpsilonTransitionEdge( nodeAfterGraph, nodeAfterBinded );
    });
    return nodeAfterBinded;
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

  bindNodesFinish():Node|undefined {
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
