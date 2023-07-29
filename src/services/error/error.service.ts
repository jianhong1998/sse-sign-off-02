const getErrorMessage = (error: unknown): string => {
    return error instanceof Error ? error.message : JSON.stringify(error);
};

export { getErrorMessage };
