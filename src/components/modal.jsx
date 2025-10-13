export default function Modal({content, onClose}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[20rem] mx-4">
        <p 
          className="text-black mb-6" 
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}