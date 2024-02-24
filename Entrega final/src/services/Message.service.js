import MessageDao from "../dao/DBSystem/Message.dao.js"
import BaseService from "./Base.service.js";

class MessageService extends BaseService{
    constructor(){
        super(MessageDao)
    }
}

export default new MessageService();