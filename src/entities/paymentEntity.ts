export class PaymentEntity{
    id:string;
    paymentType:string;
    amount:number;
    FolderNum:number;
    WorkspaceNum:number;
    constructor(
        id:string,
        paymentType:string,
        amount:number,
        FolderNum:number,
        WorkspaceNum:number
    ){
        this.id=id
        this.paymentType=paymentType;
        this.amount=amount;
        this.FolderNum=FolderNum;
        this.WorkspaceNum=WorkspaceNum
    }

}