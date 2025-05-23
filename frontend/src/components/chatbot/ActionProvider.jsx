import axios from 'axios';

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.lastMessage = null;
    this.selectedFile = null;
  }

  handleMessage = async (message, retryCount = 0) => {
    if (this.lastMessage === message && retryCount === 0) {
      return;
    }
    this.lastMessage = message;

    try {
      console.log('Sending message to backend:', message); // Debug log
      const response = await axios.post('http://localhost:5000/api/chatbot/chatbot', { message });
      console.log('Backend response for message:', response.data); // Debug log
      const botMessage = this.createChatBotMessage(response.data.response, {
        widget: response.data.data ? 'doctorList' : null,
        payload: response.data.data,
      });

      this.setState(prev => {
        console.log('Updating messages:', botMessage); // Debug log
        const newMessages = [...prev.messages, botMessage];
        localStorage.setItem('chatbotMessages', JSON.stringify(newMessages));
        return { ...prev, messages: newMessages };
      });
    } catch (error) {
      console.error('Chatbot message error:', error.message, error.response?.data, error.response?.status);
      if (retryCount < 2) {
        setTimeout(() => this.handleMessage(message, retryCount + 1), 1000);
      } else {
        const botMessage = this.createChatBotMessage('Sorry, I’m having trouble connecting. Try again or check the website.');
        this.setState(prev => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
      }
    }
  };

  handleFileUpload = () => {
    console.log('Triggering file upload'); // Debug log
    const botMessage = this.createChatBotMessage('Please upload a clear image of your medical report (e.g., PNG, JPG). Max size: 5MB.', {
      widget: 'fileUpload',
    });
    this.setState(prev => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  handleFileSelect = async file => {
    console.log('handleFileSelect called with file:', file); // Debug log
    try {
      if (!file) {
        const errorMessage = this.createChatBotMessage('No file selected. Please choose an image.');
        this.setState(prev => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
        }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        const errorMessage = this.createChatBotMessage('Please upload an image file (e.g., PNG, JPG).');
        this.setState(prev => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        const errorMessage = this.createChatBotMessage('File is too large. Please upload an image under 5MB.');
        this.setState(prev => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
        }));
        return;
      }

      this.selectedFile = file;
      const processingMessage = this.createChatBotMessage('Processing your report...', {
        widget: 'uploadProgress',
      });
      this.setState(prev => {
        console.log('Adding processing message:', processingMessage); // Debug log
        return {
          ...prev,
          messages: [...prev.messages, processingMessage],
        };
      });

      await this.handleFileSubmit();
    } catch (error) {
      console.error('Error in handleFileSelect:', error.message, error.stack); // Debug log
      const errorMessage = this.createChatBotMessage('Error processing file selection. Please try again.');
      this.setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
    }
  };

  handleFileSubmit = async (retryCount = 0) => {
    console.log('handleFileSubmit called, selectedFile:', this.selectedFile); // Debug log
    try {
      if (!this.selectedFile) {
        const errorMessage = this.createChatBotMessage('No file selected. Please choose an image first.');
        this.setState(prev => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
        }));
        return;
      }

      const formData = new FormData();
      formData.append('report', this.selectedFile);
      console.log('Sending file to backend:', this.selectedFile.name); // Debug log

      const response = await axios.post('http://localhost:5000/api/chatbot/chatbot', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Backend response for file:', response.data); // Debug log
      const resultMessage = this.createChatBotMessage(response.data.response || 'Report processed successfully.', {
        widget: response.data.data ? 'doctorList' : null,
        payload: response.data.data,
      });

      this.selectedFile = null;
      this.setState(prev => {
        console.log('Adding result message:', resultMessage); // Debug log
        const newMessages = [...prev.messages, resultMessage];
        localStorage.setItem('chatbotMessages', JSON.stringify(newMessages));
        return { ...prev, messages: newMessages };
      });
    } catch (error) {
      console.error('File upload error:', error.message, error.response?.data, error.response?.status); // Debug log
      if (retryCount < 2) {
        setTimeout(() => this.handleFileSubmit(retryCount + 1), 1000);
      } else {
        let errorMessage = 'Error processing report. Please try again or upload a different image.';
        if (error.response?.data?.error) {
          errorMessage = `Error: ${error.response.data.error}`;
        }
        const botMessage = this.createChatBotMessage(errorMessage);
        this.setState(prev => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
      }
    }
  };
}

export default ActionProvider;