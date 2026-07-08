import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
  useWindowDimensions,
  Platform,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from '@expo/vector-icons'
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
  const { width, height } = useWindowDimensions();
  const isCompact = width < 380 || height < 700;
  const qrSize = Math.min(width * 0.7, 240);

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
  const containerStyle = {
    padding: isCompact ? spacing.lg : spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 54 : 24,
  }

  const qrBoxStyle = {
    padding: isCompact ? spacing.md : spacing.lg,
  }

  const addressContainerStyle = {
    marginLeft: isCompact ? spacing.sm : spacing.md,
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Receive SOL</Text>
        <View style={{ width: 40 }}></View>
      </View>

      <View style={styles.qrContainer}>
        <View style={[styles.qrBox, qrBoxStyle]}>
          {publicKey && (
            <QRCode
              value={publicKey}
              size={qrSize}
              color="#000000"
              backgroundColor="#ffffff"
            ></QRCode>
          )}
        </View>
        <Text style={styles.scanText}>Scan to receive SOL</Text>
      </View>
      {/*Address */}
      <View style={[styles.addressContainer, addressContainerStyle]}>
        <Text style={styles.addressLabel}>Your Wallet Address</Text>
        <View style={styles.addressBox}>
            <Text style={styles.addressText}numberOfLines={2}>{publicKey}</Text>
        </View>
 {/*buttons */}
 <View style={[styles.buttons, isCompact && styles.buttonsCompact]}>
    <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
      <Ionicons name="copy-outline" size={20} color="#ffffff" />
      <Text style={styles.copyBtnText}>Copy Address</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.copyBtn} onPress={handleShare}>
      <Ionicons name="share-social-outline" size={20} color="#ffffff" />
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
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
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
    borderRadius: borderRadius.xl,
  },
  scanText: {
    ...typography.small,
    color: colors.textMuted,
  },
  addressContainer: {
    marginBottom: spacing.lg,
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
  buttonsCompact: {
    flexDirection: 'column',
  },
  copyBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 48,
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
