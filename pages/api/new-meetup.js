import { MongoClient } from "mongodb";

// example.com/api/new-meetup
async function hanlder(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    const client = await MongoClient.connect(
      "mongodb+srv://our-first-user:s65A50FoYIpskrsX@cluster0.kwbl2bq.mongodb.net/?retryWrites=true&w=majority"
    );

    const db = client.db();
    const meetupsCollection = db.collection("meetups");

    const result = await meetupsCollection.insertOne(data);

    client.close();
    res.status(201).json({ message: "Meetup Inserted" });
  }
}

export default hanlder;
