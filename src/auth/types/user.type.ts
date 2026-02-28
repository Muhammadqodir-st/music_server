export class IUser {
    id?: string;
    name: string;
    email: string;
};

export class IGoogleUser {
    name: string;
    email: string;
    avatar?: string;
    provider: "google" | "email";
    googleId: string;
}