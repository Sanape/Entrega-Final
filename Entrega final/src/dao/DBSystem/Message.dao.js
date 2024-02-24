import {Message} from "../../models/message.js"
import BaseDao from "./Base.dao.js";

class MessageDao extends BaseDao{
    constructor(){
        super(Message)
    }
}

export default new MessageDao();