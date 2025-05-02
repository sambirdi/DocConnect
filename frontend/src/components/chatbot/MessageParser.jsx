class MessageParser {
    constructor(actionProvider) {
      this.actionProvider = actionProvider;
    }
  
    parse(message) {
      if (message.toLowerCase().includes('upload report')) {
        this.actionProvider.handleFileUpload();
      } else {
        this.actionProvider.handleMessage(message);
      }
    }
  }
  
  export default MessageParser;