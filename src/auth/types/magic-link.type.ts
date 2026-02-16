export class ISendMagicLink {
    token: string;
    email: string;
};

export class IMagicLinkToken {
    name?: string;
    email: string;
    method: "sign-in" | "sign-up"
}