import { useRouter } from "next/router";
import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";

import MeetupDetails from "../../components/meetups/MeetupDetails";

function MeetupDetailsPage({ meetupData }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{meetupData.title}</title>
      </Head>
      <MeetupDetails
        image={meetupData.image}
        title={meetupData.title}
        address={meetupData.address}
        description={meetupData.description}
      />
    </>
  );
}

// Prepare dynamic path before we run build proccess
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://our-first-user:s65A50FoYIpskrsX@cluster0.kwbl2bq.mongodb.net/?retryWrites=true&w=majority"
  );

  const db = client.db();
  const meetupCollection = db.collection("meetups");

  const meetups = await meetupCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    // false: just supports these params here. Otherwise, Visitors get 404 page
    // true: support all params out of these params. Not just these params but All incoming request. Render empty page before path is generated
    // 'blocking': list of paths
    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://our-first-user:s65A50FoYIpskrsX@cluster0.kwbl2bq.mongodb.net/?retryWrites=true&w=majority"
  );

  const db = client.db();
  const meetupCollection = db.collection("meetups");

  const meetup = await meetupCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: meetup._id.toString(),
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        description: meetup.description,
      },
    },
    revalidate: 1,
  };
}

export default MeetupDetailsPage;
