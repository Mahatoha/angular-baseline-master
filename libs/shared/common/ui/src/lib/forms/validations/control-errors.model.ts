export interface ErrMessages {
    [key: string]: (args: { [key: string]: object }) => string;
}
