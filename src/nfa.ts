import Graph from "./graph";
import Node from "./node";

interface DevidedNodes {
  in: Node;
  out:Node;
};

class NFA extends Graph {
  // 存在するノードからε遷移するノードを作る。もとのノードからの有効辺は新しいノードが始点となるように付け替える。
  cloneNode(originNode:Node):Node {
    const newNodeIsFinish = originNode.isFinish;
    const newNode = this.addNode(newNodeIsFinish);
    originNode.isFinish = false;

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

  connectGraphAfterOwn( connectingGraph:NFA ){
    // 自身の受理状態をまとめる
    const thisGraphNodeFinish = this.bindNodesFinish();
    if( thisGraphNodeFinish === undefined ){
      throw new Error("finish node is not found");
    }

    // 自身の受理状態を解除する
    thisGraphNodeFinish.isFinish = false;

    // つなげるグラフの初期状態を解除する
    const connectingGraphNodeStart = connectingGraph.nodeStart
    if( connectingGraphNodeStart === undefined ){
      throw new Error("start node is not found");
    }
    connectingGraphNodeStart.isStart = false;

    // node, edgeをmergeする。
    this.nodes.push(...connectingGraph.nodes);
    this.edges.push(...connectingGraph.edges);

    // 自身の受理状態(だったもの)からつなげるグラフの初期状態(だったもの)へのε遷移を追加する。
    this.addEdge(thisGraphNodeFinish, connectingGraphNodeStart, "ε");
  }

  devideNode(originNode:Node):DevidedNodes {
    const newNodeIsFinish = originNode.isFinish;
    const newNode = this.addNode(newNodeIsFinish);
    originNode.isFinish = false;

    const edgesFrom = this.edgesFrom(originNode);
    edgesFrom.forEach( e => { e.from = newNode; });
    
    return {in:originNode, out:newNode};
  }

  replaceNodeWithGraph(before:Node, after:NFA){
    // 置き換えるグラフの受理状態をまとめる
    const afterGraphNodeFinish = after.bindNodesFinish();
    if( afterGraphNodeFinish === undefined ){
      throw new Error("finish node is not found");
    }
    // 置き換えるグラフの受理状態を解除する
    afterGraphNodeFinish.isFinish = false;
    
    // 置き換えるグラフの初期状態を解除する
    const afterGraphNodeStart = after.nodeStart;
    if( afterGraphNodeStart === undefined ){
      throw new Error("start node is not found.");
    }
    afterGraphNodeStart.isStart = false;
    

    // replacingNodeを分割する [ hoge -> replacing -> fuga ] => [ hoge -> devidedNode.in ], [ devidedNode.out -> fuga ]
    const devidedNodes = this.devideNode(before);

    // グラフのnode,edgeをmergeする
    this.nodes.push(...after.nodes);
    this.edges.push(...after.edges);

    // devidedNode.in -> 置き換えるグラフの初期状態だったnode -> ... -> 置き換えるグラフの受理状態だったnode -> devidedNode.out
    this.addEdge(devidedNodes.in, afterGraphNodeStart, "ε");
    this.addEdge(afterGraphNodeFinish, devidedNodes.out, "ε");
  }
}

export default NFA;
