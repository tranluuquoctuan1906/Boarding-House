import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("boarding-house-data");
  const histories = await db
    .collection("histories")
    .find({})
    .sort({ updateAt: -1 })
    .toArray();
  return Response.json(histories);
}
