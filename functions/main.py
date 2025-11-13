# functions/main.py

import os
import re
import io # ファイルをメモリで扱うために必要
from firebase_admin import initialize_app
from firebase_functions import https_fn, options
from docx import Document
import google.generativeai as genai

# Firebaseアプリの初期化
initialize_app()

# --- 重要 ---
# ★タスク4（FRB-3.1）: Gemini APIキーをシークレットに設定する
# ターミナルで `firebase functions:secrets:set GEMINI_API_KEY` を実行し、
# 以下の `GEMINI_API_KEY` の部分にご自身のシークレット名を入力してください。
# (シークレット名は 'GEMINI_API_KEY' が推奨です)
genai.configure(
    api_key=options.SecretParam("GEMINI_API_KEY")
)

# --- ★ここからがバックエンドAPI本体 ---

# /api/check へのリクエストを処理する関数 (firebase.json で設定)
# v2 (第2世代) Cloud Functions を使用
@https_fn.on_request(
    region="us-central1", # 東京リージョン (推奨)
    memory=options.MemoryOption.GB_1, # メモリ (必要に応じて調整)
    timeout_sec=300, # タイムアウト (秒)
    # フロントエンドのURL (Hosting URL) からのアクセスを許可する
    # 開発中は "*" (すべて許可) でも良い
    cors=options.CorsOptions(
        cors_origins=[
            "https*://docchecker-test.web.app" # ご自身のHosting URL
        ],
        cors_methods=["post"]
    )
)
def checkDocument(req: https_fn.Request) -> https_fn.Response:
    """
    Wordファイルを受け取り、ルールベースおよびAIベースのチェックを実行する
    HTTP Function。
    """

    # --- FRB-1.1: リクエスト検証 ---
    if req.method != "POST":
        return https_fn.Response(
            {"detail": f"Method {req.method} not allowed. Use POST."},
            status=405,
            mimetype="application/json"
        )

    if not req.files or 'file' not in req.files:
        return https_fn.Response(
            {"detail": "File not found in request"}, # services/documentCheckerService.ts が期待するエラー
            status=400, # 400 Bad Request
            mimetype="application/json"
        )

    uploaded_file = req.files['file']

    if uploaded_file.content_type != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return https_fn.Response(
            {"detail": "Invalid file type. Only .docx is allowed."},
            status=400, # 400 Bad Request
            mimetype="application/json"
        )

    try:
        # --- ここからがタスク5, 6の実装場所 ---

        # (これは「雛形」のため、ダミーの(モック)データを返します)
        # (タスク5, 6で、この部分を本物のロジックに置き換えます)

        # ファイルをメモリ上で読み込む (タスク5で必要)
        # file_stream = io.BytesIO(uploaded_file.read())
        # document = Document(file_stream)
        # print(f"Processing file: {uploaded_file.name}")

        # AIモデルを取得 (タスク6で必要)
        # model = genai.GenerativeModel("gemini-1.5-flash")
        
        # --- ダミーデータ (Mock) ---
        # types.ts の CheckResult 型に一致するJSON
        mock_result = {
            "documentStructure": [
                {
                    "type": "paragraph",
                    "text": f"ファイル '{uploaded_file.name}' を受信しました。",
                    "style": "本文",
                    "errors": [],
                    "runs": [
                        {"text": f"ファイル '{uploaded_file.name}' を受信しました。", "font": "MS明朝", "errors": []}
                    ]
                }
            ],
            "aiSuggestions": [
                {"message": "Pythonバックエンド(雛形)からの応答です。タスク5, 6でここにAIの解析結果が入ります。"}
            ]
        }
        # --- ダミーデータここまで ---


        # --- FRB-4.2: レスポンス返却 ---
        return https_fn.Response(
            mock_result,
            status=200,
            mimetype="application/json"
        )

    except Exception as e:
        # --- FRB-1.3: 内部エラー処理 ---
        print(f"Internal Server Error: {e}") # ログにエラーを出力
        return https_fn.Response(
            {"detail": f"Internal server error: {str(e)}"},
            status=500, # 500 Internal Server Error
            mimetype="application/json"
        )