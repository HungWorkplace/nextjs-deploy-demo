import { MongoClient } from "mongodb";
import Head from "next/head";

import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  return (
    <>
      <Head>
        <title>Welcome!</title>
        <meta name="description" content="This is an amazing app!!!" />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
}

export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://our-first-user:s65A50FoYIpskrsX@cluster0.kwbl2bq.mongodb.net/?retryWrites=true&w=majority"
  );

  const db = client.db();
  const meetupCollection = db.collection("meetups");

  const meetups = await meetupCollection.find().toArray();

  client.close();
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}

//  Not run during the build proccess. It run on server after deploy (Never in Client)
// export async function getServerSideProps(content) {
//   // request, response
//   const req = content.req;
//   const res = content.res;

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export default HomePage;
