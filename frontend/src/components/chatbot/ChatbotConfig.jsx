const config = {
    initialMessages: [
      {
        id: 1,
        message: 'Hi! I can help you find doctors, register, or analyze a medical report. Upload your medical report below or type a message!',
        widget: 'fileUpload', // Add fileUpload widget directly
        onFileChange: props => props.actionProvider.handleFileChange, // Map to handleFileChange
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
        widgetName: 'doctorList',
        widgetFunc: props => {
          // Ensure payload is an array; fallback to empty array if not
          const doctors = Array.isArray(props.payload) ? props.payload : [];
          return (
            <div className="space-y-2">
              {doctors.length > 0 ? (
                doctors.map((doc, index) => (
                  <a
                    key={index}
                    href={`/doctor/${doc.id}`}
                    className="block p-2 bg-white rounded-lg shadow hover:bg-navy/10 transition-all duration-200"
                  >
                    <p className="font-semibold text-navy">{doc.name || 'Unknown Doctor'}</p>
                    <p className="text-sm text-gray-600">{doc.practice || 'Unknown Specialty'}</p>
                    <p className="text-sm text-gray-500">{doc.location || 'Unknown Location'}</p>
                  </a>
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
        widgetFunc: props => (
          <input
            type="file"
            accept="image/*"
            onChange={props.onFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-navy file:text-white hover:file:bg-navy/90"
          />
        ),
        mapStateToProps: ['onFileChange'],
      },
    ],
  };
  
  export default config;