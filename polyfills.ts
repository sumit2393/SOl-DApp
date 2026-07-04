import 'react-native-get-random-values';
import { Buffer as BufferPolyfill } from 'buffer';

declare global {
  var Buffer: typeof BufferPolyfill;
}

globalThis.Buffer = BufferPolyfill;