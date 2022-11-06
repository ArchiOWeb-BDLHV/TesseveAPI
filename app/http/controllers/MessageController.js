import { sendMessageToSpecificUser } from "../../../ws.js";
import Conversation from "../../models/conversation.js";
import Message from "../../models/message.js";

export class MessageController {
    static async index(req, res, next) {
        const conversations = await Conversation.findById(req.params.convId).populate('messages');
        res.json(conversations.messages);
    }

    static async store(req, res, next) {
        const conversation = await Conversation.findById(req.params.convId);
        const message = await Message.create({
            content: req.body.content,
            conversation: req.params.convId,
        });
        conversation.messages.push(message._id);
        await Conversation.updateOne({ _id: req.params.convId }, conversation);

        conversation.users.forEach(userId => {
            if (userId != req.user._id) {
                sendMessageToSpecificUser("Nouveau message dans la conversation " + conversation.name, userId, "reload_messages");
            }
        });
        res.status(201).json(message);
    }

    static async show(req, res, next) {
        const message = await Message.findById(req.params.id);
        res.status(200).json(message);
    }

    static async update(req, res, next) {
        const message = await Message.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        res.status(200).json(message);
    }

    static async destroy(req, res, next) {
        const message = await Message.findOneAndDelete({ _id: req.params.id });
        res.status(204).json();
    }
}