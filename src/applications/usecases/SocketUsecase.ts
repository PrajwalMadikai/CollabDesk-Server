import { Socket } from "socket.io";
import { FileRepository } from "../../respository/fileRepository";

export class SocketUsecase{
    constructor(
        private fileRepository:FileRepository
    ){}

    executeSocket(socket:Socket):void{
        
       

        socket.on('updateFile',async(data:any)=>{
            try {
                
                if (!data?.id || !data?.content) {
                    console.error("Invalid data received:", data);
                    return;
                  }
              const updatedFile=await this.fileRepository.updateFileContent(data.id,data.content)
                 if (updatedFile) {
                    socket.broadcast.emit('fileUpdated', {
                      id: data.id,
                      content: data.content
                    });
                  }
            } catch (error) {
                console.log('Error in socket update content:',error);
                
            }
        })

    }
}