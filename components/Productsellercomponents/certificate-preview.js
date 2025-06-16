export function CertificatePreview({ name, date }) {
  return (
    <div className="relative w-full h-full bg-white p-8 border rounded-lg">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-blue-50 to-transparent"></div>
        <div className="absolute left-0 top-0 bottom-0 w-16">
          <div className="h-full w-full border-r-[40px] border-r-blue-700 border-y-transparent border-y-[400px] border-l-0"></div>
        </div>
        <div className="absolute left-12 top-0 bottom-0 w-8">
          <div className="h-full w-full border-r-[20px] border-r-yellow-500 border-y-transparent border-y-[400px] border-l-0"></div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold text-blue-900 tracking-wide mb-1">
          CERTIFICATE
        </h1>
        <h2 className="text-sm text-blue-800 tracking-wider mb-8">
          OF ACHIEVEMENT
        </h2>

        <div className="text-3xl font-script mb-8 text-gray-800">{name}</div>

        <p className="text-sm text-gray-600 max-w-md text-center mb-12">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation.
        </p>

        <div className="flex justify-between w-full max-w-md">
          <div className="flex flex-col items-center">
            <p className="text-xs text-gray-500 mb-1">DATE</p>
            <p className="text-sm">{date}</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-xs text-gray-500 mb-1">SIGNATURE</p>
            <div className="h-8 w-24 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="h-px w-full bg-gray-300"></div>
              </div>
            </div>
          </div>

          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full bg-yellow-500 opacity-20"></div>
            <div className="absolute inset-2 rounded-full bg-yellow-500 opacity-40"></div>
            <div className="absolute inset-4 rounded-full bg-yellow-500 opacity-60"></div>
            <div className="absolute inset-6 rounded-full bg-yellow-500 opacity-80"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
