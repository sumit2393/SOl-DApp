export interface Wallet{

    publicKey: string;
    // privateKey: string;
    mnemonic: string;
    // createdAt: Date;
    // updatedAt: Date;
}

export interface WalletData{
    publicKey: string;
    mnemonic: string;
    secretKey: number;
}
export interface Account{
    publickey: string;
    name:String;
    index: number;
}