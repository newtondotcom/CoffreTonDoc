export interface File {
    name: string;
    id: number;
    date: string;
    isFolder: boolean;
    extension: string | null;
    idParent: number;
    size : number;
}