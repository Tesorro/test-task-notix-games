import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get('q') || "").trim()
  console.log('query', query);
  if (!query) {
    return NextResponse.json({ users: [], total: 0 });
  }

  try {
    const response = await fetch(`https://dummyjson.com/users/search?q=${encodeURIComponent(query)}`);
    console.log('response', response);

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({
        error: `Status (${response.status}): ${text}`
      }, { status: 502 })
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}