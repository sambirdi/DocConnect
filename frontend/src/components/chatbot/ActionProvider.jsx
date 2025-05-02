import axios from 'axios';
import Tesseract from 'tesseract.js';

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleMessage = async message => {
    try {
      const response = await axios.post('http://localhost:5000/api/chatbot/chatbot', { message });
      const botMessage = this.createChatBotMessage(response.data.response, {
        widget: response.data.data ? 'doctorList' : null,
        payload: response.data.data, // Ensure this is an array of objects
      });
      this.setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
      }));
    } catch (error) {
      const botMessage = this.createChatBotMessage('Sorry, something went wrong. Try again!');
      this.setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
      }));
    }
  };

  handleFileUpload = () => {
    const botMessage = this.createChatBotMessage('Please upload your medical report image.', {
      widget: 'fileUpload',
      onFileChange: this.handleFileChange,
    });
    this.setState(prev => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  handleFileChange = async event => {
    const file = event.target.files[0];
    if (!file) return;

    const botMessage = this.createChatBotMessage('Processing your report...');
    this.setState(prev => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));

    try {
      // Perform OCR with Tesseract.js
      const { data: { text } } = await Tesseract.recognize(file, 'eng', {
        logger: m => console.log(m),
      });

      // Send OCR text to backend
      const response = await axios.post('http://localhost:5000/api/chatbot/chatbot', { ocrText: text });
      const resultMessage = this.createChatBotMessage(response.data.response, {
        widget: response.data.data ? 'doctorList' : null,
        payload: response.data.data, // Ensure this is an array of objects
      });
      this.setState(prev => ({
        ...prev,
        messages: [...prev.messages, resultMessage],
      }));
    } catch (error) {
      console.error(error);
      const errorMessage = this.createChatBotMessage('Error processing report. Please try again.');
      this.setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
    }
  };
}

export default ActionProvider;