# functions/main.py

import os  # ★ 解決策 1: os がインポートされているか確認
import re
import io
from firebase_admin import initialize_app
from firebase_functions import https_fn, options  # ★ 解決策 2: options がインポートされているか確認
from docx import Document
import google.generativeai as genai

# Firebaseアプリの初期化
initialize_app()

# --- ★ APIキー設定（ローカル / 本番 両対応）---
# 1. まずローカルの .env ファイルからキーを読み込もうとする
api_key = os.environ.get("GEMINI_API_KEY")

if not api_key:
    # 2. ローカルにキーがなければ、本番（Blaze）のシークレットを参照する
    api_key = options.SecretParam("GEMINI_API_KEY")

# 3. 取得できたキーで genai を設定
genai.configure(
    api_key=api_key
)
# --- ★ APIキー設定ここまで ---


# --- ★ここからがバックエンドAPI本体 ---

@https_fn.on_request(
    region="us-central1",  # ★ 解決策 3: ローカルエミュレータ用 (テスト用)
    memory=options.MemoryOption.GB_1,
    timeout_sec=300,
    cors=options.CorsOptions(
        cors_origins=[
            "http://127.0.0.1:5000", # ローカルエミュレータ用
            "http://localhost:5000",  # ローカルエミュレータ用
            "https*://doccheck-test.web.app" # 本番のHosting URL
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
            {"detail": "File not found in request"},
            status=400,
            mimetype="application/json"
        )

    uploaded_file = req.files['file']

    if uploaded_file.content_type != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return https_fn.Response(
            {"detail": "Invalid file type. Only .docx is allowed."},
            status=400,
            mimetype="application/json"
        )

    try:
        # --- ここからがタスク5, 6の実装場所 ---

        # (これは「雛形」のため、ダミーの(モック)データを返します)
        # (タスク5, 6で、この部分を本物のロジックに置き換えます)

        # file_stream = io.BytesIO(uploaded_file.read())
        # document = Document(file_stream)
        
        # model = genai.GenerativeModel("gemini-1.5-flash")
        
        # --- ダミーデータ (Mock) ---
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
                {"message": "Pythonバックエンド(雛形)からの応答です。ローカルの .env からAPIキーを読み込みました。"}
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
        print(f"Internal Server Error: {e}") 
        return https_fn.Response(
            {"detail": f"Internal server error: {str(e)}"},
            status=500,
            mimetype="application/json"
        )