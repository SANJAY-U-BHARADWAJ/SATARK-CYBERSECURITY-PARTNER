async function test() {
  const res = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'hi' }] })
  });
  const text = await res.text();
  console.log("STATUS:", res.status);
  console.log("BODY:", text);
}
test();
