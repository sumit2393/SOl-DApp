import { userWalletStore } from "@/store/useWalletStore";
import { authenticateWithBiometric} from "@/services/biometricService";
import { getSecretKey } from "@/services/secureStorageServices";


export function useAuth() {
    const { isUnlocked, setUnlocked } = userWalletStore();

    async function unlockWallet():Promise<boolean> {
     const success = await authenticateWithBiometric('Verify your identity to unlock the wallet');
     if(success){
        setUnlocked(true);

     }
     return success;
    }

    function lock():void{
        setUnlocked(false)
    }
      async function getSecretKeyWithAuth(): Promise<string | null> {
    const success = await authenticateWithBiometric(
      'Verify to access your private key'
    );
    if (!success) return null;
    return await getSecretKey();
  }
  return{
    isUnlocked,
    lock,
    unlockWallet,
    getSecretKeyWithAuth,

  }
}