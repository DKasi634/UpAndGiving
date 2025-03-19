

export type AuthError = {
    code?: string,
    message: string
}

export type CustomError = {
    name: string,
    message: string
}

export const getAuthError = (error: unknown): AuthError => {

    if (error instanceof Error) {
        return {message: error.message };
    }
    else {
        return { message: "Something went wrong !" };
    }
};

export const getCustomError = (error: unknown): CustomError => {
    if (error instanceof Error) {
        return { name: error.name, message: error.message };
    }
    return { name: 'Erreur inconnue', message: "Une erreur inconnue s'est produite !" };
};
