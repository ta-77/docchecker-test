# test_key.py
from google import genai
import os

# ★ここに、functions/.env に書いたのと「同じ」APIキーを貼り付けてください
TEST_API_KEY = "AIzaSyCf_uCL4KYPJaTt1tiStirg6SGIHluHRRs" 

client = genai.Client(api_key=TEST_API_KEY)

print(f"--- キーのテストを開始します: {TEST_API_KEY[:10]}... ---")

try:
    # 1. モデル一覧を取得してみる
    print("1. モデル一覧を取得中...")
    pager = client.models.list(config={'page_size': 10})
    print("   成功！利用可能なモデル:")
    for model in pager:
        print(f"   - {model.name}")

    # 2. テキスト生成を試してみる
    print("\n2. テキスト生成テスト中 (gemini-1.5-flash)...")
    response = client.models.generate_content(
        model="gemini-1.5-flash", 
        contents="こんにちは"
    )
    print(f"   成功！AIの回答: {response.text}")

except Exception as e:
    print(f"\n❌ エラー発生: {e}")
    print("\n【診断結果】")
    if "404" in str(e):
        print("原因：このAPIキーのプロジェクトで「Generative Language API」が有効になっていません。")
        print("対処：Google Cloudコンソールで、キーを作成したプロジェクトを選択し、APIを有効化してください。")
    elif "400" in str(e):
        print("原因：APIキーが無効か、期限切れです。")