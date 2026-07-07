import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import {
  colors,
  spacing,
  borderRadius,
  typography,
} from "../../constants/theme";
import { userWalletStore } from "../../store/useWalletStore";

export default function ReceiveScreen() {
  const router = useRouter();
  const { publicKey } = userWalletStore();

  async function handleCopy() {
    if (!publicKey) return;
    await Clipboard.setStringAsync(publicKey);
    Alert.alert("copied!", "Address copied to clipboard");
  }

  async function handleShare() {
    if (!publicKey) return;
    await Share.share({
      message: "My solana wallet address: " + publicKey,
    });
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={{ color: colors.primary, fontSize: 20 }}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Receive SOL</Text>
        <View style={{ width: 40 }}></View>
      </View>

      <View style={styles.qrContainer}>
        <View style={styles.qrBox}>
          {publicKey && (
            <QRCode
              value={publicKey}
              size={220}
              color="#000000"
              backgroundColor='"#ffffff'
            ></QRCode>
          )}
        </View>
        <Text style={styles.scanText}>Scan to receive SOL</Text>
      </View>
      {/*Address */}
      <View style ={styles.addressContainer}>
        <Text style={styles.addressLabel}>Your Wallet Address</Text>
        <View style={styles.addressBox}>
            <Text style={styles.addressText}numberOfLines={2}>{publicKey}</Text>
        </View>
 {/*buttons */}
 <View style={styles.buttons}>
    <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
      <Text style={styles.copyBtnText}>Copy Address</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.copyBtn} onPress={handleShare}>
      <Text style={styles.copyBtnText}>Share Address</Text>
    </TouchableOpacity>
  </View>
  {/* Warning Box */}
  <View style={styles.warningBox}>
    <Text style={styles.warningText}>
      Make sure to only share this address with trusted parties.
    </Text>
  </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    paddingTop: 60,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  backBtn: {
    backgroundColor: colors.card,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    width: 40,
    alignItems: "center",
  },
  backText: {
    fontSize: 20,
    color: colors.text,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  },

  qrContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  qrBox: {
    backgroundColor: "#ffffff",
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  scanText: {
    ...typography.small,
    color: colors.textMuted,
  },
  addressContainer: {
    marginBottom: spacing.lg,
    marginLeft: spacing.md,
  },
    addressBox: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addressText: {
    ...typography.body,
    color: colors.text,
    textAlign: "center",
  },
   buttons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  copyBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
   copyBtnText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
   addressLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },

  warningBox:{
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  warningText:{
    ...typography.small,
    color: colors.textMuted,
  }
});
