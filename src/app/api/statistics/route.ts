import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("boarding-house-data");
  const result = await db.collection("statistics").insertOne(body);
  return Response.json({
    ok: true,
    insertedId: result.insertedId,
  });
}

export async function GET() {
  const client = await clientPromise;
  const db = client.db("boarding-house-data");
  const statistics = await db.collection("statistics").find({}).toArray();
  return Response.json(statistics);
}