import * as Clipboard from "expo-clipboard";
const copyToClipboard = (text) => {
  if (text) {
    Clipboard.setString(text);
  }
};

export default copyToClipboard;
