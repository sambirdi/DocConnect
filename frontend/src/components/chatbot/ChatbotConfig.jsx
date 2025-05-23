import { Link } from 'react-router-dom';

const config = {
  initialMessages: [
    {
      id: 1,
      message: 'Welcome to DocConnect! I can help you find doctors, learn about the website, or analyze medical reports. What would you like to do?',
      widget: 'welcomeOptions',
    },
  ],
  botName: 'HealthBot',
  customStyles: {
    botMessageBox: { backgroundColor: '#0A2647' },
    chatButton: { backgroundColor: '#0A2647' },
  },
  customComponents: {
    botAvatar: () => (
      <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white font-bold">
        H
      </div>
    ),
  },
  widgets: [
    {
      widgetName: 'welcomeOptions',
      widgetFunc: props => (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => props.actionProvider.handleMessage('find doctor')}
            className="px-3 py-1 bg-navy text-white rounded-lg hover:bg-navy/90"
          >
            Find Doctor
          </button>
          <button
            onClick={() => props.actionProvider.handleMessage('about website')}
            className="px-3 py-1 bg-navy text-white rounded-lg hover:bg-navy/90"
          >
            About Website
          </button>
          <button
            onClick={() => props.actionProvider.handleFileUpload()}
            className="px-3 py-1 bg-navy text-white rounded-lg hover:bg-navy/90"
          >
            Upload Report
          </button>
        </div>
      ),
    },
    {
      widgetName: 'doctorList',
      widgetFunc: props => {
        const doctors = Array.isArray(props.payload) ? props.payload : [];
        return (
          <div className="space-y-2">
            {doctors.length > 0 ? (
              doctors.map((doc, index) => (
                <Link
                  key={index}
                  to={`/doctor/${doc.id}`}
                  className="block p-2 bg-white rounded-lg shadow hover:bg-navy/10 transition-all duration-200"
                >
                  <p className="font-semibold text-navy">{doc.name}</p>
                  <p className="text-sm text-gray-600">{doc.practice}</p>
                  <p className="text-sm text-gray-500">{doc.location}</p>
                </Link>
              ))
            ) : (
              <p className="text-gray-600">No doctors found.</p>
            )}
          </div>
        );
      },
    },
    {
      widgetName: 'fileUpload',
      widgetFunc: props => {
        console.log('fileUpload widget props:', {
          hasActionProvider: !!props.actionProvider,
          hasHandleFileSelect: typeof props.actionProvider?.handleFileSelect === 'function',
        });
        return (
          <input
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files[0];
              console.log('File input changed:', file);
              if (file && typeof props.actionProvider?.handleFileSelect === 'function') {
                props.actionProvider.handleFileSelect(file);
              } else {
                console.error('handleFileSelect is not a function or file is missing', {
                  file,
                  handleFileSelect: props.actionProvider?.handleFileSelect,
                });
              }
            }}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-navy file:text-white hover:file:bg-navy/90"
          />
        );
      },
    },
    {
      widgetName: 'uploadProgress',
      widgetFunc: () => (
        <div className="flex items-center justify-center">
          {/* <svg className="animate-spin h-5 w-5 text-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg> */}
          <span className="ml-2 text-gray-700">Processing...</span>
        </div>
      ),
    },
  ],
};

export default config;