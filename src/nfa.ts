import Graph from "./graph";

class NFA extends Graph {
  // 存在するノードからε遷移するノードを作る。もとのノードからの有効辺は新しいノードが始点となるように付け替える。
  cloneNode(originNodeId:number):number|undefined{
    const originNode = this.getNode(originNodeId);
    if( originNode === undefined ){
      return undefined;
    }
    const newNodeIsFinish = originNode.isFinish;
    const newNodeId = this.addNode(newNodeIsFinish);
    if( newNodeId === undefined){
      return undefined;
    }
    const newNode = this.getNode(newNodeId);
    if( newNode === undefined ){
      return undefined;
    }

    const edgeId = this.addEdge(originNode.id, newNode.id, "ε");
    if( edgeId === undefined ){
      return undefined;
    }
    const edge = this.getEdge(edgeId);
    if( edge === undefined ){
      return undefined;
    }

    const edgesFrom = this.edgesFrom(originNodeId);
    edgesFrom.forEach( e => {
      if( e.id !== edge.id ){
        e.from = newNode;
      }
    });
    return newNodeId;
  }
}

export default NFA;
