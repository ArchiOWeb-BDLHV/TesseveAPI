import { Role } from "../../models/role.js";
import { unauthorized } from "../../../errors.js";

export class ConversationPolicy {
    static index(request, response, next) {
        next();
    }

    static store(request, response, next) {
        next();
    }

    static show(request, response, next) {
        if (request.user.conversations.includes(request.params.id) || request.user.is(Role.ADMIN)) {
            next();
        } else {
            unauthorized(next);
        }
    }

    static update(request, response, next) {
        if (request.user.conversations.includes(request.params.id) || request.user.is(Role.ADMIN)) {
            next();
        } else {
            unauthorized(next);

        }
    }

    static destroy(request, response, next) {
        if (request.user.conversations.includes(request.params.id) || request.user.is(Role.ADMIN)) {
            next();
        } else {
            unauthorized(next);
        }
    }


}