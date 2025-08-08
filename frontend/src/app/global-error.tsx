'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const handleGoHome = () => {
    // Use window.location instead of router.push in error boundaries
    window.location.href = '/dashboard';
  };

  return (
    <html>
      <body className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold">Đã có lỗi xảy ra!</h1>
        <button
          onClick={() => reset()}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md cursor-pointer"
        >
          Thử lại
        </button>
        <button
          onClick={handleGoHome}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md cursor-pointer"
        >
          Quay lại trang chủ
        </button>
      </body>
    </html>
  );
}
