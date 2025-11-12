import { CheckResult } from '../types';

/**
 * Sends the document to the backend API for checking.
 * @param file The .docx file to be checked.
 * @returns A promise that resolves with the check result.
 * @throws An error if the API call fails.
 */
export const checkDocument = async (file: File): Promise<CheckResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/check', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = `サーバーエラーが発生しました (ステータス: ${response.status})。`;
    switch (response.status) {
      case 400:
        errorMessage = 'リクエストが不正です。ファイル形式が.docxであることを確認してください。';
        break;
      case 422:
        errorMessage = 'ファイルが破損しているか、サーバーが解析できませんでした。';
        break;
      case 500:
        errorMessage = 'サーバー内部でエラーが発生しました。しばらくしてから再度お試しください。';
        break;
      default:
        try {
          const errorData = await response.json();
          if (errorData && errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch (e) {
          // Response body might not be JSON, stick with the default message.
        }
    }
    throw new Error(errorMessage);
  }

  try {
    const result: CheckResult = await response.json();
    return result;
  } catch (error) {
    throw new Error('サーバーからの応答を解析できませんでした。予期しない形式の可能性があります。');
  }
};
