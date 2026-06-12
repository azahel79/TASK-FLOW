export declare class AuthService {
    register(data: {
        name: string;
        email: string;
        password: string;
    }): Promise<{
        user: {
            id: number;
            email: string;
            name: string;
            createdAt: Date;
        };
        token: string;
    }>;
    login(data: {
        email: string;
        password: string;
    }): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
            createdAt: Date;
        };
        token: string;
    }>;
    getProfile(userId: number): Promise<{
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        _count: {
            projects: number;
        };
    }>;
    private generateToken;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map