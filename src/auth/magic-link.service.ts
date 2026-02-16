import { Injectable } from "@nestjs/common";
import { MailerService } from "src/mailer/mailer.service";
import { ISendMagicLink } from "./types/magic-link.type";

@Injectable()
export class SendAuthMegicLink {
    constructor(private mailer: MailerService) { }

    sendMagicLink(payload: ISendMagicLink) {
        const link = `${process.env.FRONTEND_URL}/auth/verify?token=${payload.token}`;
        this.mailer.sendEmail(payload.email, ` <a href="${link}"><button style="background-color: #6d28d9; color: white; padding: 10px 20px; border: none; border-radius: 20px; cursor: pointer;">Click here Continue</button></a>`);

        return {
            message: `Message sent to ${payload.email}, please verify your email to complete registration.`
        };
    };
}