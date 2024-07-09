export interface File {
    name: string;
    id: number;
    date: string;
    isFolder: Boolean;
    extension: string | null;
    idParent: number;
    size: number;
}
