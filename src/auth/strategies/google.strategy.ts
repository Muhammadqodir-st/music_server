import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            callbackURL: "http://localhost:8000/auth/google/callback",
            scope: ["email", "profile"],
        });
    };

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        return {
            name: profile.name?.givenName,
            email: profile.emails?.[0].value,
            avatar: profile.photos?.[0].value,
            provider: "google",
            googleId: profile.id
        };
    };
}