import { Socket } from "socket.io";
import { FileRepository } from "../../respository/fileRepository";

export class SocketUsecase{
    constructor(
        private fileRepository:FileRepository
    ){}

    executeSocket(socket:Socket):void{

        socket.on('disconnect',()=>{
        })

        socket.on('updateFile',async(data:any)=>{
            try {
                 await this.fileRepository.updateFileContent(data.id,data.content)
            } catch (error) {
                console.log('Error in socket update content:',error);
                
            }
        })

    }
}