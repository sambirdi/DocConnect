class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const input = message.toLowerCase().trim();
    if (input.includes('upload report') || input.includes('report')) {
      this.actionProvider.handleFileUpload();
    } else {
      this.actionProvider.handleMessage(message);
    }
  }
}

export default MessageParser;