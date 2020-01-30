import Graph from "./graph";
import Node from "./node";

class NFA extends Graph {
  // 存在するノードからε遷移するノードを作る。もとのノードからの有効辺は新しいノードが始点となるように付け替える。
  cloneNode(originNode:Node):Node {
    const newNodeIsFinish = originNode.isFinish;
    const newNode = this.addNode(newNodeIsFinish);

    const edge = this.addEdge(originNode, newNode, "ε");

    const edgesFrom = this.edgesFrom(originNode);
    edgesFrom.forEach( e => {
      if( e.id !== edge.id ){
        e.from = newNode;
      }
    });
    return newNode;
  }

  bindNodesFinish():Node|undefined {
    const nodesFinish = this.nodesFinish;
    if( nodesFinish.length === 0 ){
      return undefined;
    }
    const newNodeFinish = this.addNode(true);

    nodesFinish.forEach( nodeFinish => {
      nodeFinish.isFinish = false;
      this.addEdge( nodeFinish, newNodeFinish, "ε" );
    });
    return newNodeFinish;
  }



  /*
  replaceNodeWithGrapth(nodeId:number, graph:NFA):boolean{
    // 置き換えるグラフの受理状態を一つにまとめておく
    const nodeFinishId = graph.bindNodesFinish();
    if( nodeFinish === undefined ){
      return false;
    }
    const nodeFinish = this.getNode(nodeFinishId)
    if( nodeFinish === undefined ){
      return false;
    }

    // 置き換えるグラフの受理状態を解除
    nodeFinish.isFinish = false;


    const cloneNodeId = this.cloneNode(nodeId);
    if( cloneNodeId === undefined ){
      return false;
    }
  }
  */
}

export default NFA;
