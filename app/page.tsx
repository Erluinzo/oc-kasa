import { getProperties, getProperty } from "@/lib/api";

//temporary page: shows the API data until the real home page is built
export default async function Home() {
  const properties = await getProperties();
  const first = await getProperty(properties[0].id);

  return (
    <main>
      <h1>Kasa</h1>
      <p>{properties.length} logements</p>
      <ul>
        {properties.map((property) => (
          <li key={property.id}>
            {property.title} ({property.location}) : {property.price_per_night} € / nuit
          </li>
        ))}
      </ul>
      <h2>Détail du premier logement</h2>
      <pre>{JSON.stringify(first, null, 2)}</pre>
    </main>
  );
}
