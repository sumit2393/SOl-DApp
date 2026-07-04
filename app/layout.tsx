import { Stack } from "expo-router";
import '../polyfills';
export default function RootLayout() {

    return(
      <Stack screenOptions={{ headerShown: false,
        contentStyle: { backgroundColor: '#0a0a0a' }

       }} />
    )
}