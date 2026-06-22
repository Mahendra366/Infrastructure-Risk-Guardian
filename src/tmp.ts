export const testGemini = async () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ API KEY NOT FOUND");
    return;
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: "Say hello in one line" }],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    console.log("✅ FULL RESPONSE:", data);

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("🤖 AI OUTPUT:", text);

  } catch (err) {
    console.error("❌ ERROR:", err);
  }
};