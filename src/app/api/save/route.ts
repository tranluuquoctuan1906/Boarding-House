import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";


export async function POST(req: Request) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("boarding-house-data");
  const result = await db.collection("histories").insertOne(body);
  return Response.json({
    ok: true,
    insertedId: result.insertedId,
  });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { _id, ...updateData } = body;
  const client = await clientPromise;
  const db = client.db("boarding-house-data");
  const result = await db
    .collection("histories")
    .updateOne(
      { _id: { $eq: new ObjectId(_id) } },
      { $set: updateData }
    );
  return Response.json({
    ok: result.modifiedCount === 1,
  });
}
