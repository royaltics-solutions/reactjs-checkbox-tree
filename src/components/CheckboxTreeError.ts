class CheckboxTreeError extends Error {
    constructor(message: string) {
        super(message); // Llama al constructor de la clase base Error

        this.name = 'CheckboxTreeError'; // Asigna un nombre específico para el error


        this.stack = new Error(message).stack;

    }
}

export default CheckboxTreeError;