import React, { useState, useCallback } from 'react';
import { checkDocument } from './services/documentCheckerService';
import { CheckResult } from './types';
import FileUpload from './components/FileUpload';
import ResultDisplay from './components/ResultDisplay';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((file: File | null) => {
    setSelectedFile(file);
    setCheckResult(null);
    setError(null);
  }, []);

  const handleCheckDocument = async () => {
    if (!selectedFile) {
      setError('ファイルが選択されていません。');
      return;
    }

    setIsLoading(true);
    setCheckResult(null);
    setError(null);

    try {
      const result = await checkDocument(selectedFile);
      setCheckResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">自動書類チェッカー</h1>
          <p className="mt-2 text-lg text-slate-600">Wordファイル（.docx）をアップロードしてフォーマットと内容をチェックします。</p>
        </header>

        <main className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-200">
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-2">1. ファイルを選択</h2>
              <FileUpload onFileChange={handleFileChange} />
              <button
                onClick={handleCheckDocument}
                disabled={!selectedFile || isLoading}
                className="w-full mt-4 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    <span className="ml-2">チェック中...</span>
                  </>
                ) : (
                  'ドキュメントをチェック'
                )}
              </button>
            </div>
            
            <div className="w-full md:w-2/3">
               <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-2">2. チェック結果</h2>
              <div className="w-full min-h-[24rem] bg-slate-100 rounded-lg border border-slate-300 shadow-inner">
                 {error && (
                  <div className="h-full flex items-center justify-center text-center p-4 bg-red-50 text-red-700 rounded-lg">
                    <p><span className="font-bold">エラー:</span> {error}</p>
                  </div>
                )}
                {!error && !isLoading && !checkResult && (
                  <div className="h-full flex items-center justify-center text-center p-4 text-slate-500">
                    <p>ファイルをアップロードして<br/>「ドキュメントをチェック」ボタンを押してください。</p>
                  </div>
                )}
                {isLoading && (
                   <div className="h-full flex items-center justify-center text-slate-600">
                    <Spinner className="w-8 h-8 text-slate-500"/>
                    <span className="ml-3 text-lg">解析しています...</span>
                  </div>
                )}
                {checkResult && <ResultDisplay result={checkResult} />}
              </div>
            </div>
          </div>
        </main>
        
        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} 自動書類チェッカー MVP v1.0</p>
        </footer>
      </div>
    </div>
  );
};

export default App;