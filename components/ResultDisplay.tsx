import React from 'react';
import { CheckResult, ErrorDetail } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import ExclamationCircleIcon from './icons/ExclamationCircleIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';

interface ResultDisplayProps {
  result: CheckResult;
}

const RunErrorTooltip: React.FC<{ errors: ErrorDetail[] }> = ({ errors }) => (
  <div className="absolute bottom-full mb-2 w-max max-w-xs p-2 text-sm text-white bg-slate-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
    {errors.map((error, index) => (
      <p key={index} className="font-sans">
        <span className="font-bold">{error.type}:</span> {error.message}
      </p>
    ))}
    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-700"></div>
  </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-md text-slate-800">
      
      {/* AI Suggestions */}
      {result.aiSuggestions && result.aiSuggestions.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center border-b pb-2 mb-3">
            <SparklesIcon className="w-6 h-6 mr-2 text-indigo-500" />
            AIからの提案
          </h3>
          <ul className="space-y-3">
            {result.aiSuggestions.map((suggestion, index) => (
              <li key={index} className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-start">
                <SparklesIcon className="w-5 h-5 mr-3 text-indigo-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-indigo-900 font-sans">{suggestion.message}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Document Structure with Errors */}
      <section>
        <h3 className="text-lg font-semibold text-slate-800 flex items-center border-b pb-2 mb-3">
            <DocumentTextIcon className="w-6 h-6 mr-2 text-slate-600" />
            詳細なチェック結果
        </h3>
        <div className="space-y-4">
          {result.documentStructure.map((paragraph, pIndex) => (
            <div key={pIndex} className={`p-3 rounded-lg transition-colors ${paragraph.errors.length > 0 ? 'bg-red-50 border border-red-200' : 'bg-slate-50 border border-slate-200'}`}>
              <p className="text-base leading-relaxed whitespace-pre-wrap font-serif">
                {paragraph.runs.map((run, rIndex) => (
                  <span key={rIndex} className={run.errors.length > 0 ? 'relative group' : ''}>
                    <span className={run.errors.length > 0 ? 'bg-yellow-200 decoration-red-500 underline underline-offset-2 decoration-2 cursor-help rounded-[2px]' : ''}>
                      {run.text}
                    </span>
                    {run.errors.length > 0 && <RunErrorTooltip errors={run.errors} />}
                  </span>
                ))}
              </p>
              {paragraph.errors.length > 0 && (
                <div className="mt-3 pt-3 border-t border-red-200 space-y-2">
                  {paragraph.errors.map((error, eIndex) => (
                    <div key={eIndex} className="flex items-start text-sm text-red-800 font-sans">
                      <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                      <p><span className="font-bold">{error.type}:</span> {error.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default ResultDisplay;