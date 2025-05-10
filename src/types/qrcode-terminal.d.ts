declare module 'qrcode-terminal' {
    interface Options {
        small?: boolean;
    }
    
    function generate(text: string, options?: Options): void;
    
    export = {
        generate
    };
} 