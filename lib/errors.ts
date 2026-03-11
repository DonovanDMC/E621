/** @category Errors */
export class UnexpectedResponseError extends Error {
    error!: unknown;
    override name = "UnexpectedResponseError";
    request!: Request;
    response!: Response;
    constructor(request: Request, response: Response, error: unknown) {
        let message = `Unexpected ${response.status} ${response.statusText} on ${request.method} ${request.url}`;
        if (error) {
            if (typeof error === "string") message += `\n${error}`;
            else if (error instanceof Error) message += `\n${error.message}`;
            else if (typeof error === "object" && error !== null) {
                if ("message" in error && typeof error.message === "string") message += `\n${error.message}`;
                else if ("error" in error && typeof error.error === "string") message += `\n${error.error}`;
                else if ("errors" in error && typeof error.errors === "object" && error.errors !== null) {
                    for (const [key, value] of Object.entries(error.errors)) {
                        if (typeof value === "string") message += `\n${key}: ${value}`;
                        else if (Array.isArray(value)) message += `\n${key}: ${value.join(", ")}`;
                    }
                }
            }
        }
        super(message);
        Object.defineProperties(this, {
            request:  { value: request,    enumerable: false },
            response: { value: response,   enumerable: false },
            error:    { value: error,      enumerable: false }
        });
    }
}
