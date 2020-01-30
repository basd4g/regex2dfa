class Node {
  private static idCounter:number = 0;
  isStart:boolean;
  isFinish:boolean;
  id:number;
  constructor(isStart:boolean,isFinish:boolean){
    this.isStart = isStart;
    this.isFinish = isFinish;
    this.id = Node.idCounter++;
  }
  get name():string {
    return `s${this.id}`;
  }
}

export default Node;
