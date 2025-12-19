import { createClient } from "@supabase/supabase-js";

// 🔑 환경변수 불러오기 (브라우저에서 사용 가능해야 하므로 NEXT_PUBLIC_)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

// 🛑 개발 중 실수 바로 알 수 있게 에러 로그
if (!supabaseUrl) {
  throw new Error(
    "❌ NEXT_PUBLIC_SUPABASE_URL is missing. Check your .env.local file."
  );
}

if (!supabaseKey) {
  throw new Error(
    "❌ NEXT_PUBLIC_SUPABASE_KEY is missing. Check your .env.local file."
  );
}

// ✅ Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
