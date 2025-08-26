// for insert initial data into our app to start with
// usually backend will do this for us and front end will use this dummy data for render and test UI

import { categories } from "@/db/schema";
import { db } from "..";

// this data seed by back end devs not users
const categoryNames = [
  "Cars and vehicles",
  "Comedy",
  "Education",
  "Gaming",
  "Entertaiment",
  "Film and animation",
  "How-to and style",
  "Music",
  "News and politics",
  "People and blogs",
  "Pets and animals",
  "Science and technology",
  "Sports",
  "Travel and events",
];

async function main() {
  try {
    console.log("seeding categories...");
    const values = categoryNames.map((name) => ({
      name,
      description: `Video related to ${name.toLowerCase()}`,
    }));

    await db.insert(categories).values(values);

    console.log("categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding categories error: ", error);
    process.exit(1); //bcs we sre in script
  }
}

main();

// instead of writing all data manually in our database tables we wrote a script like that to do it all in one go!
